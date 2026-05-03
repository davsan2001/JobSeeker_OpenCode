import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import {
  getActiveProviderCallable,
  getApplicationMeta,
  getCompanyCache,
  getCvSummary,
  incrementTokenUsage,
  saveApplicationMeta,
  saveIntel,
  setCompanyCache
} from '@/lib/storage/supabase'
import { investigate } from '@/lib/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const meta = await getApplicationMeta(user.id, params.id)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const active = await getActiveProviderCallable(user.id)
  if (!active)
    return NextResponse.json(
      { error: 'No active provider configured. Open Settings and pick one.' },
      { status: 400 }
    )
  const cv = await getCvSummary(user.id)
  if (!cv) return NextResponse.json({ error: 'CV summary missing' }, { status: 400 })

  const cached = await getCompanyCache(meta.companySlug)
  if (cached && meta.mode === 'fast') {
    const intel = { ...cached, companySlug: meta.companySlug }
    await saveIntel(meta.id, intel)
    await saveApplicationMeta(user.id, { ...meta, status: 'investigated', updatedAt: new Date().toISOString() })
    return NextResponse.json({ intel, fromCache: true, usage: { input: 0, output: 0 } })
  }

  const updatedMeta = {
    ...meta,
    status: 'investigating' as const,
    updatedAt: new Date().toISOString()
  }
  await saveApplicationMeta(user.id, updatedMeta)

  try {
    const { intel, usage } = await investigate(
      { providerId: active.id, cfg: active.cfg },
      cv,
      {
        company: meta.company,
        role: meta.role,
        description: meta.description,
        url: meta.url,
        userNotes: meta.userNotes
      },
      { mode: meta.mode }
    )
    intel.companySlug = meta.companySlug
    await saveIntel(meta.id, intel)
    await setCompanyCache(meta.companySlug, intel)
    await incrementTokenUsage(user.id, usage.input + usage.output)
    
    const finalMeta = {
      ...meta,
      status: 'investigated' as const,
      totalTokens: (meta.totalTokens || 0) + usage.input + usage.output,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, finalMeta)
    return NextResponse.json({ intel, fromCache: false, usage })
  } catch (err) {
    const failedMeta = {
      ...meta,
      status: 'created' as const,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, failedMeta)
    return NextResponse.json(
      { error: (err as Error).message || 'investigate failed' },
      { status: 500 }
    )
  }
}