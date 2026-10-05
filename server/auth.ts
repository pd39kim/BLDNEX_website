import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import type { Env } from './env';
import { HttpError } from './http';

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export function authConfigured(env: Env) {
  return /^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN ?? '') &&
    !!env.ACCESS_AUD && !!env.ADMIN_EMAILS?.trim();
}
/** An injectable key resolver is used only by tests; no deployed auth bypass exists. */
export async function authorize(request: Request, env: Env, resolver?: JWTVerifyGetKey) {
  if (!authConfigured(env)) throw new HttpError(503, 'admin_unconfigured');
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token || token.length > 16_384) throw new HttpError(401, 'authentication_required');
  const domain = env.ACCESS_TEAM_DOMAIN!;
  let keys = resolver ?? keySets.get(domain);
  if (!keys) {
    keys = createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`), { timeoutDuration: 5000 });
    keySets.set(domain, keys as ReturnType<typeof createRemoteJWKSet>);
  }
  try {
    const { payload } = await jwtVerify(token, keys, {
      issuer: domain, audience: env.ACCESS_AUD, algorithms: ['RS256'],
      requiredClaims: ['exp', 'iat', 'sub', 'email'],
    });
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    const allowed = env.ADMIN_EMAILS!.split(',').map((v) => v.trim().toLowerCase());
    if (!email || !allowed.includes(email)) throw new Error();
    return email;
  } catch { throw new HttpError(403, 'forbidden'); }
}
