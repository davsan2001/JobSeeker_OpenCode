import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { extractTextFromBuffer } from '@/lib/cv-parser'
import {
  getActiveProviderCallable,
  getCvRaw,
  getCvSummary,
  incrementTokenUsage,
  saveCvRaw,
  saveCvSummary
} from '@/lib/storage/supabase'
import { summarizeCv } from '@/lib/pipeline'

export const runtime = 'nodejs'
export const maxDuration = 120

function errorResponse(err: unknown, status = 500) {
  const message = err instanceof Error ? err.message : String(err)
  console.error('[api/cv] error:', err)
  return NextResponse.json({ error: message || 'Internal error' }, { status })
}

export async function GET() {
  try {
    const user = await requireUser()
    const raw = await getCvRaw(user.id)
    const summary = await getCvSummary(user.id)
    return NextResponse.json({
      hasRaw: !!raw,
      rawPreview: raw ? raw.slice(0, 400) : null,
      summary
    })
  } catch {
    return NextResponse.json({
      hasRaw: false,
      rawPreview: null,
      summary: null
    })
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    const contentType = req.headers.get('content-type') || ''
    let rawText = ''

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
      const buf = Buffer.from(await file.arrayBuffer())
      rawText = await extractTextFromBuffer(buf, file.type, file.name)
    } else {
      const body = (await req.json()) as { text?: string }
      if (!body.text || body.text.trim().length < 100) {
        return NextResponse.json(
          { error: 'Resume text too short. Paste at least 100 characters.' },
          { status: 400 }
        )
      }
      rawText = body.text
    }

    if (!rawText || rawText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Extracted resume text is too short. Paste it as plain text instead.' },
        { status: 400 }
      )
    }

    await saveCvRaw(user.id, rawText)
    return NextResponse.json({ ok: true, chars: rawText.length })
  } catch (err) {
    return errorResponse(err, 400)
  }
}

export async function PUT() {
  try {
    const user = await requireUser()
    const raw = await getCvRaw(user.id)
    if (!raw) return NextResponse.json({ error: 'No CV uploaded. Please upload your CV first.' }, { status: 400 })

    // Save the raw CV as the summary (no modification)
    // The full CV text is what gets used to generate tailored CVs in Fase 4
    const summary = {
      name: 'User CV',
      headline: 'resume',
      compact_resume_context: raw,
      skills: [],
      experience: [],
      projects: [],
      education: [],
      achievements: [],
      differentiators: [],
      gaps: [],
      target_roles: [],
      salary_range: {}
    }
    
    await saveCvSummary(user.id, summary)
    return NextResponse.json({ summary, usage: { input: 0, output: 0 } })
  } catch (err) {
    console.error('[api/cv] PUT error:', err)
    return errorResponse(err)
  }
}