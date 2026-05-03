import { anthropicProvider } from './anthropic';
import { claudeCodeProvider, isClaudeCodeAvailable } from './claude-code';
import { googleProvider } from './google';
import { openaiProvider, groqProvider, ollamaProvider } from './openai-compat';
import type { LLMCallOptions, LLMCallResult, LLMProvider, ProviderConfig, ProviderId } from './types';

export const PROVIDERS: Record<ProviderId, LLMProvider> = {
  anthropic: anthropicProvider,
  'claude-code': claudeCodeProvider,
  google: googleProvider,
  openai: openaiProvider,
  groq: groqProvider,
  ollama: ollamaProvider
};

export function getProvider(id: ProviderId): LLMProvider {
  const p = PROVIDERS[id];
  if (!p) throw new Error(`Unknown provider: ${id}`);
  return p;
}

export async function callLLM<T = unknown>(
  providerId: ProviderId,
  cfg: ProviderConfig,
  opts: LLMCallOptions
): Promise<LLMCallResult<T>> {
  const provider = getProvider(providerId);
  // Strip cache hints for providers that don't support them so the signal
  // doesn't leak into later bookkeeping.
  const system = provider.supportsPromptCaching
    ? opts.system
    : opts.system.map((b) => ({ ...b, cache: false }));
  return provider.call<T>(cfg, { ...opts, system });
}

export async function detectAvailableProviders(): Promise<{
  claudeCode: { ok: boolean; version?: string; reason?: string };
  ollama: { ok: boolean; reason?: string };
}> {
  const [cc, ol] = await Promise.all([
    isClaudeCodeAvailable(),
    probeOllama()
  ]);
  return { claudeCode: cc, ollama: ol };
}

async function probeOllama(): Promise<{ ok: boolean; reason?: string }> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 1500);
    const res = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
    clearTimeout(t);
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}

export type { LLMCallOptions, LLMCallResult, LLMProvider, ProviderConfig, ProviderId } from './types';
