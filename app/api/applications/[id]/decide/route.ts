import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getApplicationMeta, saveApplicationMeta } from '@/lib/storage/supabase'

export const runtime = 'nodejs'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const meta = await getApplicationMeta(user.id, params.id)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { decision } = (await req.json()) as { decision: 'go' | 'nogo' | 'hold' }
  if (!['go', 'nogo', 'hold'].includes(decision))
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 })

  const updatedMeta = {
    ...meta,
    userDecision: decision,
    status: decision === 'go' ? 'decided_go' : decision === 'nogo' ? 'decided_nogo' : meta.status,
    updatedAt: new Date().toISOString()
  }
  await saveApplicationMeta(user.id, updatedMeta)
  return NextResponse.json({ meta: updatedMeta })
}