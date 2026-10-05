import { runMaintenance } from '../../server/jobs';
import type { Env } from '../../server/env';
export default {
  async scheduled(_controller: unknown, env: Env) { await runMaintenance(env); },
  fetch() { return new Response('Not found', { status: 404 }); },
};
