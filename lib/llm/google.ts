import { LLMCallError, safeParseJson, type LLMProvider } from './types';

// Gemini via REST: https://ai.google.dev/api/generate-content
// Free tier is generous on Flash. API keys at https://aistudio.google.com/apikey

export const googleProvider: LLMProvider = {
  id: 'google',
  displayName: 'Google Gemini (free tier available)',
  supportsPromptCaching: false,   // Gemini has explicit caching but with different mechanics — MVP skips it
  supportsNativeJson: true,
  requiresApiKey: true,
  defaultModels: [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', note: 'free tier, recommended' },
    { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', note: 'higher quality, quota limited' },
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', note: 'fallback' }
  ],

  async call(cfg, opts) {
    if (!cfg.apiKey) throw new LLMCallError('Google API key missing', 'google');

    const systemText = opts.system.map((b) => b.text).join('\n\n');
    const userMsg = opts.jsonOnly
      ? `${opts.user}\n\nReturn ONLY valid JSON. No prose. No markdown fences.`
      : opts.user;

    const body: Record<string, unknown> = {
      system_instruction: { parts: [{ text: systemText }] },
      contents: [{ role: 'user', parts: [{ text: userMsg }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.3,
        maxOutputTokens: opts.maxTokens ?? 2048,
        ...(opts.jsonOnly ? { responseMimeType: 'application/json' } : {})
      }
    };

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    const raw = await res.text();
    if (!res.ok) throw new LLMCallError(`Google ${res.status}: ${raw}`, 'google', res.status, raw);

    const data = JSON.parse(raw) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };
    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join('')
        .trim() ?? '';
    return {
      text,
      json: opts.jsonOnly ? safeParseJson(text) : undefined,
      usage: {
        input: data.usageMetadata?.promptTokenCount || 0,
        output: data.usageMetadata?.candidatesTokenCount || 0
      },
      provider: 'google',
      model: cfg.model
    };
  }
};
