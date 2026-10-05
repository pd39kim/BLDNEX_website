import { RETENTION_DAYS, statuses, type Status } from '../shared/contact';
import { DAY, type Env } from './env';
import { HttpError, json, readJson, sameOrigin } from './http';
import { RETRY_WINDOW } from './jobs';

export async function adminApi(request: Request, env: Env, actor: string, now = Date.now()) {
  const db = env.CONTACT_DB;
  if (!db) throw new HttpError(503, 'unavailable');
  const url = new URL(request.url);
  const match = url.pathname.match(/^\/api\/admin\/inquiries(?:\/(BN-[0-9a-f-]{36})(?:\/(status|retry))?)?$/);
  if (!match) throw new HttpError(404, 'not_found');
  const [, id, action] = match;
  if (request.method === 'GET' && !id) {
    const status = url.searchParams.get('status') ?? '';
    if (status && !Object.hasOwn(statuses, status)) throw new HttpError(400, 'invalid_filter');
    const cursor = url.searchParams.get('cursor') ?? '';
    if (cursor && !/^\d{13}\|BN-[0-9a-f-]{36}$/.test(cursor)) throw new HttpError(400, 'invalid_cursor');
    const [time, cursorId] = cursor.split('|');
    const rows = await db.prepare(`SELECT i.id,i.name,i.project_type,i.status,i.created_at,i.version,j.state AS notification_state
      FROM inquiries i LEFT JOIN notification_jobs j ON j.inquiry_id=i.id
      WHERE (?='' OR i.status=?) AND (?='' OR i.created_at < ? OR (i.created_at = ? AND i.id < ?))
      ORDER BY i.created_at DESC,i.id DESC LIMIT 51`)
      .bind(status, status, cursor, Number(time || 0), Number(time || 0), cursorId ?? '').all<{ id: string; created_at: number }>();
    const items = rows.results.slice(0, 50);
    const last = items.at(-1);
    const health = await db.prepare("SELECT checked_at FROM system_health WHERE name='jobs'").first();
    const failed = await db.prepare("SELECT COUNT(*) AS count FROM notification_jobs WHERE state='failed'").first<{ count: number }>();
    return json({ items, nextCursor: rows.results.length > 50 && last ? `${last.created_at}|${last.id}` : null, health, failed: failed?.count ?? 0 });
  }
  if (request.method === 'GET' && id && !action) {
    const inquiry = await db.prepare(`SELECT id,project_type,name,company,email,phone,budget,schedule,description,consent_version,
      consent_at,optional_consent,status,version,created_at,updated_at,closed_at,purge_after FROM inquiries WHERE id=?`).bind(id).first();
    if (!inquiry) throw new HttpError(404, 'not_found');
    const notification = await db.prepare(`SELECT state,attempts,first_attempt_at,next_attempt_at,provider_id,error_code,lease_until
      FROM notification_jobs WHERE inquiry_id=?`).bind(id).first();
    const audit = await db.prepare('SELECT actor,action,created_at FROM admin_events WHERE inquiry_id=? ORDER BY created_at DESC LIMIT 30').bind(id).all();
    return json({ inquiry, notification, audit: audit.results });
  }
  if (!id || !['PATCH', 'POST', 'DELETE'].includes(request.method)) throw new HttpError(405, 'method_not_allowed');
  sameOrigin(request, env.CONTACT_ORIGIN);
  const body = await readJson(request, 2000);
  const log = (event: string) => db.prepare(`INSERT INTO admin_events(id,inquiry_id,actor,action,created_at)
    SELECT ?,?,?,?,? WHERE changes()=1`).bind(crypto.randomUUID(), id, actor, event, now);
  if (request.method === 'PATCH' && action === 'status') {
    if (typeof body.status !== 'string' || !Object.hasOwn(statuses, body.status) || !Number.isInteger(body.version)) throw new HttpError(422, 'validation');
    const status = body.status as Status;
    const results = await db.batch([
      db.prepare(`UPDATE inquiries SET status=?,version=version+1,updated_at=?,closed_at=?,
        purge_after=CASE WHEN ?='closed' THEN ? ELSE purge_after END WHERE id=? AND version=? AND status!='closed' AND purge_after>?`)
        .bind(status, now, status === 'closed' ? now : null, status, now + RETENTION_DAYS.closed * DAY, id, body.version, now),
      log(`status:${status}`),
    ]);
    if (!results[0].meta.changes) throw new HttpError(409, 'changed_or_closed');
    return json({ ok: true });
  }
  if (request.method === 'POST' && action === 'retry') {
    const job = await db.prepare('SELECT * FROM notification_jobs WHERE inquiry_id=?').bind(id).first<{
      state: string; first_attempt_at: number | null; revision: number; send_key: string;
    }>();
    if (!job) throw new HttpError(404, 'not_found');
    if (['processing', 'provider_accepted'].includes(job.state)) throw new HttpError(409, 'notification_locked');
    const expired = job.first_attempt_at !== null && now - job.first_attempt_at >= RETRY_WINDOW;
    if (expired && body.acknowledgeDuplicateRisk !== true) throw new HttpError(409, 'duplicate_risk');
    const result = await db.batch([
      db.prepare(`UPDATE notification_jobs SET state='pending',attempts=0,next_attempt_at=?,updated_at=?,error_code=NULL,revision=revision+1,
        send_key=?,first_attempt_at=? WHERE inquiry_id=? AND revision=? AND state IN ('pending','retry','failed')
        AND EXISTS (SELECT 1 FROM inquiries WHERE id=? AND purge_after > ?)`)
        .bind(now, now, expired ? `contact/${crypto.randomUUID()}` : job.send_key, expired ? null : job.first_attempt_at, id, job.revision, id, now),
      log(expired ? 'notification_retry:duplicate_risk_acknowledged' : 'notification_retry'),
    ]);
    if (!result[0].meta.changes) throw new HttpError(409, 'notification_locked');
    return json({ ok: true });
  }
  if (request.method === 'DELETE' && !action) {
    if (body.confirmId !== id) throw new HttpError(422, 'confirmation_required');
    const results = await db.batch([
      db.prepare(`DELETE FROM inquiries WHERE id=? AND NOT EXISTS (SELECT 1 FROM notification_jobs
        WHERE inquiry_id=? AND state='processing' AND lease_until>?)`).bind(id, id, now),
      log('manual_delete'),
    ]);
    if (!results[0].meta.changes) throw new HttpError(409, 'not_found_or_sending');
    return json({ ok: true });
  }
  throw new HttpError(405, 'method_not_allowed');
}
