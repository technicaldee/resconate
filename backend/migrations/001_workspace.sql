CREATE TABLE IF NOT EXISTS businesses (
 id uuid PRIMARY KEY, name text NOT NULL, sector text NOT NULL DEFAULT 'food', phone text,
 plan text NOT NULL DEFAULT 'basic' CHECK(plan IN ('basic','small','growth','assisted')),
 trial_ends_at timestamptz NOT NULL DEFAULT now()+interval '14 days', paid_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY, business_id uuid NOT NULL REFERENCES businesses(id), name text NOT NULL,
 email text NOT NULL, password_hash text NOT NULL, role text NOT NULL DEFAULT 'owner' CHECK(role IN ('owner','supervisor')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email ON users(lower(email));
CREATE TABLE IF NOT EXISTS sessions (token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS reset_tokens (token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id),expires_at timestamptz NOT NULL,used_at timestamptz);
CREATE TABLE IF NOT EXISTS workers (
 id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),name text NOT NULL,role text NOT NULL,
 phone text, pay_type text NOT NULL CHECK(pay_type IN ('monthly','weekly','daily','per_job')),
 rate integer NOT NULL CHECK(rate>0),status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','archived')),
 bank_code text,account_number text,account_name text,recipient_code text,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pay_runs (
 id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),start_date date NOT NULL,end_date date NOT NULL,
 status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','approved','paid')),
 items jsonb NOT NULL,total integer NOT NULL CHECK(total>=0),created_by uuid REFERENCES users(id),
 created_at timestamptz NOT NULL DEFAULT now(),approved_at timestamptz,CHECK(end_date>=start_date)
);
CREATE TABLE IF NOT EXISTS entries (
 id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),worker_id uuid NOT NULL REFERENCES workers(id),
 kind text NOT NULL CHECK(kind IN ('work','advance','bonus','payment')),units numeric(10,2),amount integer NOT NULL DEFAULT 0 CHECK(amount>=0),
 entry_date date NOT NULL,note text NOT NULL DEFAULT '',method text CHECK(method IN ('cash','bank','provider')),
 pay_run_id uuid REFERENCES pay_runs(id),allocated_run_id uuid REFERENCES pay_runs(id),
 source text NOT NULL DEFAULT 'owner',created_by uuid REFERENCES users(id),created_at timestamptz NOT NULL DEFAULT now(),
 voided_at timestamptz,void_reason text,
 CHECK(kind<>'work' OR units>0)
);
CREATE INDEX IF NOT EXISTS entries_scope ON entries(business_id,entry_date);
CREATE TABLE IF NOT EXISTS audit_events (id bigserial PRIMARY KEY,business_id uuid REFERENCES businesses(id),user_id uuid REFERENCES users(id),action text NOT NULL,details jsonb NOT NULL DEFAULT '{}',created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS support_requests (id uuid PRIMARY KEY,business_id uuid REFERENCES businesses(id),name text,email text,phone text,category text NOT NULL DEFAULT 'support',message text NOT NULL,status text NOT NULL DEFAULT 'open',created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS leave_requests (id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),worker_id uuid NOT NULL REFERENCES workers(id),start_date date NOT NULL,end_date date NOT NULL,note text NOT NULL DEFAULT '',status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','declined')),created_at timestamptz NOT NULL DEFAULT now(),CHECK(end_date>=start_date));
CREATE TABLE IF NOT EXISTS jobs (id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),title text NOT NULL,description text NOT NULL,status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','closed')),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS reviews (id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),worker_id uuid NOT NULL REFERENCES workers(id),rating integer NOT NULL CHECK(rating BETWEEN 1 AND 5),note text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS billing_checkouts (id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),plan text NOT NULL,amount integer NOT NULL,reference text UNIQUE NOT NULL,status text NOT NULL DEFAULT 'pending',created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS webhook_events (provider text NOT NULL,event_id text NOT NULL,payload jsonb NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(provider,event_id));
CREATE TABLE IF NOT EXISTS outbox (id uuid PRIMARY KEY,channel text NOT NULL,recipient text NOT NULL,payload jsonb NOT NULL,status text NOT NULL DEFAULT 'pending',attempts integer NOT NULL DEFAULT 0,next_attempt_at timestamptz NOT NULL DEFAULT now(),last_error text,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS whatsapp_links (phone text PRIMARY KEY,business_id uuid NOT NULL UNIQUE REFERENCES businesses(id),user_id uuid NOT NULL REFERENCES users(id),created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS whatsapp_codes (code_hash text PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),user_id uuid NOT NULL REFERENCES users(id),expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS message_drafts (id uuid PRIMARY KEY,phone text NOT NULL,business_id uuid NOT NULL REFERENCES businesses(id),user_id uuid NOT NULL REFERENCES users(id),payload jsonb NOT NULL,expires_at timestamptz NOT NULL,confirmed_at timestamptz);
CREATE TABLE IF NOT EXISTS invitations (token_hash text PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),email text NOT NULL,expires_at timestamptz NOT NULL,used_at timestamptz);
CREATE TABLE IF NOT EXISTS transfers (id uuid PRIMARY KEY,business_id uuid NOT NULL REFERENCES businesses(id),pay_run_id uuid NOT NULL REFERENCES pay_runs(id),worker_id uuid NOT NULL REFERENCES workers(id),amount integer NOT NULL CHECK(amount>0),reference text NOT NULL UNIQUE,status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','success','failed')),transfer_code text,error text,created_at timestamptz NOT NULL DEFAULT now());
CREATE UNIQUE INDEX IF NOT EXISTS transfer_once ON transfers(pay_run_id,worker_id) WHERE status IN ('pending','success');
