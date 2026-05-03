import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { searchJobs } from '@/lib/job-sources'
import { matchJobsToCV } from '@/lib/job-sources/matching'
import { sendDailySummary } from '@/lib/resend'
import { sendApplicationConfirmation } from '@/lib/resend'
import { canAccessEliteFeature } from '@/lib/lemon-squeezy'

export const runtime = 'nodejs'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdminClient()

  const { data: eliteUsers, error: usersError } = await supabase
    .from('profiles')
    .select('id, email')
    .in('tier', ['elite', 'pro'])
    .eq('subscription_status', 'active') as { data: { id: string; email: string }[] | null; error: Error | null }

  if (usersError || !eliteUsers) {
    console.error('[cron] Failed to get elite users:', usersError)
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 })
  }

  const results = []

  for (const user of eliteUsers) {
    try {
      const result = await processDailyRun(user.id, user.email)
      results.push({ userId: user.id, ...result })
    } catch (err) {
      console.error(`[cron] Failed for user ${user.id}:`, err)
      results.push({ userId: user.id, error: String(err) })
    }
  }

  return NextResponse.json({
    processed: results.length,
    results
  })
}

async function processDailyRun(userId: string, userEmail: string) {
  const supabase = createSupabaseAdminClient()

  const { data: preferences } = await supabase
    .from('preferences')
    .select('*')
    .eq('user_id', userId)
    .single() as { data: { desired_roles: string[]; locations: string[] } | null }

  if (!preferences) {
    return { error: 'No preferences' }
  }

  const query = preferences.desired_roles?.[0] || 'software engineer'
  const location = preferences.locations?.[0] || 'Remote'

  const jobs = await searchJobs(['remoteok', 'remotive'], {
    query,
    location,
    remote: true,
    limit: 20
  })

  if (jobs.length === 0) {
    return { discovered: 0, applied: 0 }
  }

  const scored = await matchJobsToCV(jobs, userId)
  const topJobs = scored.filter(j => j.score >= 40).slice(0, 10)

  const saved = []
  for (const job of topJobs) {
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', userId)
      .eq('user_provided_url', job.job.url)
      .single()

    if (!existing) {
      const { data: app } = await supabase
        .from('applications')
        .insert({
          user_id: userId,
          user_provided_url: job.job.url,
          user_provided_title: job.job.title,
          user_provided_company: job.job.company,
          user_provided_location: job.job.location,
          user_provided_description: job.job.description,
          match_score: job.score,
          status: 'discovered'
        } as never)
        .select()
        .single()

      if (app) saved.push(app)
    }
  }

  const { data: stats } = await supabase
    .from('applications')
    .select('status')
    .eq('user_id', userId) as { data: { status: string }[] | null }

  const applications = stats?.filter(s => s.status === 'applied').length || 0
  const responses = stats?.filter(s => s.status === 'response').length || 0
  const interviews = stats?.filter(s => s.status === 'interview').length || 0

  if (userEmail) {
    await sendDailySummary(userEmail, {
      userEmail,
      date: new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      stats: {
        discovered: saved.length,
        applied: applications,
        responses,
        interviews
      },
      topJobs: topJobs.slice(0, 5).map(m => ({
        title: m.job.title,
        company: m.job.company,
        matchScore: m.score,
        url: m.job.url
      }))
    })
  }

  return {
    discovered: saved.length,
    applied: applications,
    responses,
    interviews,
    summarySent: !!userEmail
  }
}