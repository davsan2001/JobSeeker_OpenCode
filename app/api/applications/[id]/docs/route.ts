import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getApplicationMeta, getDocs, saveDocs } from '@/lib/storage/supabase'

export const runtime = 'nodejs'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const meta = await getApplicationMeta(user.id, params.id)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const docs = await getDocs(params.id)
  if (!docs) return NextResponse.json({ error: 'No docs yet' }, { status: 400 })
  const body = (await req.json()) as {
    cv_markdown?: string
    cover_letter_markdown?: string
    email_subject?: string
    email_body?: string
  }
  const next = {
    ...docs,
    cv_markdown: body.cv_markdown ?? docs.cv_markdown,
    cover_letter_markdown: body.cover_letter_markdown ?? docs.cover_letter_markdown,
    email_subject: body.email_subject ?? docs.email_subject,
    email_body: body.email_body ?? docs.email_body
  }
  await saveDocs(params.id, next)
  return NextResponse.json({ docs: next })
}