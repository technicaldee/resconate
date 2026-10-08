CREATE INDEX IF NOT EXISTS workers_business ON workers(business_id);
CREATE INDEX IF NOT EXISTS runs_business ON pay_runs(business_id,start_date,end_date);
CREATE INDEX IF NOT EXISTS entries_run ON entries(pay_run_id,worker_id) WHERE voided_at IS NULL;
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS outbox_due ON outbox(next_attempt_at) WHERE status='pending';
CREATE INDEX IF NOT EXISTS audit_business ON audit_events(business_id,created_at DESC);
CREATE INDEX IF NOT EXISTS transfers_pending ON transfers(created_at) WHERE status='pending';
