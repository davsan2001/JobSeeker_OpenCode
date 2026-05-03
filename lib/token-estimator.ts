// Lightweight token estimator. We don't ship a real tokenizer to keep deps
// minimal; ~4 chars/token is a safe rule of thumb for English/Spanish mixed
// prose. Good enough for UI budget meters — not for billing.

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function classifyCost(tokens: number): 'low' | 'med' | 'high' {
  if (tokens < 1500) return 'low';
  if (tokens < 6000) return 'med';
  return 'high';
}

export function formatCost(inputTokens: number, outputTokens: number, model: string) {
  // Rough pricing table (USD per 1M tokens). Update as needed.
  const PRICING: Record<string, { in: number; out: number }> = {
    'claude-opus-4-7': { in: 15, out: 75 },
    'claude-sonnet-4-6': { in: 3, out: 15 },
    'claude-haiku-4-5-20251001': { in: 1, out: 5 }
  };
  const p = PRICING[model] || PRICING['claude-haiku-4-5-20251001'];
  const cost = (inputTokens * p.in + outputTokens * p.out) / 1_000_000;
  return { usd: cost, model };
}
