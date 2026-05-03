import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getCareerPreferences, saveCareerPreferences } from '@/lib/storage/supabase'

export const runtime = 'nodejs'

export async function GET() {
  const user = await requireUser()
  const prefs = await getCareerPreferences(user.id)
  return NextResponse.json(prefs)
}

export async function PUT(req: Request) {
  const user = await requireUser()
  const body = (await req.json()) as Partial<{
    desiredRoles: string[]
    locations: string[]
    remoteOk: boolean
    seniority: string | null
    employmentTypes: string[]
    minSalary: number | null
    salaryCurrency: string | null
    industriesToAvoid: string[]
    languages: string[]
    minMatchScore: number
    dailyApplyLimit: number | null
    dailyAutoSend: boolean
  }>
  
  const saved = await saveCareerPreferences(user.id, body)
  return NextResponse.json(saved)
}