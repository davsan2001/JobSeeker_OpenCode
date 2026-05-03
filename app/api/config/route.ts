import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getConfig, saveConfig } from '@/lib/storage/supabase'
import { PROVIDERS } from '@/lib/llm'
import type { ProviderId } from '@/lib/llm/types'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({
    activeProvider: 'anthropic',
    providers: {},
    mode: 'fast',
    userLocale: 'auto',
    createdAt: new Date().toISOString()
  })
}

interface PutBody {
  activeProvider?: ProviderId
  provider?: {
    id: ProviderId
    apiKey?: string
    clearApiKey?: boolean
    model?: string
    baseUrl?: string
  }
  mode?: 'fast' | 'full'
  monthlyTokenBudget?: number
}

export async function PUT(req: Request) {
  try {
    const user = await requireUser()
    const body = (await req.json()) as PutBody

    if (body.activeProvider && !PROVIDERS[body.activeProvider]) {
      return NextResponse.json(
        { error: `Unknown provider: ${body.activeProvider}` },
        { status: 400 }
      )
    }
    if (body.provider) {
      const pid = body.provider.id
      if (!PROVIDERS[pid]) {
        return NextResponse.json({ error: `Unknown provider: ${pid}` }, { status: 400 })
      }
      if (body.provider.apiKey && pid === 'anthropic' && !body.provider.apiKey.startsWith('sk-ant-')) {
        return NextResponse.json(
          { error: 'Anthropic API key should start with sk-ant-' },
          { status: 400 }
        )
      }
    }

    const cfg = await saveConfig(user.id, body)
    return NextResponse.json(cfg)
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'failed to save config' },
      { status: 500 }
    )
  }
}