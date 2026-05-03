import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import {
  getActiveProviderCallable,
  getApplicationMeta,
  getCvSummary,
  getIntel,
  incrementTokenUsage,
  saveApplicationMeta,
  saveEval
} from '@/lib/storage/supabase'
import { deriveDecision, evaluate } from '@/lib/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const meta = await getApplicationMeta(user.id, params.id)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const intel = await getIntel(params.id)
  if (!intel)
    return NextResponse.json({ error: 'Run INVESTIGATE first' }, { status: 400 })
  const active = await getActiveProviderCallable(user.id)
  if (!active)
    return NextResponse.json(
      { error: 'No active provider configured. Open Settings and pick one.' },
      { status: 400 }
    )
  const cv = await getCvSummary(user.id)
  if (!cv) return NextResponse.json({ error: 'CV summary missing' }, { status: 400 })

  const updatedMeta = {
    ...meta,
    status: 'evaluating' as const,
    updatedAt: new Date().toISOString()
  }
  await saveApplicationMeta(user.id, updatedMeta)

  try {
    const { report, usage } = await evaluate(
      { providerId: active.id, cfg: active.cfg },
      cv,
      intel,
      {
        company: meta.company,
        role: meta.role,
        description: meta.description,
        url: meta.url,
        userNotes: meta.userNotes
      }
    )
    await saveEval(meta.id, report)
    await incrementTokenUsage(user.id, usage.input + usage.output)
    const { status } = deriveDecision(report)
    const finalMeta = {
      ...meta,
      status,
      totalTokens: (meta.totalTokens || 0) + usage.input + usage.output,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, finalMeta)
    return NextResponse.json({ report, usage })
  } catch (err) {
    const failedMeta = {
      ...meta,
      status: 'investigated' as const,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, failedMeta)
    return NextResponse.json(
      { error: (err as Error).message || 'evaluate failed' },
      { status: 500 }
    )
  }
}