/**
 * Hand-written `Database` type for the Supabase client.
 *
 * For the MVP we curate this by hand to avoid pulling in the Supabase CLI
 * toolchain. Once the schema stabilizes, we can replace this with the output
 * of:
 *
 *   supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 *
 * Keep these definitions in sync with `supabase/migrations/0001_init.sql`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------- Enums mirror of 0001_init.sql ----------------------------------

export type Tier = 'free' | 'pro' | 'elite';

export type SubscriptionStatus =
  | 'active'
  | 'on_trial'
  | 'past_due'
  | 'cancelled'
  | 'expired'
  | 'paused';

export type AppMode = 'fast' | 'full';

export type ApplicationStatus =
  | 'created'
  | 'investigating'
  | 'investigated'
  | 'evaluating'
  | 'evaluated'
  | 'decided_go'
  | 'decided_nogo'
  | 'decided_hold'
  | 'creating'
  | 'created_docs'
  | 'sent';

export type ApplicationSource = 'manual' | 'discover' | 'auto_apply';

export type ProviderId =
  | 'anthropic'
  | 'google'
  | 'openai'
  | 'groq'
  | 'ollama'
  | 'claude-code';

export type AiKeyMode = 'ours' | 'byo';

export type JobMatchStatus = 'new' | 'dismissed' | 'applied' | 'saved';

export type JobSource = 'adzuna' | 'remotive' | 'remoteok' | 'weworkremotely';

export type EmailSendStatus = 'sent' | 'draft' | 'failed';

// ---------- Row shapes ------------------------------------------------------
// Each table gets Row / Insert / Update triplets so `.from(...).insert(...)`
// and `.update(...)` are type-checked.

type Timestamp = string;
type Uuid = string;

export interface ProfileRow {
  id: Uuid;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
  timezone: string;
  tier: Tier;
  subscription_status: SubscriptionStatus | null;
  subscription_provider: string | null;
  subscription_id: string | null;
  subscription_variant_id: string | null;
  subscription_current_period_end: Timestamp | null;
  subscription_cancel_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ConfigRow {
  user_id: Uuid;
  active_provider: ProviderId;
  mode: AppMode;
  user_locale: string;
  ai_key_mode: AiKeyMode;
  monthly_token_budget: number | null;
  monthly_tokens_used: number;
  month_key: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ProviderConfigRow {
  user_id: Uuid;
  provider_id: ProviderId;
  model: string;
  base_url: string | null;
  api_key_enc: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CvDocumentRow {
  user_id: Uuid;
  raw_text: string | null;
  summary: Json | null;
  tokens_used: number | null;
  summarized_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CareerPreferenceRow {
  user_id: Uuid;
  desired_roles: string[];
  locations: string[];
  remote_ok: boolean;
  seniority: string | null;
  employment_types: string[];
  min_salary: number | null;
  salary_currency: string | null;
  industries_to_avoid: string[];
  languages: string[];
  min_match_score: number;
  daily_apply_limit: number | null;
  daily_auto_send: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SmtpConnectionRow {
  user_id: Uuid;
  from_email: string;
  from_name: string | null;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password_enc: string;
  last_verified_at: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ApplicationRow {
  id: Uuid;
  user_id: Uuid;
  company: string;
  role: string;
  company_slug: string;
  description: string;
  url: string | null;
  user_notes: string | null;
  mode: AppMode;
  status: ApplicationStatus;
  user_decision: 'go' | 'nogo' | 'hold' | null;
  source: ApplicationSource;
  match_score: number | null;
  total_tokens: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface IntelRow {
  application_id: Uuid;
  data: Json;
  tokens_used: number;
  from_cache: boolean;
  generated_at: Timestamp;
}

export interface EvalRow {
  application_id: Uuid;
  data: Json;
  tokens_used: number;
  generated_at: Timestamp;
}

export interface DocRow {
  application_id: Uuid;
  cv_markdown: string;
  cover_letter_markdown: string;
  email_subject: string;
  email_body: string;
  review: Json;
  tokens_used: number;
  generated_at: Timestamp;
  updated_at: Timestamp;
}

export interface CompanyIntelCacheRow {
  company_slug: string;
  intel: Json;
  cached_at: Timestamp;
}

export interface EmailSendRow {
  id: Uuid;
  application_id: Uuid;
  user_id: Uuid;
  to_email: string;
  cc_email: string | null;
  bcc_email: string | null;
  subject: string;
  body: string;
  status: EmailSendStatus;
  message_id: string | null;
  error: string | null;
  sent_at: Timestamp | null;
  created_at: Timestamp;
}

export interface JobMatchRow {
  id: Uuid;
  user_id: Uuid;
  source: JobSource;
  external_id: string;
  company: string;
  role: string;
  url: string;
  location: string | null;
  is_remote: boolean | null;
  posted_at: Timestamp | null;
  description: string | null;
  match_score: number | null;
  match_reasons: Json | null;
  status: JobMatchStatus;
  application_id: Uuid | null;
  created_at: Timestamp;
}

export interface DailyRunRow {
  id: Uuid;
  user_id: Uuid;
  run_date: string; // YYYY-MM-DD
  jobs_scanned: number;
  jobs_matched: number;
  applications_created: number;
  applications_sent: number;
  summary_email_sent_at: Timestamp | null;
  tokens_used: number;
  error: string | null;
  created_at: Timestamp;
}

export interface WebhookEventRow {
  id: Uuid;
  provider: string;
  event_id: string;
  event_type: string;
  payload: Json;
  processed_at: Timestamp | null;
  error: string | null;
  created_at: Timestamp;
}

// ---------- Database shape --------------------------------------------------
// Helper so Insert/Update types stay close to Row without repetition.
type RowShape<R> = {
  Row: R;
  Insert: Partial<R> & { [K in keyof R as undefined extends R[K] ? never : K]: R[K] };
  Update: Partial<R>;
};

// Relax: MVP uses `Partial<R>` for both Insert/Update. Defaults fill the rest.
// (We'll switch to the stricter RowShape once the CLI-generated types land.)
type Table<R> = {
  Row: R;
  Insert: Partial<R>;
  Update: Partial<R>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<ProfileRow>;
      configs: Table<ConfigRow>;
      provider_configs: Table<ProviderConfigRow>;
      cv_documents: Table<CvDocumentRow>;
      career_preferences: Table<CareerPreferenceRow>;
      smtp_connections: Table<SmtpConnectionRow>;
      applications: Table<ApplicationRow>;
      intels: Table<IntelRow>;
      evals: Table<EvalRow>;
      docs: Table<DocRow>;
      company_intel_cache: Table<CompanyIntelCacheRow>;
      email_sends: Table<EmailSendRow>;
      job_matches: Table<JobMatchRow>;
      daily_runs: Table<DailyRunRow>;
      webhook_events: Table<WebhookEventRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      tier: Tier;
      subscription_status: SubscriptionStatus;
      app_mode: AppMode;
      application_status: ApplicationStatus;
      application_source: ApplicationSource;
      provider_id: ProviderId;
      ai_key_mode: AiKeyMode;
      job_match_status: JobMatchStatus;
      job_source: JobSource;
      email_send_status: EmailSendStatus;
    };
    CompositeTypes: Record<string, never>;
  };
}
