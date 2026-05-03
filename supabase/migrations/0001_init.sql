-- =============================================================================
-- JobSeeker — initial schema (Fase 0)
-- =============================================================================
-- Multi-tenant: every row that holds user data has a user_id FK to auth.users.
-- Row-Level Security is ON by default; queries from the browser use the
-- anon key and see only their own rows via `auth.uid()`. Server-side tasks
-- (cron, webhooks) use the service role key which bypasses RLS.
--
-- Tiers (business rules, enforced at the API/middleware layer, not in SQL):
--   free  : BYO API key, N manual applications/mo
--   pro   : ours-or-BYO, unlimited manual, Discover (assisted)
--   elite : ours-or-BYO, unlimited manual, Discover + Auto-Apply + daily cron
-- =============================================================================

-- ---------- ENUMS -----------------------------------------------------------

CREATE TYPE tier AS ENUM ('free', 'pro', 'elite');

CREATE TYPE subscription_status AS ENUM (
  'active', 'on_trial', 'past_due', 'cancelled', 'expired', 'paused'
);

CREATE TYPE app_mode AS ENUM ('fast', 'full');

CREATE TYPE application_status AS ENUM (
  'created',
  'investigating', 'investigated',
  'evaluating',    'evaluated',
  'decided_go',    'decided_nogo', 'decided_hold',
  'creating',      'created_docs',
  'sent'
);

CREATE TYPE application_source AS ENUM ('manual', 'discover', 'auto_apply');

CREATE TYPE provider_id AS ENUM (
  'anthropic', 'google', 'openai', 'groq', 'ollama', 'claude-code'
);

-- Tier pagos por defecto usan nuestra key de Gemini (`ours`). El usuario puede
-- cambiar a `byo` para gastar su propia cuota / modelo local.
CREATE TYPE ai_key_mode AS ENUM ('ours', 'byo');

CREATE TYPE job_match_status AS ENUM ('new', 'dismissed', 'applied', 'saved');

CREATE TYPE job_source AS ENUM (
  'adzuna', 'remotive', 'remoteok', 'weworkremotely'
);

CREATE TYPE email_send_status AS ENUM ('sent', 'draft', 'failed');


-- ---------- PROFILES --------------------------------------------------------
-- Extiende auth.users con datos de la app. 1-a-1 con auth.users.

CREATE TABLE profiles (
  id                              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                           TEXT        NOT NULL,
  display_name                    TEXT,
  avatar_url                      TEXT,
  locale                          TEXT        NOT NULL DEFAULT 'auto',
  timezone                        TEXT        NOT NULL DEFAULT 'UTC',

  -- Subscription snapshot (source of truth: Lemon Squeezy webhooks)
  tier                            tier        NOT NULL DEFAULT 'free',
  subscription_status             subscription_status,
  subscription_provider           TEXT,       -- 'lemon_squeezy'
  subscription_id                 TEXT,       -- LS subscription id
  subscription_variant_id         TEXT,
  subscription_current_period_end TIMESTAMPTZ,
  subscription_cancel_at          TIMESTAMPTZ,

  created_at                      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- CONFIGS ---------------------------------------------------------
-- User preferences that control how the pipeline behaves.

CREATE TABLE configs (
  user_id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_provider      provider_id NOT NULL DEFAULT 'google',
  mode                 app_mode    NOT NULL DEFAULT 'fast',
  user_locale          TEXT        NOT NULL DEFAULT 'auto',
  ai_key_mode          ai_key_mode NOT NULL DEFAULT 'ours',
  monthly_token_budget INTEGER,
  monthly_tokens_used  INTEGER     NOT NULL DEFAULT 0,
  month_key            TEXT,       -- 'YYYY-MM'; used to reset monthly counter

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- PROVIDER CONFIGS (per-provider BYO credentials) -----------------
-- Usuario puede configurar varios providers; el "activo" vive en configs.

CREATE TABLE provider_configs (
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id provider_id NOT NULL,
  model       TEXT        NOT NULL,
  base_url    TEXT,
  api_key_enc TEXT,       -- AES-GCM via lib/crypto.ts; NULL = no key set
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider_id)
);


-- ---------- CV DOCUMENT -----------------------------------------------------
-- One per user. `summary` is the compact context we reuse every run.

CREATE TABLE cv_documents (
  user_id        UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text       TEXT,
  summary        JSONB,      -- CVSummary shape from lib/types.ts
  tokens_used    INTEGER,
  summarized_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- CAREER PREFERENCES (Pro/Elite Discover + Auto-Apply) ------------

CREATE TABLE career_preferences (
  user_id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  desired_roles        TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  locations            TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  remote_ok            BOOLEAN     NOT NULL DEFAULT true,
  seniority            TEXT,
  employment_types     TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  min_salary           INTEGER,
  salary_currency      TEXT,
  industries_to_avoid  TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],
  languages            TEXT[]      NOT NULL DEFAULT ARRAY[]::TEXT[],

  -- Elite knobs
  min_match_score      INTEGER     NOT NULL DEFAULT 80,   -- floor for Discover
  daily_apply_limit    INTEGER,                           -- tier 3: 10, null = disabled
  daily_auto_send      BOOLEAN     NOT NULL DEFAULT false, -- true = send without review

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- SMTP CONNECTIONS ------------------------------------------------
-- User's own SMTP (Gmail + App Password, Outlook, custom). Nodemailer uses this
-- to send application emails FROM the candidate's real address.

CREATE TABLE smtp_connections (
  user_id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  from_email       TEXT        NOT NULL,
  from_name        TEXT,
  host             TEXT        NOT NULL,
  port             INTEGER     NOT NULL,
  secure           BOOLEAN     NOT NULL DEFAULT true,
  username         TEXT        NOT NULL,
  password_enc     TEXT        NOT NULL,    -- encrypted App Password
  last_verified_at TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- APPLICATIONS ----------------------------------------------------
-- One row per job application, whether manual or automated.

CREATE TABLE applications (
  id            UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID               NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company       TEXT               NOT NULL,
  role          TEXT               NOT NULL,
  company_slug  TEXT               NOT NULL,
  description   TEXT               NOT NULL,
  url           TEXT,
  user_notes    TEXT,
  mode          app_mode           NOT NULL DEFAULT 'fast',
  status        application_status NOT NULL DEFAULT 'created',
  user_decision TEXT               CHECK (user_decision IN ('go', 'nogo', 'hold')),
  source        application_source NOT NULL DEFAULT 'manual',
  match_score   INTEGER,           -- only set for discover / auto_apply
  total_tokens  INTEGER            NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ        NOT NULL DEFAULT now()
);
CREATE INDEX applications_user_created_idx ON applications(user_id, created_at DESC);
CREATE INDEX applications_user_status_idx  ON applications(user_id, status);


-- ---------- INTEL / EVAL / DOCS (1-to-1 with applications) ------------------

CREATE TABLE intels (
  application_id UUID        PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
  data           JSONB       NOT NULL,      -- IntelReport shape
  tokens_used    INTEGER     NOT NULL DEFAULT 0,
  from_cache     BOOLEAN     NOT NULL DEFAULT false,
  generated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE evals (
  application_id UUID        PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
  data           JSONB       NOT NULL,      -- EvalReport shape
  tokens_used    INTEGER     NOT NULL DEFAULT 0,
  generated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE docs (
  application_id        UUID        PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
  cv_markdown           TEXT        NOT NULL,
  cover_letter_markdown TEXT        NOT NULL,
  email_subject         TEXT        NOT NULL,
  email_body            TEXT        NOT NULL,
  review                JSONB       NOT NULL,    -- reviewers + verdict
  tokens_used           INTEGER     NOT NULL DEFAULT 0,
  generated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- COMPANY INTEL CACHE (shared, no user_id) ------------------------
-- Sharing intel across users is fine: the data is public knowledge about the
-- company + decoded role. Keeps token cost down for common targets.

CREATE TABLE company_intel_cache (
  company_slug TEXT        PRIMARY KEY,
  intel        JSONB       NOT NULL,
  cached_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ---------- EMAIL SENDS -----------------------------------------------------
-- Audit trail of every outgoing email (via the user's SMTP). Also flags drafts
-- (nothing sent, user will send manually) and failures.

CREATE TABLE email_sends (
  id             UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID              NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  user_id        UUID              NOT NULL REFERENCES auth.users(id)  ON DELETE CASCADE,
  to_email       TEXT              NOT NULL,
  cc_email       TEXT,
  bcc_email      TEXT,
  subject        TEXT              NOT NULL,
  body           TEXT              NOT NULL,
  status         email_send_status NOT NULL,
  message_id     TEXT,             -- from SMTP response
  error          TEXT,
  sent_at        TIMESTAMPTZ,
  created_at     TIMESTAMPTZ       NOT NULL DEFAULT now()
);
CREATE INDEX email_sends_application_idx ON email_sends(application_id);
CREATE INDEX email_sends_user_sent_idx   ON email_sends(user_id, sent_at DESC);


-- ---------- JOB MATCHES (Discover + Auto-Apply) -----------------------------
-- Cached list of job postings we've found for this user, scored against
-- their CV summary.

CREATE TABLE job_matches (
  id             UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID             NOT NULL REFERENCES auth.users(id)   ON DELETE CASCADE,
  source         job_source       NOT NULL,
  external_id    TEXT             NOT NULL,
  company        TEXT             NOT NULL,
  role           TEXT             NOT NULL,
  url            TEXT             NOT NULL,
  location       TEXT,
  is_remote      BOOLEAN,
  posted_at      TIMESTAMPTZ,
  description    TEXT,
  match_score    INTEGER,
  match_reasons  JSONB,
  status         job_match_status NOT NULL DEFAULT 'new',
  application_id UUID             REFERENCES applications(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),
  UNIQUE (user_id, source, external_id)
);
CREATE INDEX job_matches_user_created_idx ON job_matches(user_id, created_at DESC);
CREATE INDEX job_matches_user_status_idx  ON job_matches(user_id, status);


-- ---------- DAILY RUNS (Elite automation log) -------------------------------

CREATE TABLE daily_runs (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  run_date              DATE        NOT NULL,
  jobs_scanned          INTEGER     NOT NULL DEFAULT 0,
  jobs_matched          INTEGER     NOT NULL DEFAULT 0,
  applications_created  INTEGER     NOT NULL DEFAULT 0,
  applications_sent     INTEGER     NOT NULL DEFAULT 0,
  summary_email_sent_at TIMESTAMPTZ,
  tokens_used           INTEGER     NOT NULL DEFAULT 0,
  error                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, run_date)
);


-- ---------- WEBHOOK EVENTS (idempotency + debug) ----------------------------

CREATE TABLE webhook_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider     TEXT        NOT NULL,        -- 'lemon_squeezy'
  event_id     TEXT        NOT NULL,        -- provider's event id (for dedupe)
  event_type   TEXT        NOT NULL,
  payload      JSONB       NOT NULL,
  processed_at TIMESTAMPTZ,
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);


-- ============================================================================
-- ROW-LEVEL SECURITY
-- ============================================================================
-- Pattern: deny-by-default, then grant each user access only to rows they own.
-- The service role key (used server-side for cron / webhooks / admin) bypasses
-- RLS automatically.

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE configs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_configs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_documents        ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_preferences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_connections    ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE intels              ENABLE ROW LEVEL SECURITY;
ALTER TABLE evals               ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends         ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_matches         ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_runs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_intel_cache ENABLE ROW LEVEL SECURITY;

-- Profiles: owner-scoped on id
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Everything owner-scoped on user_id
CREATE POLICY configs_owner            ON configs            FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY provider_configs_owner   ON provider_configs   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY cv_documents_owner       ON cv_documents       FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY career_preferences_owner ON career_preferences FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY smtp_connections_owner   ON smtp_connections   FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY applications_owner       ON applications       FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY email_sends_owner        ON email_sends        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY job_matches_owner        ON job_matches        FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY daily_runs_owner         ON daily_runs         FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- intels / evals / docs: owner via application
CREATE POLICY intels_owner ON intels FOR ALL
  USING (EXISTS (SELECT 1 FROM applications a WHERE a.id = intels.application_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM applications a WHERE a.id = intels.application_id AND a.user_id = auth.uid()));

CREATE POLICY evals_owner ON evals FOR ALL
  USING (EXISTS (SELECT 1 FROM applications a WHERE a.id = evals.application_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM applications a WHERE a.id = evals.application_id AND a.user_id = auth.uid()));

CREATE POLICY docs_owner ON docs FOR ALL
  USING (EXISTS (SELECT 1 FROM applications a WHERE a.id = docs.application_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM applications a WHERE a.id = docs.application_id AND a.user_id = auth.uid()));

-- company_intel_cache: any authenticated user can read; only service role writes
CREATE POLICY company_intel_cache_read ON company_intel_cache FOR SELECT USING (auth.uid() IS NOT NULL);

-- webhook_events: service role only → no policies needed (RLS enabled + no policy = deny all)


-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-maintain updated_at on every UPDATE
CREATE OR REPLACE FUNCTION tg_touch_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at            BEFORE UPDATE ON profiles            FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER configs_updated_at             BEFORE UPDATE ON configs             FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER provider_configs_updated_at    BEFORE UPDATE ON provider_configs    FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER cv_documents_updated_at        BEFORE UPDATE ON cv_documents        FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER career_preferences_updated_at  BEFORE UPDATE ON career_preferences  FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER smtp_connections_updated_at    BEFORE UPDATE ON smtp_connections    FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER applications_updated_at        BEFORE UPDATE ON applications        FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();
CREATE TRIGGER docs_updated_at                BEFORE UPDATE ON docs                FOR EACH ROW EXECUTE FUNCTION tg_touch_updated_at();


-- On new auth.users row, auto-create matching profiles + configs.
-- SECURITY DEFINER so it can INSERT regardless of the caller's RLS context.
CREATE OR REPLACE FUNCTION tg_handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO configs (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION tg_handle_new_user();
