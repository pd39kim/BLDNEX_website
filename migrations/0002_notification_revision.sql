-- Optimistic concurrency for manual retries, including same-millisecond races.
ALTER TABLE notification_jobs ADD COLUMN revision INTEGER NOT NULL DEFAULT 1;
