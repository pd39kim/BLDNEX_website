import { DAY, type Env } from './env';
const LEASE_MS = 120_000;
// Stay inside Resend's 24-hour idempotency window, including network timeout margin.
export const RETRY_WINDOW = 23 * 3_600_000;
interface Job { id: string; inquiry_id: string; payload: string; send_key: string; attempts: number; first_attempt_at: number; lease_token: string }

export async function sendNotifications(env: Env, transport: typeof fetch = fetch, now = Date.now()) {
  if (!env.CONTACT_DB || !env.RESEND_API_KEY) return;
  const startedAt = Date.now();
  const db = env.CONTACT_DB;
  const due = await db.prepare(`SELECT j.id FROM notification_jobs j JOIN inquiries i ON i.id = j.inquiry_id
    WHERE i.purge_after > ? AND ((j.state IN ('pending','retry') AND j.next_attempt_at <= ?) OR (j.state = 'processing' AND j.lease_until <= ?))
    ORDER BY j.next_attempt_at LIMIT 10`).bind(now, now, now).all<{ id: string }>();
  for (const row of due.results) {
    // Each job gets a full lease, even if previous provider calls took time.
    const attemptAt = now + (Date.now() - startedAt);
    const lease = crypto.randomUUID();
    const job = await db.prepare(`UPDATE notification_jobs SET state='processing', lease_token=?, lease_until=?,
      attempts=attempts+1, revision=revision+1, first_attempt_at=COALESCE(first_attempt_at,?), updated_at=?
      WHERE id=? AND ((state IN ('pending','retry') AND next_attempt_at <= ?) OR (state='processing' AND lease_until <= ?))
      AND EXISTS (SELECT 1 FROM inquiries WHERE id=inquiry_id AND purge_after > ?) RETURNING *`)
      .bind(lease, attemptAt + LEASE_MS, attemptAt, attemptAt, row.id, attemptAt, attemptAt, attemptAt).first<Job>();
    if (!job) continue;
    let state = 'retry', error = 'network_error', providerId: string | null = null;
    if (attemptAt - job.first_attempt_at >= RETRY_WINDOW || job.attempts > 8) {
      state = 'failed'; error = 'retry_window_expired';
    } else {
      try {
        const response = await transport('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(10_000),
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': job.send_key },
          body: job.payload,
        });
        if (response.ok) {
          const result = await response.json() as { id?: string };
          if (!result.id || typeof result.id !== 'string') throw new Error();
          state = 'provider_accepted'; providerId = result.id; error = '';
        } else {
          error = `provider_${response.status}`;
          if (response.status < 500 && ![408, 409, 429].includes(response.status)) state = 'failed';
        }
      } catch { /* durable retry; do not log the provider response */ }
      if (state === 'retry' && job.attempts >= 8) { state = 'failed'; error = 'attempts_exhausted'; }
    }
    const finishedAt = now + (Date.now() - startedAt);
    const next = finishedAt + Math.min(3_600_000, 60_000 * 2 ** Math.min(job.attempts, 6));
    await db.prepare(`UPDATE notification_jobs SET state=?, error_code=?, provider_id=?, next_attempt_at=?,
      lease_until=NULL, lease_token=NULL, revision=revision+1, updated_at=? WHERE id=? AND lease_token=?`)
      .bind(state, error || null, providerId, next, finishedAt, job.id, lease).run();
  }
}

export async function purgeExpired(env: Env, now = Date.now()) {
  const db = env.CONTACT_DB;
  if (!db) return;
  // A live sender has a bounded lease: defer deletion until its HTTP call has finished.
  // The same predicate appears in both statements; the batch is transactional.
  const predicate = `purge_after <= ? AND NOT EXISTS (SELECT 1 FROM notification_jobs j
    WHERE j.inquiry_id=inquiries.id AND j.state='processing' AND j.lease_until > ?)`;
  await db.batch([
    db.prepare(`INSERT INTO admin_events (id,inquiry_id,actor,action,created_at)
      SELECT lower(hex(randomblob(16))),id,'system','retention_purge',? FROM inquiries WHERE ${predicate}`).bind(now, now, now),
    db.prepare(`DELETE FROM inquiries WHERE ${predicate}`).bind(now, now),
    db.prepare('DELETE FROM rate_limits WHERE expires_at <= ?').bind(now),
    db.prepare('DELETE FROM admin_events WHERE created_at <= ?').bind(now - 365 * DAY),
  ]);
}

export async function runMaintenance(env: Env, transport: typeof fetch = fetch, now = Date.now()) {
  if (env.JOBS_ENABLED !== 'true' || !env.CONTACT_DB) return;
  await purgeExpired(env, now); // retention continues even when intake is switched off
  if (!env.RESEND_API_KEY) return; // don't advertise a healthy notification worker without credentials
  await sendNotifications(env, transport, now);
  await env.CONTACT_DB.prepare(`INSERT INTO system_health(name,checked_at) VALUES('jobs',?)
    ON CONFLICT(name) DO UPDATE SET checked_at=excluded.checked_at`).bind(now).run();
}
