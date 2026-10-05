import { authorize } from '../server/auth';
import type { Env } from '../server/env';
import { failure, secure } from '../server/http';

export async function onRequest(context: { request: Request; env: Env; next: () => Promise<Response> }) {
  if (!new URL(context.request.url).pathname.startsWith('/admin')) return context.next();
  try {
    await authorize(context.request, context.env);
    return secure(await context.next());
  } catch (error) { return failure(error); }
}
