import type { JWTVerifyGetKey } from 'jose';
import type { Env } from './env';
import { authorize } from './auth';
import { adminApi } from './admin';
import { configuration, submitContact } from './contact';
import { failure, HttpError } from './http';

export async function handleApi(request: Request, env: Env, dependencies: { fetch?: typeof fetch; keys?: JWTVerifyGetKey; now?: number } = {}) {
  try {
    const path = new URL(request.url).pathname;
    if (path.startsWith('/api/admin/')) {
      const actor = await authorize(request, env, dependencies.keys);
      return await adminApi(request, env, actor, dependencies.now);
    }
    if (path === '/api/contact/config' && request.method === 'GET') return await configuration(request, env);
    if (path === '/api/contact' && request.method === 'POST') return await submitContact(request, env, dependencies.fetch, dependencies.now);
    throw new HttpError(path.startsWith('/api/contact') ? 405 : 404, 'not_found');
  } catch (error) { return failure(error); }
}
