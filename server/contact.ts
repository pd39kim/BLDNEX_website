import { POLICY_VERSION, RETENTION_DAYS, projectTypes, validateContact } from '../shared/contact';
import type { Env } from './env';
import { DAY } from './env';
import { authConfigured } from './auth';
import { HttpError, hash, json, readJson, sameOrigin } from './http';

export function settingsReady(env: Env) {
  return !!(env.CONTACT_DB && env.CONTACT_ENABLED === 'true' && env.CONTACT_POLICY_APPROVED === POLICY_VERSION &&
    env.CONTACT_ORIGIN && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY &&
    (env.RATE_LIMIT_SECRET?.length ?? 0) >= 32 && env.NOTIFY_FROM && env.NOTIFY_TO && authConfigured(env));
}
export async function intakeReady(env: Env, now = Date.now()) {
  if (!settingsReady(env)) return false;
  const heartbeat = await env.CONTACT_DB!.prepare("SELECT checked_at FROM system_health WHERE name = 'jobs'").first<{ checked_at: number }>();
  return !!heartbeat && heartbeat.checked_at <= now + 60_000 && heartbeat.checked_at > now - 15 * 60_000;
}
export async function configuration(request: Request, env: Env) {
  let enabled = false;
  try { enabled = new URL(request.url).origin === env.CONTACT_ORIGIN && await intakeReady(env); } catch { /* fail closed */ }
  return json({ enabled, policyVersion: POLICY_VERSION, siteKey: enabled ? env.TURNSTILE_SITE_KEY : null });
}
async function rateLimit(env: Env, value: string, limit: number, window: number, now: number) {
  const slot = Math.floor(now / window);
  // Keyed, time-bucketed fingerprint. Raw IP and email are not retained in the rate table.
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.RATE_LIMIT_SECRET!), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${slot}:${value}`));
  const bucket = [...new Uint8Array(signature)].map((v) => v.toString(16).padStart(2, '0')).join('');
  const row = await env.CONTACT_DB!.prepare(`INSERT INTO rate_limits (bucket, hits, expires_at) VALUES (?,1,?)
    ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1 RETURNING hits`).bind(bucket, (slot + 1) * window).first<{ hits: number }>();
  if (!row || row.hits > limit) throw new HttpError(429, 'rate_limited');
}
interface Receipt { id: string; payload_hash: string; created_at: number }
function receiptResponse(row: Receipt, payloadHash: string, status = 200) {
  if (row.payload_hash !== payloadHash) throw new HttpError(409, 'request_conflict');
  return json({ receipt: row.id, receivedAt: new Date(row.created_at).toISOString() }, status);
}
export async function submitContact(request: Request, env: Env, transport: typeof fetch = fetch, now = Date.now()) {
  sameOrigin(request, env.CONTACT_ORIGIN);
  if (!await intakeReady(env, now)) throw new HttpError(503, 'unavailable');
  const raw = await readJson(request);
  if (raw.website) throw new HttpError(400, 'invalid_request'); // honeypot; never pretend to accept
  const key = request.headers.get('Idempotency-Key') ?? '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key)) throw new HttpError(400, 'invalid_request');
  const { data, errors } = validateContact(raw);
  if (Object.keys(errors).length) throw new HttpError(422, 'validation', errors);
  const requestHash = await hash(key);
  const payloadHash = await hash(JSON.stringify(data));
  const db = env.CONTACT_DB!;
  const lookup = () => db.prepare('SELECT id, payload_hash, created_at FROM inquiries WHERE request_hash = ?').bind(requestHash).first<Receipt>();
  const existing = await lookup();
  // An already saved, identical request can be recovered with the original key, even after CAPTCHA is spent.
  if (existing) return receiptResponse(existing, payloadHash);
  await rateLimit(env, `ip:${request.headers.get('CF-Connecting-IP') ?? 'unknown'}`, 10, 600_000, now);
  if (typeof raw.token !== 'string' || !raw.token || raw.token.length > 2048) throw new HttpError(422, 'captcha');
  let challenge: { success?: boolean; action?: string; hostname?: string };
  try {
    const response = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: raw.token }),
    });
    if (!response.ok) throw new Error();
    challenge = await response.json();
  } catch { throw new HttpError(503, 'captcha_unavailable'); }
  if (!challenge.success || challenge.action !== 'contact' || challenge.hostname !== new URL(env.CONTACT_ORIGIN!).hostname) {
    // A concurrent copy may already have consumed the one-use token and saved this inquiry.
    const saved = await lookup();
    if (saved) return receiptResponse(saved, payloadHash);
    throw new HttpError(422, 'captcha');
  }
  await rateLimit(env, `email:${data.email.toLowerCase()}`, 3, 3_600_000, now);
  // Invalid CAPTCHA traffic must not exhaust the entire site's daily intake allowance.
  await rateLimit(env, 'global', 200, DAY, now);
  const id = `BN-${crypto.randomUUID()}`;
  const jobId = crypto.randomUUID();
  const notification = {
    from: env.NOTIFY_FROM, to: [env.NOTIFY_TO],
    subject: `[BLDNEX] 새 프로젝트 문의 · ${id}`,
    text: `새 프로젝트 문의가 저장되었습니다.\n접수번호: ${id}\n유형: ${projectTypes[data.projectType]}\n접수시각: ${new Date(now).toISOString()}\n관리자 확인: ${env.CONTACT_ORIGIN}/admin/inquiries?id=${id}\n\n문의 내용과 연락처는 관리자 화면에서 확인해주세요.`,
  };
  await db.batch([
    db.prepare(`INSERT INTO inquiries (id,request_hash,payload_hash,project_type,name,company,email,phone,budget,schedule,description,
      consent_version,consent_at,optional_consent,created_at,updated_at,purge_after)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_hash) DO NOTHING`)
      .bind(id, requestHash, payloadHash, data.projectType, data.name, data.company, data.email, data.phone, data.budget,
        data.schedule, data.description, POLICY_VERSION, now, Number(data.optionalConsent), now, now, now + RETENTION_DAYS.open * DAY),
    db.prepare(`INSERT INTO notification_jobs (id,inquiry_id,payload,send_key,next_attempt_at,updated_at)
      SELECT ?,id,?,?,?,? FROM inquiries WHERE id = ? ON CONFLICT(inquiry_id) DO NOTHING`)
      .bind(jobId, JSON.stringify(notification), `contact/${jobId}`, now, now, id),
  ]);
  const saved = await lookup();
  if (!saved) throw new HttpError(503, 'unavailable');
  return receiptResponse(saved, payloadHash, saved.id === id ? 201 : 200);
}
