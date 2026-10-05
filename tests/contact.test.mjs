import assert from 'node:assert/strict';
import { before, beforeEach, after, test } from 'node:test';
import { readFile, readdir } from 'node:fs/promises';
import { getPlatformProxy } from 'wrangler';
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose';
import { handleApi } from '../server/api.ts';
import { runMaintenance, sendNotifications, purgeExpired, RETRY_WINDOW } from '../server/jobs.ts';
import { validateContact, POLICY_VERSION } from '../shared/contact.ts';
import { DAY } from '../server/env.ts';

// Real local workerd D1 binding, isolated in memory. No cloud account, mail or CAPTCHA requests.
let platform, db, env, privateKey, keys;
const now = Date.now();
const sample = {
  projectType: 'website', name: '테스트 담당자', email: 'test@example.test', company: '', phone: '',
  budget: 'undecided', schedule: 'quarter', description: '브랜드를 소개할 웹사이트의 기획과 디자인 개발을 문의합니다.',
  consent: true, optionalConsent: false, policyVersion: POLICY_VERSION, token: 'test-token',
};
before(async () => {
  platform = await getPlatformProxy({ configPath: 'wrangler.local.toml', persist: false, remoteBindings: false });
  db = platform.env.CONTACT_DB;
  const migrations = new URL('../migrations/', import.meta.url);
  for (const file of (await readdir(migrations)).filter((file) => file.endsWith('.sql')).sort()) {
    const sql = (await readFile(new URL(file, migrations), 'utf8')).replace(/^--.*$/gm, '');
    await db.batch(sql.split(';').map((part) => part.trim()).filter(Boolean).map((part) => db.prepare(part)));
  }
  const pair = await generateKeyPair('RS256'); privateKey = pair.privateKey;
  const jwk = await exportJWK(pair.publicKey); jwk.kid = 'test'; jwk.alg = 'RS256';
  keys = createLocalJWKSet({ keys: [jwk] });
});
beforeEach(async () => {
  await db.batch(['notification_jobs', 'inquiries', 'rate_limits', 'admin_events', 'system_health'].map((table) => db.prepare(`DELETE FROM ${table}`)));
  await db.prepare("INSERT INTO system_health(name,checked_at) VALUES('jobs',?)").bind(now).run();
  env = { CONTACT_DB: db, CONTACT_ENABLED: 'true', CONTACT_POLICY_APPROVED: POLICY_VERSION,
    CONTACT_ORIGIN: 'https://bldnex.test', TURNSTILE_SITE_KEY: 'test-site-key', TURNSTILE_SECRET_KEY: 'test-secret',
    RATE_LIMIT_SECRET: 'unit-test-secret-not-a-real-key-0000000000000', RESEND_API_KEY: 'test-resend-not-real',
    NOTIFY_FROM: 'notify@example.test', NOTIFY_TO: 'admin@example.test', ACCESS_TEAM_DOMAIN: 'https://unit.cloudflareaccess.com',
    ACCESS_AUD: 'test-aud', ADMIN_EMAILS: 'admin@example.test', JOBS_ENABLED: 'true',
  };
});
after(async () => { await platform?.dispose(); });
const challenge = async (url) => {
  assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  return Response.json({ success: true, action: 'contact', hostname: 'bldnex.test' });
};
const submit = (data = sample, options = {}) => {
  const request = new Request(options.url ?? 'https://bldnex.test/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://bldnex.test', 'CF-Connecting-IP': '192.0.2.1',
      'Idempotency-Key': options.key ?? crypto.randomUUID(), ...options.headers }, body: JSON.stringify(data),
  });
  return handleApi(request, options.env ?? env, { fetch: options.fetch ?? challenge, keys, now });
};
const count = async (table) => (await db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).first()).n;
const job = async () => db.prepare('SELECT * FROM notification_jobs LIMIT 1').first();
async function jwt(overrides = {}) {
  return new SignJWT({ email: overrides.email ?? 'admin@example.test' }).setProtectedHeader({ alg: 'RS256', kid: 'test' })
    .setSubject('test-admin').setIssuer(overrides.issuer ?? env.ACCESS_TEAM_DOMAIN).setAudience(overrides.audience ?? env.ACCESS_AUD)
    .setIssuedAt().setExpirationTime(overrides.expiration ?? '10m').sign(privateKey);
}
async function admin(path = '', method = 'GET', body, options = {}) {
  return handleApi(new Request(`https://bldnex.test/api/admin/inquiries${path}`, {
    method, headers: { Origin: 'https://bldnex.test', 'Content-Type': 'application/json', 'cf-access-jwt-assertion': await jwt(), ...options.headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }), env, { keys, now: options.now ?? now });
}
async function create() { const response = await submit(); assert.equal(response.status, 201); return (await response.json()).receipt; }

test('saves inquiry and outbox atomically; returns only a receipt with no-store', async () => {
  const response = await submit(); assert.equal(response.status, 201);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  const result = await response.json(); assert.deepEqual(Object.keys(result).sort(), ['receipt', 'receivedAt']);
  assert.equal(await count('inquiries'), 1); assert.equal(await count('notification_jobs'), 1);
  const row = await db.prepare('SELECT * FROM inquiries').first();
  assert.equal(row.consent_at, now); assert.equal(row.purge_after, now + 730 * DAY);
  assert.equal(row.email, sample.email); assert.equal(row.status, 'new');
  const notification = await job();
  assert(!notification.payload.includes(sample.email)); assert(!notification.payload.includes(sample.name)); assert(!notification.payload.includes(sample.description));
});
test('same key and payload returns saved receipt without consuming another CAPTCHA', async () => {
  const key = crypto.randomUUID(); const first = await submit(sample, { key }); const original = await first.json();
  const replay = await submit({ ...sample, token: '' }, { key, fetch: () => { throw new Error('must not verify again'); } });
  assert.equal(replay.status, 200); assert.deepEqual(await replay.json(), original);
  assert.equal(await count('notification_jobs'), 1);
});
test('same key with changed data returns conflict and leaves original untouched', async () => {
  const key = crypto.randomUUID(); await submit(sample, { key });
  const response = await submit({ ...sample, name: '다른 이름' }, { key });
  assert.equal(response.status, 409); assert.equal((await db.prepare('SELECT name FROM inquiries').first()).name, sample.name);
});
test('concurrent double-clicks create only one inquiry and one job', async () => {
  const key = crypto.randomUUID();
  const responses = await Promise.all([submit(sample, { key }), submit(sample, { key }), submit(sample, { key })]);
  assert(responses.every((r) => [200, 201].includes(r.status)));
  const receipts = await Promise.all(responses.map((r) => r.json()));
  assert.equal(new Set(receipts.map((r) => r.receipt)).size, 1);
  assert.equal(await count('inquiries'), 1); assert.equal(await count('notification_jobs'), 1);
});
test('outbox failure rolls back inquiry; never reports success', async () => {
  // A trigger intentionally fails the second statement in the transaction.
  await db.prepare("CREATE TRIGGER fail_outbox BEFORE INSERT ON notification_jobs BEGIN SELECT RAISE(ABORT,'test'); END").run();
  try { assert.equal((await submit()).status, 503); assert.equal(await count('inquiries'), 0); }
  finally { await db.prepare('DROP TRIGGER fail_outbox').run(); }
});
test('missing config, unapproved policy, stale heartbeat and kill switch fail closed', async () => {
  for (const key of ['CONTACT_DB', 'CONTACT_POLICY_APPROVED', 'TURNSTILE_SECRET_KEY', 'NOTIFY_FROM', 'ACCESS_AUD', 'ADMIN_EMAILS', 'RATE_LIMIT_SECRET']) {
    const broken = { ...env, [key]: undefined }; assert.equal((await submit(sample, { env: broken })).status, 503, key);
  }
  assert.equal((await submit(sample, { env: { ...env, CONTACT_ENABLED: 'false' } })).status, 503);
  await db.prepare('UPDATE system_health SET checked_at=?').bind(now - 20 * 60_000).run();
  assert.equal((await submit()).status, 503); assert.equal(await count('inquiries'), 0);
});
test('public readiness never exposes secrets', async () => {
  const response = await handleApi(new Request('https://bldnex.test/api/contact/config'), env);
  const body = await response.json(); assert.equal(body.enabled, true); assert.deepEqual(Object.keys(body).sort(), ['enabled', 'policyVersion', 'siteKey']);
  const otherHost = await handleApi(new Request('https://preview.pages.dev/api/contact/config'), env);
  assert.equal((await otherHost.json()).enabled, false);
});
test('server rejects bad fields, forged consent, stale policy, header injection and optional data without consent', async () => {
  for (const fields of [
    { name: 'A' }, { email: 'bad' }, { email: 'x@example.test\r\nBcc:x@y.test' }, { projectType: '__proto__' },
    { budget: 'anything' }, { schedule: 'anything' }, { description: 'short' }, { description: 'a'.repeat(5001) },
    { consent: 'true' }, { consent: false }, { company: '회사' }, { phone: '010-0000-0000' }, { policyVersion: 'old' },
  ]) {
    assert.equal((await submit({ ...sample, ...fields })).status, 422, JSON.stringify(fields).slice(0, 80));
  }
  assert.equal(await count('inquiries'), 0);
  assert.deepEqual(validateContact({ ...sample, company: '회사', phone: '010-0000-0000', optionalConsent: true }).errors, {});
});
test('honeypot, malformed idempotency keys and cross-origin requests are rejected', async () => {
  assert.equal((await submit({ ...sample, website: 'spam' })).status, 400);
  assert.equal((await submit(sample, { key: 'guessable' })).status, 400);
  assert.equal((await submit(sample, { headers: { Origin: 'https://attacker.test' } })).status, 403);
  assert.equal((await submit(sample, { url: 'https://preview.pages.dev/api/contact' })).status, 403);
  assert.equal((await submit(sample, { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
});
test('content-type, body byte limits and invalid JSON are enforced', async () => {
  assert.equal((await submit(sample, { headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await submit({ ...sample, extra: 'a'.repeat(25_000) })).status, 413);
  const invalid = new Request('https://bldnex.test/api/contact', { method: 'POST', headers: { Origin: env.CONTACT_ORIGIN, 'Content-Type': 'application/json' }, body: '{' });
  assert.equal((await handleApi(invalid, env)).status, 400);
});
test('CAPTCHA false, wrong action/hostname and upstream outage cannot save data', async () => {
  for (const result of [{ success: false }, { success: true, action: 'other', hostname: 'bldnex.test' }, { success: true, action: 'contact', hostname: 'evil.test' }]) {
    assert.equal((await submit(sample, { fetch: async () => Response.json(result) })).status, 422);
  }
  assert.equal((await submit(sample, { fetch: async () => { throw new Error('outage'); } })).status, 503);
  assert.equal(await count('inquiries'), 0);
});
test('IP and email throttles persist in D1 without raw identity values', async () => {
  for (let i = 0; i < 10; i++) assert.equal((await submit(sample, { fetch: async () => Response.json({ success: false }) })).status, 422);
  const response = await submit(); assert.equal(response.status, 429); assert.equal(response.headers.get('Retry-After'), '600');
  const limits = await db.prepare('SELECT * FROM rate_limits').all();
  assert(!JSON.stringify(limits).includes('192.0.2.1')); assert(!JSON.stringify(limits).includes(sample.email));
  await db.prepare('DELETE FROM rate_limits').run();
  for (let i = 0; i < 3; i++) assert.equal((await submit()).status, 201);
  assert.equal((await submit()).status, 429); assert.equal(await count('inquiries'), 3);
});
test('notification outage does not undo successful intake and retry reuses exact payload/key', async () => {
  await create(); let calls = [];
  const transport = async (url, init) => { assert.equal(url, 'https://api.resend.com/emails'); calls.push(init); return new Response('', { status: calls.length === 1 ? 503 : 200 }); };
  await sendNotifications(env, transport, now);
  let row = await job(); assert.equal(row.state, 'retry'); assert.equal(await count('inquiries'), 1);
  await sendNotifications(env, async (_url, init) => { calls.push(init); return Response.json({ id: 'test-provider-id' }); }, now + 180_000);
  row = await job(); assert.equal(row.state, 'provider_accepted'); assert.equal(row.provider_id, 'test-provider-id');
  assert.equal(calls[0].headers['Idempotency-Key'], calls[1].headers['Idempotency-Key']); assert.equal(calls[0].body, calls[1].body);
  assert.equal(row.attempts, 2);
});
test('concurrent scheduled runs atomically claim a job once', async () => {
  await create(); let calls = 0;
  const send = async () => { calls++; await new Promise((r) => setTimeout(r, 50)); return Response.json({ id: 'one' }); };
  await Promise.all([sendNotifications(env, send, now), sendNotifications(env, send, now)]);
  assert.equal(calls, 1); assert.equal((await job()).state, 'provider_accepted');
});
test('expired processing leases recover with the same provider idempotency key', async () => {
  await create(); const old = await job();
  await db.prepare("UPDATE notification_jobs SET state='processing',lease_until=?,lease_token='dead',first_attempt_at=?").bind(now - 1, now - 100_000).run();
  await sendNotifications(env, async (_, init) => { assert.equal(init.headers['Idempotency-Key'], old.send_key); return Response.json({ id: 'recovered' }); }, now);
  assert.equal((await job()).state, 'provider_accepted');
});
test('automatic retries stop before provider 24h window; manual retry requires duplicate-risk acknowledgement', async () => {
  const id = await create();
  await db.prepare('UPDATE notification_jobs SET first_attempt_at=?').bind(now - RETRY_WINDOW).run();
  await sendNotifications(env, () => { throw new Error('must not send'); }, now);
  const old = await job(); assert.equal(old.state, 'failed'); assert.equal(old.error_code, 'retry_window_expired');
  const denied = await admin(`/${id}/retry`, 'POST', {}); assert.equal(denied.status, 409); assert.equal((await denied.json()).error, 'duplicate_risk');
  const accepted = await admin(`/${id}/retry`, 'POST', { acknowledgeDuplicateRisk: true }); assert.equal(accepted.status, 200);
  const retried = await job(); assert.notEqual(retried.send_key, old.send_key); assert.equal(retried.first_attempt_at, null);
});
test('provider permanent errors fail visibly and already accepted mail cannot be resent casually', async () => {
  const id = await create();
  await sendNotifications(env, async () => new Response('', { status: 403 }), now);
  assert.equal((await job()).state, 'failed'); assert.equal((await job()).error_code, 'provider_403');
  await admin(`/${id}/retry`, 'POST', {});
  await sendNotifications(env, async () => Response.json({ id: 'accepted' }), now);
  assert.equal((await admin(`/${id}/retry`, 'POST', {})).status, 409);
});
test('admin rejects missing, forged, expired, wrong audience/issuer and non-allowlisted JWTs', async () => {
  assert.equal((await handleApi(new Request('https://bldnex.test/api/admin/inquiries'), env, { keys })).status, 401);
  for (const token of ['fake-token', await jwt({ audience: 'other' }), await jwt({ issuer: 'https://other.test' }), await jwt({ email: 'outsider@example.test' }), await jwt({ expiration: Math.floor(now / 1000) - 30 })]) {
    assert.equal((await admin('', 'GET', undefined, { headers: { 'cf-access-jwt-assertion': token } })).status, 403);
  }
  const noAuth = await handleApi(new Request('https://bldnex.test/api/admin/inquiries'), { ...env, ACCESS_AUD: undefined }, { keys });
  assert.equal(noAuth.status, 503);
});
test('authorized admin can list/detail; public API cannot fetch inquiry content', async () => {
  const id = await create();
  const items = await (await admin()).json(); assert.equal(items.items.length, 1); assert(!('email' in items.items[0]));
  const detail = await (await admin(`/${id}`)).json(); assert.equal(detail.inquiry.email, sample.email);
  assert(!('request_hash' in detail.inquiry)); assert(!('payload_hash' in detail.inquiry));
  assert.equal((await handleApi(new Request(`https://bldnex.test/api/contact/${id}`), env)).status, 405);
});
test('admin writes require same-origin; status changes use optimistic versioning and closure starts retention', async () => {
  const id = await create();
  assert.equal((await admin(`/${id}/status`, 'PATCH', { status: 'closed', version: 1 }, { headers: { Origin: 'https://evil.test' } })).status, 403);
  assert.equal((await admin(`/${id}/status`, 'PATCH', { status: 'reviewing', version: 1 })).status, 200);
  assert.equal((await admin(`/${id}/status`, 'PATCH', { status: 'contacted', version: 1 })).status, 409);
  assert.equal((await admin(`/${id}/status`, 'PATCH', { status: 'closed', version: 2 }, { now: now + DAY })).status, 200);
  const row = await db.prepare('SELECT * FROM inquiries').first(); assert.equal(row.purge_after, now + 366 * DAY); assert.equal(row.closed_at, now + DAY);
  assert.equal((await admin(`/${id}/status`, 'PATCH', { status: 'new', version: 3 })).status, 409);
  assert.equal(await count('admin_events'), 2);
});
test('deletion requires exact confirmation and cannot race a live notification sender', async () => {
  const id = await create();
  assert.equal((await admin(`/${id}`, 'DELETE', { confirmId: 'wrong' })).status, 422);
  await db.prepare("UPDATE notification_jobs SET state='processing',lease_until=?").bind(now + 120_000).run();
  assert.equal((await admin(`/${id}`, 'DELETE', { confirmId: id })).status, 409);
  await db.prepare("UPDATE notification_jobs SET state='failed',lease_until=NULL").run();
  assert.equal((await admin(`/${id}`, 'DELETE', { confirmId: id })).status, 200);
  assert.equal(await count('inquiries'), 0); assert.equal(await count('notification_jobs'), 0);
  assert.equal(await count('admin_events'), 1);
});
test('retention purge cascades jobs, expires rate/audit records and does not send expired content', async () => {
  await create();
  await db.prepare('UPDATE inquiries SET purge_after=?').bind(now - 1).run();
  await db.prepare("INSERT INTO admin_events VALUES('old','old','system','test',?)").bind(now - 366 * DAY).run();
  await db.prepare("INSERT INTO rate_limits VALUES('expired',1,?)").bind(now - 1).run();
  await runMaintenance(env, () => { throw new Error('must not send expired inquiry'); }, now);
  assert.equal(await count('inquiries'), 0); assert.equal(await count('notification_jobs'), 0);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM rate_limits WHERE bucket='expired'").first()).n, 0);
  assert.equal((await db.prepare("SELECT COUNT(*) AS n FROM admin_events WHERE id='old'").first()).n, 0);
  assert.equal((await db.prepare('SELECT action FROM admin_events').first()).action, 'retention_purge');
});
test('purge defers active sender and proceeds after bounded lease expiry', async () => {
  await create(); await db.prepare('UPDATE inquiries SET purge_after=?').bind(now - 1).run();
  await db.prepare("UPDATE notification_jobs SET state='processing',lease_until=?").bind(now + 120_000).run();
  await purgeExpired(env, now); assert.equal(await count('inquiries'), 1);
  await purgeExpired(env, now + 121_000); assert.equal(await count('inquiries'), 0);
});
test('paused intake still permits maintenance and no notification credentials means no healthy heartbeat', async () => {
  await db.prepare('DELETE FROM system_health').run();
  await runMaintenance({ ...env, RESEND_API_KEY: undefined }, challenge, now); assert.equal(await count('system_health'), 0);
  await runMaintenance({ ...env, CONTACT_ENABLED: 'false' }, challenge, now); assert.equal(await count('system_health'), 1);
});
test('an expired inquiry cannot be extended by a late status change', async () => {
  const id = await create(); await db.prepare('UPDATE inquiries SET purge_after=?').bind(now - 1).run();
  assert.equal((await admin(`/${id}/status`, 'PATCH', { status: 'closed', version: 1 })).status, 409);
  assert.equal(await count('admin_events'), 0);
});
test('manual retry and send completion increment notification revision', async () => {
  const id = await create(); const before = await job();
  assert.equal((await admin(`/${id}/retry`, 'POST', {})).status, 200);
  assert.equal((await job()).revision, before.revision + 1);
  await sendNotifications(env, async () => Response.json({ id: 'accepted' }), now);
  assert.equal((await job()).revision, before.revision + 3);
});
