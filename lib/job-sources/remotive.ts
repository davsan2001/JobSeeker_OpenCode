import { Job, JobSource, JobSearchParams } from './index'

const REMOTIVE_URL = 'https://remotive.com/api/remote-jobs'

export const remotiveSource: JobSource = {
  name: 'remotive',
  
  async fetchJobs(params: JobSearchParams): Promise<Job[]> {
    const url = new URL(REMOTIVE_URL)
    if (params.query) {
      url.searchParams.set('search', params.query)
    }
    if (params.remote) {
      url.searchParams.set('remote', 'true')
    }
    url.searchParams.set('limit', String(params.limit || 25))

    try {
      const res = await fetch(url.toString())
      if (!res.ok) {
        throw new Error(`Remotive API error: ${res.status}`)
      }

      const data = await res.json() as {
        jobs?: Array<{
          id: number
          url: string
          title: string
          company_name: string
          candidate_required_location: string
          description: string
          salary_min?: string
          salary_max?: string
          remote?: boolean
          published_at: string
          job_terminology?: string
        }>
      }

      return (data.jobs || []).map(job => ({
        id: `remotive-${job.id}`,
        source: 'remotive' as const,
        url: job.url,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location,
        description: job.description,
        salary_min: job.salary_min ? parseSalary(job.salary_min) : undefined,
        salary_max: job.salary_max ? parseSalary(job.salary_max) : undefined,
        remote: job.remote,
        posted_at: job.published_at
      }))
    } catch (err) {
      console.error('[remotive] Fetch error:', err)
      return []
    }
  }
}

function parseSalary(salary: string): number | undefined {
  const nums = salary.replace(/[^0-9]/g, '')
  return nums ? parseInt(nums, 10) : undefined
}