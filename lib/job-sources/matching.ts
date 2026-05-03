import { Job } from '../job-sources'
import { createSupabaseServerClient } from '../supabase/server'

export interface JobMatch {
  job: Job
  score: number
  matchReasons: string[]
}

export async function matchJobToCV(job: Job, userId: string): Promise<JobMatch> {
  const supabase = createSupabaseServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('cv_text, desired_roles, skills')
    .eq('id', userId)
    .single() as { data: { cv_text: string; desired_roles: string[]; skills: string[] } | null }

  if (!profile) {
    return { job, score: 0, matchReasons: [] }
  }

  const reasons: string[] = []
  let score = 0
  let checks = 0

  const jobText = `${job.title} ${job.description} ${job.location}`.toLowerCase()
  const skills = (profile.skills || []).map(s => s.toLowerCase())
  const roles = (profile.desired_roles || []).map(r => r.toLowerCase())

  for (const skill of skills) {
    if (skill.length < 3) continue
    checks++
    if (jobText.includes(skill)) {
      score += 25
      reasons.push(`Has skill: ${skill}`)
    }
  }

  for (const role of roles) {
    if (role.length < 3) continue
    checks++
    if (jobText.includes(role)) {
      score += 25
      reasons.push(`Role match: ${role}`)
    }
  }

  if (job.remote && profile.desired_roles?.length > 0) {
    score += 15
    reasons.push('Remote')
  }

  if (job.salary_min && job.salary_min > 50000) {
    score += 10
    reasons.push('Competitive salary')
  }

  const normalizedScore = checks > 0 ? Math.min(score, 100) : 50
  
  return {
    job,
    score: normalizedScore,
    matchReasons: reasons.slice(0, 5)
  }
}

export async function matchJobsToCV(
  jobs: Job[],
  userId: string
): Promise<JobMatch[]> {
  const matches = await Promise.all(
    jobs.map(job => matchJobToCV(job, userId))
  )

  return matches
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
}

export function getMatchLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Low'
}

export function getMatchColor(score: number): string {
  if (score >= 80) return 'var(--match-high)'
  if (score >= 60) return 'var(--match-med)'
  return 'var(--match-low)'
}