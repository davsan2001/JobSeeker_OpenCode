import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import {
  getActiveProviderCallable,
  getApplicationMeta,
  getCvSummary,
  getIntel,
  incrementTokenUsage,
  saveApplicationMeta,
  saveDocs
} from '@/lib/storage/supabase'
import { createCoverAndEmail, createCv, reviewCv } from '@/lib/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 180

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const meta = await getApplicationMeta(user.id, params.id)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (meta.userDecision !== 'go')
    return NextResponse.json(
      { error: 'User must confirm GO before generating documents' },
      { status: 400 }
    )
  const intel = await getIntel(params.id)
  if (!intel) return NextResponse.json({ error: 'Missing intel' }, { status: 400 })
  const active = await getActiveProviderCallable(user.id)
  if (!active)
    return NextResponse.json(
      { error: 'No active provider configured. Open Settings and pick one.' },
      { status: 400 }
    )
  const cv = await getCvSummary(user.id)
  if (!cv) return NextResponse.json({ error: 'CV summary missing' }, { status: 400 })

  const ctx = { providerId: active.id, cfg: active.cfg }

  const updatedMeta = {
    ...meta,
    status: 'creating' as const,
    updatedAt: new Date().toISOString()
  }
  await saveApplicationMeta(user.id, updatedMeta)

  try {
    const posting = {
      company: meta.company,
      role: meta.role,
      description: meta.description,
      url: meta.url,
      userNotes: meta.userNotes
    }

    const [{ cv_markdown, usage: u1 }, cover] = await Promise.all([
      createCv(ctx, cv, intel, posting),
      createCoverAndEmail(ctx, cv, intel, posting)
    ])

    const { review, usage: u3 } = await reviewCv(ctx, cv, cv_markdown, posting)

    const total =
      u1.input + u1.output + cover.usage.input + cover.usage.output + u3.input + u3.output

    const docs = {
      cv_markdown,
      cv_review: review,
      cover_letter_markdown: cover.cover_letter_markdown,
      email_subject: cover.email_subject,
      email_body: cover.email_body,
      tokens_used: total
    }
    await saveDocs(meta.id, docs)
    await incrementTokenUsage(user.id, total)

    const finalMeta = {
      ...meta,
      status: 'created_docs' as const,
      totalTokens: (meta.totalTokens || 0) + total,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, finalMeta)

    return NextResponse.json({ docs })
  } catch (err) {
    const failedMeta = {
      ...meta,
      status: 'decided_go' as const,
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, failedMeta)
    return NextResponse.json(
      { error: (err as Error).message || 'create failed' },
      { status: 500 }
    )
  }
}