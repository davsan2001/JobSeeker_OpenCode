import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import {
  getActiveProviderCallable,
  getApplicationMeta,
  getCompanyCache,
  getCvSummary,
  getIntel,
  incrementTokenUsage,
  saveApplicationMeta,
  saveEval,
  saveIntel,
  setCompanyCache
} from '@/lib/storage/supabase'
import { deriveDecision, evaluate, investigate } from '@/lib/pipeline'
import type { IntelReport } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 180

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

  const ctx = { providerId: active.id, cfg: active.cfg }
  const posting = {
    company: meta.company,
    role: meta.role,
    description: meta.description,
    url: meta.url,
    userNotes: meta.userNotes
  }

  let intel: IntelReport | null = await getIntel(meta.id)
  let intelFromCache = false
  let intelUsage = { input: 0, output: 0 }
  if (!intel) {
    const cached = await getCompanyCache(meta.companySlug)
    if (cached && meta.mode === 'fast') {
      intel = { ...cached, companySlug: meta.companySlug }
      intelFromCache = true
      await saveIntel(meta.id, intel)
    } else {
      const investigatingMeta = {
        ...meta,
        status: 'investigating' as const,
        updatedAt: new Date().toISOString()
      }
      await saveApplicationMeta(user.id, investigatingMeta)
      try {
        const result = await investigate(ctx, cv, posting, { mode: meta.mode })
        intel = result.intel
        intel.companySlug = meta.companySlug
        intelUsage = result.usage
        await saveIntel(meta.id, intel)
        await setCompanyCache(meta.companySlug, intel)
        await incrementTokenUsage(user.id, intelUsage.input + intelUsage.output)
      } catch (err) {
        const failedMeta = {
          ...meta,
          status: 'created' as const,
          updatedAt: new Date().toISOString()
        }
        await saveApplicationMeta(user.id, failedMeta)
        return NextResponse.json(
          { error: (err as Error).message || 'investigate failed', phase: 'investigate' },
          { status: 500 }
        )
      }
    }
    const investigatedMeta = {
      ...meta,
      status: 'investigated' as const,
      totalTokens: (meta.totalTokens || 0) + intelUsage.input + intelUsage.output,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, investigatedMeta)
  }

  let report = null as Awaited<ReturnType<typeof evaluate>>['report'] | null
  let evalUsage = { input: 0, output: 0 }
  if (meta.status !== 'evaluated' && !meta.userDecision) {
    const evaluatingMeta = {
      ...meta,
      status: 'evaluating' as const,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, evaluatingMeta)
    try {
      const result = await evaluate(ctx, cv, intel!, posting)
      report = result.report
      evalUsage = result.usage
      await saveEval(meta.id, report)
      await incrementTokenUsage(user.id, evalUsage.input + evalUsage.output)
      const { status } = deriveDecision(report)
      const evaluatedMeta = {
        ...meta,
        status,
        totalTokens: (meta.totalTokens || 0) + intelUsage.input + intelUsage.output + evalUsage.input + evalUsage.output,
        updatedAt: new Date().toISOString()
      }
      await saveApplicationMeta(user.id, evaluatedMeta)
    } catch (err) {
      const failedMeta = {
        ...meta,
        status: 'investigated' as const,
        updatedAt: new Date().toISOString()
      }
      await saveApplicationMeta(user.id, failedMeta)
      return NextResponse.json(
        { error: (err as Error).message || 'evaluate failed', phase: 'evaluate' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({
    intel,
    intelFromCache,
    report,
    usage: {
      input: intelUsage.input + evalUsage.input,
      output: intelUsage.output + evalUsage.output
    }
  })
}