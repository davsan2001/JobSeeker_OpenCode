import { LLMCallError, safeParseJson, type LLMProvider } from './types';

export const anthropicProvider: LLMProvider = {
  id: 'anthropic',
  displayName: 'Anthropic API (pay per token)',
  supportsPromptCaching: true,
  supportsNativeJson: false,
  requiresApiKey: true,
  defaultModels: [
    { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5', note: 'fastest, cheapest' },
    { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6', note: 'balanced' },
    { id: 'claude-opus-4-7', label: 'Opus 4.7', note: 'best quality' }
  ],

  async call(cfg, opts) {
    if (!cfg.apiKey) throw new LLMCallError('Anthropic API key missing', 'anthropic');

    const systemBlocks = opts.system.map((b) =>
      b.cache
        ? { type: 'text', text: b.text, cache_control: { type: 'ephemeral' } }
        : { type: 'text', text: b.text }
    );

    const userMsg = opts.jsonOnly
      ? `${opts.user}\n\nReturn ONLY valid JSON. No prose. No markdown fences.`
      : opts.user;

    const body = {
      model: cfg.model,
      max_tokens: opts.maxTokens ?? 2048,
      temperature: opts.temperature ?? 0.3,
      system: systemBlocks,
      messages: [{ role: 'user', content: userMsg }]
    };

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31'
      },
      body: JSON.stringify(body)
    });

    const raw = await res.text();
    if (!res.ok) throw new LLMCallError(`Anthropic ${res.status}: ${raw}`, 'anthropic', res.status, raw);

    const data = JSON.parse(raw) as {
      content: { type: string; text?: string }[];
      usage: {
        input_tokens: number;
        output_tokens: number;
        cache_read_input_tokens?: number;
        cache_creation_input_tokens?: number;
      };
    };
    const text = data.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('\n')
      .trim();

    return {
      text,
      json: opts.jsonOnly ? safeParseJson(text) : undefined,
      usage: {
        input: data.usage.input_tokens,
        output: data.usage.output_tokens,
        cached_read: data.usage.cache_read_input_tokens,
        cached_write: data.usage.cache_creation_input_tokens
      },
      provider: 'anthropic',
      model: cfg.model
    };
  }
};
