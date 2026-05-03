import { callLLM } from './llm';
import type { ProviderConfig, ProviderId } from './llm/types';
import {
  PHASE_PROMPTS,
  CV_SUMMARIZER
} from './framework/rules';
import type {
  ApplicationMeta,
  CVSummary,
  EvalReport,
  GeneratedDocs,
  IntelReport,
  JobPosting
} from './types';

const INTEL_SCHEMA = `Return a JSON object with these exact keys:
{
  "identity": { "name": string, "type": string?, "stage": string?, "hq": string?, "size": string?, "products": string[]? },
  "culture_signals": [{ "label": string, "note": string, "confidence": "high"|"med"|"low" }],
  "flags": [{ "color": "green"|"yellow"|"red", "note": string }],
  "hiring_manager_guess": { "title": string?, "seniority": string?, "background": string? },
  "role_decoding": {
    "hard_requirements": string[],
    "soft_requirements": string[],
    "nice_to_have": string[],
    "keywords": string[],
    "implicit_needs": string[]
  },
  "match_analysis": {
    "strong_matches": string[],
    "partial_matches": string[],
    "gaps": string[],
    "technical_match_pct": number
  },
  "information_gaps": string[]
}`;

const EVAL_SCHEMA = `Return a JSON object with these exact keys:
{
  "perspectives": [ { "id": "HM"|"REC"|"RRHH"|"PEERS"|"VP"|"SELF",
                      "label": string, "score": number,
                      "key_note": string, "concerns": string[], "mitigations": string[] } ],
  "weighted_score": number,
  "risk_reward": { "best_case": string, "base_case": string, "worst_case": string },
  "kill_switches_triggered": string[],
  "light": "green"|"yellow"|"red",
  "recommendation": "GO_STRONG"|"GO_CONDITIONAL"|"SKIP",
  "rationale": string
}`;

const CV_SUMMARY_SCHEMA = `Return a JSON object with these exact keys:
{
  "name": string,
  "headline": string,
  "location": string?,
  "years_experience": number?,
  "languages": [{ "name": string, "level": string }]?,
  "skills": [{ "group": string, "items": string[] }],
  "experience": [{
    "role": string, "company": string, "period": string,
    "highlights": string[], "stack": string[]?
  }],
  "projects": [{
    "name": string, "summary": string, "role": string?,
    "stack": string[]?, "outcomes": string[]?
  }],
  "education": [{ "degree": string, "institution": string, "year": string? }]?,
  "achievements": string[]?,
  "differentiators": string[]?,
  "gaps": string[]?,
  "target_roles": string[]?,
  "salary_range": { "min": number?, "max": number?, "currency": string? }?,
  "compact_resume_context": string
}`;

type LLMCtx = { providerId: ProviderId; cfg: ProviderConfig };

// -----------------------------------------------------------------------------
// CV Summarize
// -----------------------------------------------------------------------------
export async function summarizeCv(
  ctx: LLMCtx,
  rawCv: string
): Promise<{ summary: CVSummary; usage: { input: number; output: number } }> {
  const res = await callLLM<CVSummary>(ctx.providerId, ctx.cfg, {
    system: [
      { text: PHASE_PROMPTS.global },
      { text: CV_SUMMARIZER }
    ],
    user: `Raw resume text:\n\n<<<RESUME>>>\n${rawCv}\n<<<END>>>\n\n${CV_SUMMARY_SCHEMA}`,
    jsonOnly: true,
    maxTokens: 3000,
    temperature: 0.2
  });
  if (!res.json) throw new Error('Could not parse CV summary JSON');
  return { summary: res.json, usage: { input: res.usage.input, output: res.usage.output } };
}

function cvContextBlock(summary: CVSummary): string {
  return `# RESUME_CONTEXT (authoritative source about the candidate)\n${summary.compact_resume_context}`;
}

// -----------------------------------------------------------------------------
// PHASE 1: INVESTIGATE
// -----------------------------------------------------------------------------
export async function investigate(
  ctx: LLMCtx,
  cv: CVSummary,
  posting: JobPosting,
  opts: { mode: 'fast' | 'full' }
): Promise<{ intel: IntelReport; usage: { input: number; output: number } }> {
  const user = [
    `Target company: ${posting.company}`,
    `Target role: ${posting.role}`,
    posting.url ? `Posting URL: ${posting.url}` : '',
    posting.userNotes ? `\nUser-provided notes about the company:\n${posting.userNotes}` : '',
    '',
    'Job description (verbatim):',
    '---',
    posting.description,
    '---',
    '',
    opts.mode === 'fast'
      ? 'MODE: fast — skip deep culture speculation. Focus on role_decoding + match_analysis.'
      : 'MODE: full — include culture signals, flags and hiring_manager_guess when justifiable.',
    '',
    INTEL_SCHEMA
  ].filter(Boolean).join('\n');

  const res = await callLLM<Omit<IntelReport, 'companySlug' | 'generated_at' | 'tokens_used'>>(
    ctx.providerId,
    ctx.cfg,
    {
      system: [
        { text: PHASE_PROMPTS.global },
        { text: PHASE_PROMPTS.investigate },
        { text: cvContextBlock(cv), cache: true }
      ],
      user,
      jsonOnly: true,
      maxTokens: opts.mode === 'fast' ? 1400 : 2200,
      temperature: 0.3
    }
  );

  if (!res.json) throw new Error('Could not parse INVESTIGATE JSON');

  const intel: IntelReport = {
    ...res.json,
    companySlug: '',
    generated_at: new Date().toISOString(),
    tokens_used: res.usage.input + res.usage.output
  };
  return { intel, usage: { input: res.usage.input, output: res.usage.output } };
}

// -----------------------------------------------------------------------------
// PHASE 2: EVALUATE
// -----------------------------------------------------------------------------
export async function evaluate(
  ctx: LLMCtx,
  cv: CVSummary,
  intel: IntelReport,
  posting: JobPosting
): Promise<{ report: EvalReport; usage: { input: number; output: number } }> {
  const intelBlock = `# INTEL_CONTEXT (cached from phase 1)\n${JSON.stringify(
    {
      identity: intel.identity,
      role_decoding: intel.role_decoding,
      match_analysis: intel.match_analysis,
      flags: intel.flags,
      hiring_manager_guess: intel.hiring_manager_guess
    },
    null,
    2
  )}`;

  const user = [
    `Target: ${posting.company} — ${posting.role}.`,
    'Use the intel + resume context above to run the 6 perspectives.',
    '',
    EVAL_SCHEMA
  ].join('\n');

  const res = await callLLM<Omit<EvalReport, 'generated_at' | 'tokens_used'>>(
    ctx.providerId,
    ctx.cfg,
    {
      system: [
        { text: PHASE_PROMPTS.global },
        { text: PHASE_PROMPTS.evaluate },
        { text: cvContextBlock(cv), cache: true },
        { text: intelBlock, cache: true }
      ],
      user,
      jsonOnly: true,
      maxTokens: 2200,
      temperature: 0.3
    }
  );

  if (!res.json) throw new Error('Could not parse EVALUATE JSON');
  const report: EvalReport = {
    ...res.json,
    generated_at: new Date().toISOString(),
    tokens_used: res.usage.input + res.usage.output
  };
  return { report, usage: { input: res.usage.input, output: res.usage.output } };
}

// -----------------------------------------------------------------------------
// PHASE 4: CREATE
// -----------------------------------------------------------------------------
export async function createCv(
  ctx: LLMCtx,
  cv: CVSummary,
  intel: IntelReport,
  posting: JobPosting
): Promise<{ cv_markdown: string; usage: { input: number; output: number } }> {
  const intelBlock = `# INTEL_CONTEXT\n${JSON.stringify(
    { role_decoding: intel.role_decoding, match_analysis: intel.match_analysis },
    null,
    2
  )}`;
  const user = [
    `Company: ${posting.company}`,
    `Role: ${posting.role}`,
    `JD (for keyword pass):\n---\n${posting.description}\n---`,
    '',
    'Produce the targeted CV markdown now. Follow the 10 hard rules.'
  ].join('\n');

  const res = await callLLM(ctx.providerId, ctx.cfg, {
    system: [
      { text: PHASE_PROMPTS.global },
      { text: PHASE_PROMPTS.createCv },
      { text: cvContextBlock(cv), cache: true },
      { text: intelBlock, cache: true }
    ],
    user,
    maxTokens: 2200,
    temperature: 0.4
  });
  return { cv_markdown: res.text, usage: { input: res.usage.input, output: res.usage.output } };
}

export async function reviewCv(
  ctx: LLMCtx,
  cv: CVSummary,
  cvMarkdown: string,
  posting: JobPosting
): Promise<{
  review: GeneratedDocs['cv_review'];
  usage: { input: number; output: number };
}> {
  const REVIEW_SCHEMA = `Return JSON:
{
  "reviewers": [{ "id": "HM"|"REC"|"RRHH"|"PEERS"|"VP"|"SELF"|"EXPERT",
                  "verdict": "PASS"|"FLAG"|"FAIL", "note": string }],
  "total_flags": number,
  "total_fails": number,
  "ready_to_send": boolean
}`;
  const user = [
    `Role: ${posting.role} @ ${posting.company}`,
    '',
    'CV under review:',
    '---',
    cvMarkdown,
    '---',
    '',
    'Run the 7-reviewer panel. Be strict on R6 (SELF) — any fabrication = FAIL.',
    '',
    REVIEW_SCHEMA
  ].join('\n');

  const res = await callLLM<GeneratedDocs['cv_review']>(ctx.providerId, ctx.cfg, {
    system: [
      { text: PHASE_PROMPTS.global },
      { text: PHASE_PROMPTS.reviewPanel },
      { text: cvContextBlock(cv), cache: true }
    ],
    user,
    jsonOnly: true,
    maxTokens: 1600,
    temperature: 0.2
  });
  if (!res.json)
    return {
      review: { reviewers: [], total_flags: 0, total_fails: 0, ready_to_send: true },
      usage: { input: res.usage.input, output: res.usage.output }
    };
  return { review: res.json, usage: { input: res.usage.input, output: res.usage.output } };
}

export async function createCoverAndEmail(
  ctx: LLMCtx,
  cv: CVSummary,
  intel: IntelReport,
  posting: JobPosting
): Promise<{
  cover_letter_markdown: string;
  email_subject: string;
  email_body: string;
  usage: { input: number; output: number };
}> {
  const SCHEMA = `Return JSON:
{
  "cover_letter_markdown": string,
  "email_subject": string,
  "email_body": string
}`;
  const intelBlock = `# INTEL_CONTEXT\n${JSON.stringify(
    {
      identity: intel.identity,
      role_decoding: intel.role_decoding,
      match_analysis: intel.match_analysis
    },
    null,
    2
  )}`;
  const user = [
    `Company: ${posting.company}`,
    `Role: ${posting.role}`,
    `JD:\n---\n${posting.description}\n---`,
    '',
    'Generate the cover letter (4 paragraphs) and the short email wrapper.',
    '',
    SCHEMA
  ].join('\n');

  const res = await callLLM<{
    cover_letter_markdown: string;
    email_subject: string;
    email_body: string;
  }>(ctx.providerId, ctx.cfg, {
    system: [
      { text: PHASE_PROMPTS.global },
      { text: PHASE_PROMPTS.coverLetter },
      { text: PHASE_PROMPTS.email },
      { text: cvContextBlock(cv), cache: true },
      { text: intelBlock, cache: true }
    ],
    user,
    jsonOnly: true,
    maxTokens: 1800,
    temperature: 0.5
  });

  if (!res.json) {
    return {
      cover_letter_markdown: '',
      email_subject: `Application — ${posting.role} — ${cv.name}`,
      email_body: '',
      usage: { input: res.usage.input, output: res.usage.output }
    };
  }
  return { ...res.json, usage: { input: res.usage.input, output: res.usage.output } };
}

// -----------------------------------------------------------------------------
export function deriveDecision(report: EvalReport): {
  status: ApplicationMeta['status'];
  canCreate: boolean;
} {
  if (report.kill_switches_triggered.length > 0 || report.light === 'red') {
    return { status: 'evaluated', canCreate: false };
  }
  return { status: 'evaluated', canCreate: true };
}
