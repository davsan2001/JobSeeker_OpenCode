import type { ProviderId } from './llm/types';

export type AppMode = 'fast' | 'full';

export type PhaseId = 'investigate' | 'evaluate' | 'decide' | 'create';

export type DecisionLight = 'green' | 'yellow' | 'red';

export interface ProviderPublicConfig {
  model: string;
  baseUrl?: string;
  hasKey: boolean;          // whether an API key is stored (never exposed in plaintext)
}

export interface UserConfig {
  activeProvider: ProviderId;
  providers: Partial<Record<ProviderId, ProviderPublicConfig>>;
  mode: AppMode;
  userLocale: string;
  monthlyTokenBudget?: number;
  monthlyTokensUsed?: number;
  monthKey?: string;
  createdAt: string;
  google?: GoogleConnectionPublic;
}

/**
 * Google connection status shown to the UI. Secrets (client secret, refresh
 * token, access token) never leave the server — these flags just tell the UI
 * what's been configured.
 */
export interface GoogleConnectionPublic {
  hasClient: boolean;       // user pasted a Client ID + Secret
  clientIdMasked?: string;  // last 6 chars for sanity-check display
  connected: boolean;       // user finished the OAuth consent and we have a refresh token
  email?: string;           // which Google account is connected
  scopes?: string[];
  connectedAt?: string;
}

export interface CVSummary {
  name: string;
  headline: string;
  location?: string;
  years_experience?: number;
  languages?: { name: string; level: string }[];
  skills: { group: string; items: string[] }[];
  experience: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
    stack?: string[];
  }[];
  projects: {
    name: string;
    summary: string;
    role?: string;
    stack?: string[];
    outcomes?: string[];
  }[];
  education?: { degree: string; institution: string; year?: string }[];
  achievements?: string[];
  differentiators?: string[];
  gaps?: string[];
  target_roles?: string[];
  salary_range?: { min?: number; max?: number; currency?: string };
  compact_resume_context: string;
}

export interface JobPosting {
  company: string;
  role: string;
  description: string;
  url?: string;
  location?: string;
  seniority?: string;
  employmentType?: string;
  userNotes?: string;
}

export interface IntelReport {
  companySlug: string;
  identity: {
    name: string;
    type?: string;
    stage?: string;
    hq?: string;
    size?: string;
    products?: string[];
  };
  culture_signals: { label: string; note: string; confidence: 'high' | 'med' | 'low' }[];
  flags: { color: 'green' | 'yellow' | 'red'; note: string }[];
  hiring_manager_guess?: { title?: string; seniority?: string; background?: string };
  role_decoding: {
    hard_requirements: string[];
    soft_requirements: string[];
    nice_to_have: string[];
    keywords: string[];
    implicit_needs: string[];
  };
  match_analysis: {
    strong_matches: string[];
    partial_matches: string[];
    gaps: string[];
    technical_match_pct: number;
  };
  information_gaps: string[];
  generated_at: string;
  tokens_used?: number;
}

export interface EvalPerspective {
  id: 'HM' | 'REC' | 'RRHH' | 'PEERS' | 'VP' | 'SELF';
  label: string;
  score: number;
  key_note: string;
  concerns: string[];
  mitigations: string[];
}

export interface EvalReport {
  perspectives: EvalPerspective[];
  weighted_score: number;
  risk_reward: { best_case: string; base_case: string; worst_case: string };
  kill_switches_triggered: string[];
  light: DecisionLight;
  recommendation: 'GO_STRONG' | 'GO_CONDITIONAL' | 'SKIP';
  rationale: string;
  generated_at: string;
  tokens_used?: number;
}

export interface ApplicationMeta {
  id: string;
  company: string;
  role: string;
  companySlug: string;
  description: string;
  url?: string;
  userNotes?: string;
  mode: AppMode;
  status:
    | 'created'
    | 'investigating'
    | 'investigated'
    | 'evaluating'
    | 'evaluated'
    | 'decided_go'
    | 'decided_nogo'
    | 'creating'
    | 'created_docs'
    | 'sent';
  userDecision?: 'go' | 'nogo' | 'hold';
  createdAt: string;
  updatedAt: string;
  totalTokens?: number;
}

export interface GeneratedDocs {
  cv_markdown: string;
  cv_review: {
    reviewers: { id: string; verdict: 'PASS' | 'FLAG' | 'FAIL'; note: string }[];
    total_flags: number;
    total_fails: number;
    ready_to_send: boolean;
  };
  cover_letter_markdown: string;
  email_subject: string;
  email_body: string;
  tokens_used?: number;
}
