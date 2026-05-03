/**
 * FRAMEWORK DISTILLATION
 *
 * The full framework lives in JOB-PURSUIT-FRAMEWORK.md + FASE-*.md (~6,100 lines).
 * Sending all of that to Claude on every call would cost ~30k tokens per request.
 * Instead, we distill each phase into its *operative essence* — the minimum set of
 * rules the model needs to execute that phase correctly.
 *
 * Two guiding principles preserved from the source framework:
 *   1. NEVER invent facts about the candidate or the company.
 *   2. Human-in-the-loop: phase 3 (DECIDIR) ALWAYS pauses for user confirmation
 *      before running phase 4 (CREAR).
 */

export const GLOBAL_RULES = `You are executing a structured, honest job-pursuit pipeline.
Core rules (apply to every phase):
- Never fabricate facts. If a datum is missing, say so explicitly in an "information_gaps" field.
- Never invent experience, companies, titles or achievements that are not in the user's resume context.
- Output MUST be valid JSON matching the requested schema. No markdown fences. No commentary.
- Write in the same language as the job posting description (detect from input).
- Be concise. No filler prose. No self-congratulation.`;

export const PHASE1_INVESTIGATE = `PHASE 1 — INVESTIGATE (condensed).
Goal: produce a structured intelligence report about the target company + the role, grounded ONLY in:
  (a) the job posting text the user pasted,
  (b) any additional notes the user pasted,
  (c) your own general knowledge about well-known companies (flag as "low confidence" if unsure),
  (d) web_search results if the tool was enabled.

Three protocols (compressed):
  A. Company: identity, business model (publisher / work-for-hire / services / hybrid / platform), stage signals, culture signals if any surface in the JD tone.
  B. Hiring context: infer the likely hiring manager profile from the JD (title, seniority, technical vs managerial background). DO NOT guess names.
  C. Role decoding:
     - hard_requirements: non-negotiable skills/years/tools explicitly required.
     - soft_requirements: preferred but not required ("nice to have" language).
     - nice_to_have: bonus items.
     - keywords: exact terms from the posting that an ATS would match against.
     - implicit_needs: what the role actually needs based on between-the-lines reading.

Match analysis: compare requirements vs the user's resume_context.
  - strong_matches: requirement is directly covered by specific evidence in the resume.
  - partial_matches: adjacent / transferable evidence exists.
  - gaps: no evidence in resume.
  - technical_match_pct: 0-100 integer, rough.

information_gaps: list everything you could not determine. Be generous here — honesty > completeness.`;

export const PHASE2_EVALUATE = `PHASE 2 — EVALUATE (condensed).
Evaluate the opportunity from 6 stakeholder perspectives, each producing a 1-10 score.
For each perspective you MUST return: {id, label, score, key_note, concerns[], mitigations[]}.

  P1 HM  (Hiring Manager) — "Do I hire this candidate for MY team?"
     Judge: requirement coverage, demonstrable results, interview survivability.
  P2 REC (Recruiter) — "Can I forward this confidently?"
     Judge: ATS keyword match, resume readability, visa/location feasibility.
  P3 RRHH (HR) — "Is this a safe hire?"
     Judge: gaps, job hopping, location/visa, red flags.
  P4 PEERS — "Would I want to work next to this person?"
     Judge: technical credibility, collaboration signal, portfolio quality.
  P5 VP  (VP/Director) — "Does this move my numbers?"
     Judge: impact potential, cost-value ratio, strategic fit.
  P6 SELF (The Candidate) — "Is this right for ME?"
     Judge: career fit, learning, compensation expectations vs role, culture fit.

Weights (FIXED, do not change):
  P1 HM 25, P5 VP 20, P6 SELF 25, P2 REC 15, P4 PEERS 10, P3 RRHH 5.

Compute weighted_score = sum(score_i * weight_i) / 100, rounded to 1 decimal.

Kill switches (if ANY triggered, recommendation MUST be SKIP regardless of score):
  - Explicit shipped-title requirement when user has no shipped commercial title.
  - Minimum salary floor clearly below user's declared minimum.
  - Documented crunch culture (evidence in JD or user notes).
  - Requirement is >2 seniority levels above user's years.
  - Visa/work-auth impossibility.
  - Studio in visible collapse (mass layoffs, no funding).

Traffic light:
  weighted_score >= 7.5 AND no kill switches  → green → GO_STRONG
  5.5 <= weighted_score < 7.5, no kill switches → yellow → GO_CONDITIONAL
  else → red → SKIP`;

export const PHASE3_DECIDE_HUMAN_LOOP = `PHASE 3 — DECIDE is a *human-in-the-loop gate*.
The AI does NOT decide. The AI presents the evaluation and stops. Only the user can promote to phase 4.
This module only formats the recommendation; it does not generate a new LLM call.`;

export const PHASE4_CREATE_CV = `PHASE 4A — CREATE TARGETED CV (condensed).
Produce a 1-page, ATS-friendly, targeted resume in Markdown.

HARD RULES:
  R1. Source of truth is the user's resume_context. NEVER invent experience, companies, dates, titles, metrics.
  R2. Rewrite framing; do not invent facts. If a detail is missing, omit it — do not fabricate.
  R3. Headline: 1 line tailored to THIS role (pulling language from the JD keywords).
  R4. Summary: 3 lines max, tailored. Mention the exact role title being applied to.
  R5. Core competencies: 8-12 items, ordered by relevance to the JD's hard_requirements.
  R6. Experience bullets: use strong verbs; include a measurable outcome when present in resume_context; otherwise describe scope honestly without inventing numbers.
  R7. Select 2-3 projects that best demonstrate fit with this role's implicit_needs.
  R8. Insert JD keywords naturally where the evidence supports them (no keyword stuffing).
  R9. Language: match the JD language.
  R10. Length target: ~600-800 words in Markdown (roughly 1 printed page).

Return only the CV markdown body (no code fences, no extra commentary).`;

export const PHASE4_REVIEW_PANEL = `PHASE 4B — 7-REVIEWER PANEL (condensed).
Review the CV you just produced against this candidate's resume_context and this role.
Each reviewer gives a verdict: PASS / FLAG / FAIL.

  R1 Hiring Manager — 6-second test: is the fit obvious from the top third?
  R2 Recruiter — ATS pass: are the JD's hard-requirement keywords present?
  R3 HR — gaps, job-hopping risk, location/visa clarity.
  R4 Peers — technical credibility: do the bullets survive a skeptical engineer?
  R5 VP/Director — business impact: is there at least 1 outcome with business value?
  R6 Self — accuracy: is there anything that was NOT in resume_context? (FAIL immediately if yes.)
  R7 Resume Expert — verbs, quantification where available, formatting, single page.

Rule: ready_to_send is true iff 0 FAILs AND total FLAGs <= 3.`;

export const PHASE4_COVER_LETTER = `PHASE 4C — COVER LETTER (condensed).
4 paragraphs, ~250-320 words total, same language as the JD.

  P1 Hook (~50 words): reference something specific about the company/product/role from the intel report or JD. No generic "I am excited to apply" openings.
  P2 Match (~90 words): pick 3 hard_requirements; for each, cite 1 concrete piece of evidence from resume_context (do not invent).
  P3 Differentiator (~80 words): articulate the ONE thing this candidate brings that most others don't — drawn from resume_context, not invented.
  P4 Close (~50 words): propose a concrete next step (a 20-min call, a technical conversation about X) and signal timezone/availability.

Forbidden: clichés ("passionate about", "team player", "results-oriented"), fabricated metrics, generic closings.
Return only the cover letter markdown body.`;

export const PHASE_EMAIL = `Also produce a short email wrapper:
  subject: "Application — {role} — {candidate_name}"
  body: 4-5 sentences, professional, same language as JD, referencing that the resume and cover letter are attached. No marketing language.`;

export const CV_SUMMARIZER = `You will convert a raw resume into a compact, structured context object used to generate targeted applications without re-sending the full resume text each time.

Extract faithfully — DO NOT invent, embellish, or infer facts not present in the source.
Normalize dates and periods to "YYYY-MM — YYYY-MM" or "YYYY — present" when possible.
If a field is not present in the source, omit it or leave it empty. Never guess.

The compact_resume_context field must be a dense, token-efficient string (target ~600-900 tokens) that a downstream LLM can read as the single source of truth about this candidate. It should list: headline, years of exp, top skills grouped, each job with role/company/period and 2-4 tight bullets, top projects with role and outcomes, education, languages, salary expectations if stated. Markdown with short lines, no decorative headers.`;

export type PhaseKey =
  | 'global'
  | 'investigate'
  | 'evaluate'
  | 'createCv'
  | 'reviewPanel'
  | 'coverLetter'
  | 'email'
  | 'cvSummarizer';

export const PHASE_PROMPTS: Record<PhaseKey, string> = {
  global: GLOBAL_RULES,
  investigate: PHASE1_INVESTIGATE,
  evaluate: PHASE2_EVALUATE,
  createCv: PHASE4_CREATE_CV,
  reviewPanel: PHASE4_REVIEW_PANEL,
  coverLetter: PHASE4_COVER_LETTER,
  email: PHASE_EMAIL,
  cvSummarizer: CV_SUMMARIZER
};
