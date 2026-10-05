export class HttpError extends Error {
  constructor(public status: number, public code: string, public fields?: Record<string, string>) { super(code); }
}
export function secure(response: Response) {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, { status: response.status, headers });
}
export function json(value: unknown, status = 200) { return secure(Response.json(value, { status })); }
export function failure(error: unknown) {
  // Deliberately do not log request bodies, email addresses, JWTs or provider responses.
  if (error instanceof HttpError) {
    const response = json({ error: error.code, ...(error.fields ? { fields: error.fields } : {}) }, error.status);
    if (error.status === 429) response.headers.set('Retry-After', '600');
    return response;
  }
  console.error('contact: internal_error');
  return json({ error: 'unavailable' }, 503);
}
export function sameOrigin(request: Request, expected: string | undefined) {
  if (!expected || new URL(request.url).origin !== expected || request.headers.get('Origin') !== expected) throw new HttpError(403, 'forbidden');
  const site = request.headers.get('Sec-Fetch-Site');
  if (site && site !== 'same-origin' && site !== 'none') throw new HttpError(403, 'forbidden');
}
export async function readJson(request: Request, maxBytes = 24_000): Promise<Record<string, unknown>> {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') ?? '')) throw new HttpError(415, 'json_required');
  if (Number(request.headers.get('Content-Length')) > maxBytes) throw new HttpError(413, 'too_large');
  if (!request.body) throw new HttpError(400, 'invalid_json');
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0, text = '';
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      bytes += result.value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); throw new HttpError(413, 'too_large'); }
      text += decoder.decode(result.value, { stream: true });
    }
    text += decoder.decode();
    const data = JSON.parse(text);
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error();
    return data;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, 'invalid_json');
  }
}
export async function hash(value: string) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
