import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import {
  getConfig,
  getCvSummary,
  listApplications,
  newApplicationId,
  saveApplicationMeta,
  slugifyCompany
} from '@/lib/storage/supabase'
import type { ApplicationMeta } from '@/lib/types'

export const runtime = 'nodejs'

export async function GET() {
  const user = await requireUser()
  const apps = await listApplications(user.id)
  return NextResponse.json({ applications: apps })
}

export async function POST(req: Request) {
  try {
    const user = await requireUser()
    const body = (await req.json()) as {
      company: string
      role: string
      description: string
      url?: string
      userNotes?: string
      mode?: 'fast' | 'full'
    }
    if (!body.company || !body.role || !body.description) {
      return NextResponse.json(
        { error: 'company, role and description are required' },
        { status: 400 }
      )
    }
    const cv = await getCvSummary(user.id)
    if (!cv) {
      return NextResponse.json(
        { error: 'Upload and summarize your CV first (Settings).' },
        { status: 400 }
      )
    }
    const cfg = await getConfig(user.id)
    const id = newApplicationId()
    const meta: ApplicationMeta = {
      id,
      company: body.company.trim(),
      role: body.role.trim(),
      companySlug: slugifyCompany(body.company),
      description: body.description,
      url: body.url,
      userNotes: body.userNotes,
      mode: body.mode || cfg?.mode || 'fast',
      status: 'created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await saveApplicationMeta(user.id, meta)
    return NextResponse.json({ application: meta })
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || 'failed to create application' },
      { status: 500 }
    )
  }
}