import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { findRecruiterEmail, RecruiterEmail } from '@/lib/auto-apply/email-discovery'
import { canAccessEliteFeature, canAccessProFeature } from '@/lib/lemon-squeezy'

export const runtime = 'nodejs'

const APPLY_LIMIT_PRO = 10
const APPLY_LIMIT_ELITE = 5
const APPLY_LIMIT_FREE = 5

export async function POST(req: Request) {
  const user = await requireUser()
  
  const isElite = await canAccessEliteFeature(user.id)
  const isPro = await canAccessProFeature(user.id)
  
  const limit = isElite ? APPLY_LIMIT_ELITE : isPro ? APPLY_LIMIT_PRO : 0
  
  if (limit === 0) {
    return NextResponse.json(
      { error: 'Upgrade to Pro for auto-apply' },
      { status: 403 }
    )
  }

  const supabase = createSupabaseServerClient()

  const { data: pendingApps } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'discovered')
    .order('created_at', { ascending: true })
    .limit(limit) as { data: { id: string; user_provided_url: string }[] | null }

  if (!pendingApps || pendingApps.length === 0) {
    return NextResponse.json(
      { message: 'No pending applications to process' },
      { status: 200 }
    )
  }

  const results: Array<{ id: string; success?: boolean; error?: string }> = []

  for (const app of pendingApps) {
    try {
      const recruiterInfo = await discoverAndSend(app, user.id)
      results.push({ id: app.id, ...recruiterInfo })
    } catch (err) {
      console.error(`[auto-apply] Failed for ${app.id}:`, err)
      results.push({ id: app.id, error: String(err) })
    }

    await new Promise(r => setTimeout(r, 1000))
  }

  const successCount = results.filter(r => 'success' in r && r.success).length

  return NextResponse.json({
    processed: results.length,
    successful: successCount,
    failed: results.length - successCount,
    results
  })
}

interface Application {
  id: string
  user_provided_url: string
}

async function discoverAndSend(app: Application, userId: string) {
  const supabase = createSupabaseServerClient()
  const jobUrl = app.user_provided_url

  const recruiter = await findRecruiterEmail(jobUrl)
  
  if (!recruiter) {
    await supabase
      .from('applications')
      .update({ status: 'no_recruiter', updated_at: new Date().toISOString() } as never)
      .eq('id', app.id)

    return { success: false, reason: 'no_recruiter' }
  }

  await supabase
    .from('applications')
    .update({ 
      recruiter_email: recruiter.email,
      status: 'recruiter_found',
      updated_at: new Date().toISOString()
    } as never)
    .eq('id', app.id)

  return { success: true, recruiter: recruiter.email, confidence: recruiter.confidence }
}

async function getUserCV(userId: string): Promise<{ summary: string; text: string } | null> {
  const supabase = createSupabaseServerClient()
  
  const { data } = await supabase
    .from('cvs')
    .select('cv_summary, cv_text')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data || null
}