import { LLMCallError, safeParseJson, type LLMProvider, type ProviderId } from './types';

// Shared implementation for OpenAI-compatible providers: OpenAI, Groq, Ollama,
// OpenRouter, DeepSeek, etc. Differ only in baseUrl, auth header, and model list.

interface CompatOpts {
  id: ProviderId;
  displayName: string;
  defaultBaseUrl: string;
  requiresApiKey: boolean;
  authHeader?: (key: string) => Record<string, string>;
  defaultModels: LLMProvider['defaultModels'];
}

function makeProvider(o: CompatOpts): LLMProvider {
  return {
    id: o.id,
    displayName: o.displayName,
    supportsPromptCaching: o.id === 'openai',    // OpenAI has automatic caching since late 2024
    supportsNativeJson: true,
    requiresApiKey: o.requiresApiKey,
    defaultModels: o.defaultModels,

    async call(cfg, opts) {
      if (o.requiresApiKey && !cfg.apiKey)
        throw new LLMCallError(`${o.displayName} API key missing`, o.id);

      const base = (cfg.baseUrl || o.defaultBaseUrl).replace(/\/$/, '');
      const url = `${base}/chat/completions`;

      const messages = [
        ...opts.system.map((b) => ({ role: 'system' as const, content: b.text })),
        {
          role: 'user' as const,
          content: opts.jsonOnly
            ? `${opts.user}\n\nReturn ONLY valid JSON. No prose. No markdown fences.`
            : opts.user
        }
      ];

      const body: Record<string, unknown> = {
        model: cfg.model,
        messages,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 2048,
        ...(opts.jsonOnly ? { response_format: { type: 'json_object' } } : {})
      };

      const headers: Record<string, string> = { 'content-type': 'application/json' };
      if (cfg.apiKey) {
        const authHeaders = o.authHeader
          ? o.authHeader(cfg.apiKey)
          : { authorization: `Bearer ${cfg.apiKey}` };
        Object.assign(headers, authHeaders);
      }

      const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
      const raw = await res.text();
      if (!res.ok) throw new LLMCallError(`${o.displayName} ${res.status}: ${raw}`, o.id, res.status, raw);

      const data = JSON.parse(raw) as {
        choices: { message: { content: string } }[];
        usage?: {
          prompt_tokens?: number;
          completion_tokens?: number;
          prompt_tokens_details?: { cached_tokens?: number };
        };
      };
      const text = (data.choices?.[0]?.message?.content || '').trim();
      return {
        text,
        json: opts.jsonOnly ? safeParseJson(text) : undefined,
        usage: {
          input: data.usage?.prompt_tokens || 0,
          output: data.usage?.completion_tokens || 0,
          cached_read: data.usage?.prompt_tokens_details?.cached_tokens
        },
        provider: o.id,
        model: cfg.model
      };
    }
  };
}

export const openaiProvider = makeProvider({
  id: 'openai',
  displayName: 'OpenAI (pay per token)',
  defaultBaseUrl: 'https://api.openai.com/v1',
  requiresApiKey: true,
  defaultModels: [
    { id: 'gpt-4o-mini', label: 'GPT-4o mini', note: 'cheap, capable' },
    { id: 'gpt-4o', label: 'GPT-4o', note: 'balanced' },
    { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini' }
  ]
});

export const groqProvider = makeProvider({
  id: 'groq',
  displayName: 'Groq (free tier, very fast)',
  defaultBaseUrl: 'https://api.groq.com/openai/v1',
  requiresApiKey: true,
  defaultModels: [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', note: 'recommended' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', note: 'fast, cheaper' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' }
  ]
});

export const ollamaProvider = makeProvider({
  id: 'ollama',
  displayName: 'Ollama (local, no internet, no cost)',
  defaultBaseUrl: 'http://localhost:11434/v1',
  requiresApiKey: false,
  authHeader: () => ({}),
  defaultModels: [
    { id: 'llama3.3', label: 'Llama 3.3 70B' },
    { id: 'qwen2.5:14b', label: 'Qwen 2.5 14B' },
    { id: 'qwen2.5:7b', label: 'Qwen 2.5 7B', note: 'lighter' }
  ]
});
