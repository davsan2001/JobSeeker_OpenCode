import { NextResponse } from 'next/server';
import { detectAvailableProviders, PROVIDERS } from '@/lib/llm';
import type { ProviderId } from '@/lib/llm/types';

export const runtime = 'nodejs';

export async function GET() {
  const avail = await detectAvailableProviders();
  const catalog = Object.entries(PROVIDERS).map(([id, p]) => ({
    id: id as ProviderId,
    displayName: p.displayName,
    requiresApiKey: p.requiresApiKey,
    supportsPromptCaching: p.supportsPromptCaching,
    supportsNativeJson: p.supportsNativeJson,
    defaultModels: p.defaultModels
  }));
  return NextResponse.json({ catalog, availability: avail });
}
