import { handleApi } from '../../server/api';
import type { Env } from '../../server/env';
// Native web types avoid mixing DOM and Workers Request declarations in Astro's typecheck.
export const onRequest = ({ request, env }: { request: Request; env: Env }) => handleApi(request, env);
