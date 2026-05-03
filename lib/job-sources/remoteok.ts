import { Job, JobSource, JobSearchParams } from './index'

const REMOTEOK_URL = 'https://remoteok.com/api'

export const remoteokSource: JobSource = {
  name: 'remoteok',
  
  async fetchJobs(params: JobSearchParams): Promise<Job[]> {
    const limit = params.limit || 25

    try {
      const res = await fetch(`${REMOTEOK_URL}?${new URLSearchParams({
        tag: params.query?.replace(/ /g, '-').toLowerCase() || 'software',
        location: params.remote ? 'remote' : ''
      })}`)
      
      if (!res.ok) {
        throw new Error(`RemoteOK API error: ${res.status}`)
      }

      const data = await res.json() as Array<{
        id: number
        position: string
        company: string
        location: string
        url: string
        description?: string
        salary_min?: number
        salary_max?: number
        tags?: string[]
        date: string
      }>

      // First element is a legal/redirect object, skip it
      const jobs = (data.slice(1) as typeof data[0][]).slice(0, limit).map(job => ({
        id: `remoteok-${job.id}`,
        source: 'remoteok' as const,
        url: `https://remoteok.com/jobs/${job.id}`,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        description: job.description || '',
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        remote: true,
        posted_at: job.date,
        tags: job.tags
      }))

      return jobs
    } catch (err) {
      console.error('[remoteok] Fetch error:', err)
      return []
    }
  }
}