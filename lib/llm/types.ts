export type ProviderId =
  | 'anthropic'
  | 'claude-code'
  | 'google'
  | 'openai'
  | 'groq'
  | 'ollama';

export interface ProviderConfig {
  apiKey?: string;          // encrypted at rest in storage, decrypted when passed here
  baseUrl?: string;         // for openai-compat / ollama
  model: string;
}

export interface LLMSystemBlock {
  text: string;
  /**
   * Hint: this block is large + stable across calls in a session, so mark it
   * for prompt caching when the provider supports it. Providers that do not
   * support caching simply concatenate it normally.
   */
  cache?: boolean;
}

export interface LLMCallOptions {
  system: LLMSystemBlock[];
  user: string;
  maxTokens?: number;
  temperature?: number;
  /** Ask for JSON. We parse and attach to result.json when possible. */
  jsonOnly?: boolean;
}

export interface LLMUsage {
  input: number;
  output: number;
  cached_read?: number;
  cached_write?: number;
}

export interface LLMCallResult<T = unknown> {
  text: string;
  json?: T;
  usage: LLMUsage;
  provider: ProviderId;
  model: string;
}

export interface LLMProvider {
  id: ProviderId;
  displayName: string;
  /** If false, we skip prompt-caching plumbing for this provider. */
  supportsPromptCaching: boolean;
  /** Whether the provider has a dedicated JSON response mode. We still
   *  double-parse defensively. */
  supportsNativeJson: boolean;
  /** For Claude Code: does the user need a binary installed? */
  requiresBinary?: string;
  /** Does the user provide an API key in settings? */
  requiresApiKey: boolean;
  /** Optional default models surfaced in the UI. */
  defaultModels: { id: string; label: string; note?: string }[];
  /** The main call. */
  call<T = unknown>(cfg: ProviderConfig, opts: LLMCallOptions): Promise<LLMCallResult<T>>;
}

export class LLMCallError extends Error {
  constructor(
    message: string,
    public readonly provider: ProviderId,
    public readonly status?: number,
    public readonly raw?: string
  ) {
    super(message);
  }
}

export function safeParseJson<T>(raw: string): T | undefined {
  let s = raw.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\n?/, '').replace(/```\s*$/, '').trim();
  }
  const firstBrace = s.search(/[{[]/);
  if (firstBrace > 0) s = s.slice(firstBrace);
  const lastClose = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
  if (lastClose > 0 && lastClose < s.length - 1) s = s.slice(0, lastClose + 1);
  try {
    return JSON.parse(s) as T;
  } catch {
    return undefined;
  }
}
