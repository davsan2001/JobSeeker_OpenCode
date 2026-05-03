import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { searchJobs, sources, Job } from '@/lib/job-sources'
import { matchJobsToCV, JobMatch } from '@/lib/job-sources/matching'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const user = await requireUser()
  
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''
  const remote = searchParams.get('remote') === 'true'
  const limit = parseInt(searchParams.get('limit') || '25', 10)
  const minScore = parseInt(searchParams.get('minScore') || '0', 10)
  const source = searchParams.get('source') || 'all'

  const sourceList = source === 'all' 
    ? Object.keys(sources)
    : source.split(',').filter(Boolean)

  try {
    const jobs = await searchJobs(sourceList, { query, location, remote, limit })
    
    if (jobs.length === 0) {
      return NextResponse.json({
        jobs: [],
        total: 0,
        message: 'No jobs found'
      })
    }

    const matches = await matchJobsToCV(jobs, user.id)
    
    const filtered = minScore > 0 
      ? matches.filter(m => m.score >= minScore)
      : matches

    return NextResponse.json({
      jobs: filtered.map(m => ({
        ...m.job,
        match_score: m.score,
        match_reasons: m.matchReasons
      })),
      total: filtered.length,
      sources: sourceList
    })
  } catch (err) {
    console.error('[discover] Error:', err)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}