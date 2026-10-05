PRAGMA foreign_keys = ON;
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  request_hash TEXT NOT NULL UNIQUE,
  payload_hash TEXT NOT NULL,
  project_type TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL,
  schedule TEXT NOT NULL,
  description TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  consent_at INTEGER NOT NULL,
  optional_consent INTEGER NOT NULL CHECK (optional_consent IN (0,1)),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','contacted','closed')),
  version INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  closed_at INTEGER,
  purge_after INTEGER NOT NULL
);
CREATE INDEX inquiries_created ON inquiries(created_at DESC, id DESC);
CREATE INDEX inquiries_purge ON inquiries(purge_after);
CREATE TABLE notification_jobs (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL UNIQUE REFERENCES inquiries(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','processing','retry','provider_accepted','failed')),
  payload TEXT NOT NULL,
  send_key TEXT NOT NULL UNIQUE,
  attempts INTEGER NOT NULL DEFAULT 0,
  first_attempt_at INTEGER,
  next_attempt_at INTEGER NOT NULL,
  lease_until INTEGER,
  lease_token TEXT,
  provider_id TEXT,
  error_code TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX jobs_due ON notification_jobs(state, next_attempt_at);
-- Audit entries intentionally contain no inquiry content or requester identity.
CREATE TABLE admin_events (
  id TEXT PRIMARY KEY,
  inquiry_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX admin_events_expiry ON admin_events(created_at);
CREATE TABLE rate_limits (bucket TEXT PRIMARY KEY, hits INTEGER NOT NULL, expires_at INTEGER NOT NULL);
CREATE INDEX rate_limits_expiry ON rate_limits(expires_at);
CREATE TABLE system_health (name TEXT PRIMARY KEY, checked_at INTEGER NOT NULL);
