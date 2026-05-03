import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getApplicationMeta, getDocs, getEval, getIntel } from '@/lib/storage/supabase'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await requireUser()
  const meta = await getApplicationMeta(user.id, params.id)
  if (!meta) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const [intel, evalReport, docs] = await Promise.all([
    getIntel(params.id),
    getEval(params.id),
    getDocs(params.id)
  ])
  return NextResponse.json({ meta, intel, eval: evalReport, docs })
}