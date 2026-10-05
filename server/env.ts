import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  CONTACT_DB?: D1Database;
  CONTACT_ENABLED?: string;
  CONTACT_POLICY_APPROVED?: string;
  CONTACT_ORIGIN?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  RATE_LIMIT_SECRET?: string;
  RESEND_API_KEY?: string;
  NOTIFY_FROM?: string;
  NOTIFY_TO?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
  JOBS_ENABLED?: string;
}
export type Database = D1Database;
export const DAY = 86_400_000;
