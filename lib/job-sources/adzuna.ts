import { Job, JobSource, JobSearchParams } from './index'

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY

const BASE_URL = 'https://api.adzuna.com/v1/api/jobs'

export const adzunaSource: JobSource = {
  name: 'adzuna',
  
  async fetchJobs(params: JobSearchParams): Promise<Job[]> {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      console.warn('[adzuna] No API key configured')
      return []
    }

    const country = 'us'
    const searchQuery = params.query || 'software engineer'
    const location = params.location || 'remote'
    const limit = params.limit || 25

    const url = new URL(`${BASE_URL}/${country}/search/${limit}`)
    url.searchParams.set('app_id', ADZUNA_APP_ID)
    url.searchParams.set('app_key', ADZUNA_APP_KEY)
    url.searchParams.set('what', searchQuery)
    url.searchParams.set('where', location)
    url.searchParams.set('distance', '50')

    try {
      const res = await fetch(url.toString())
      if (!res.ok) {
        throw new Error(`Adzuna API error: ${res.status}`)
      }

      const data = await res.json() as {
        results?: Array<{
          id: string
          title: string
          company: { display_name: string }
          location: { display_name: string }
          description: string
          salary_min?: number
          salary_max?: number
          salary_currency?: string
          redirect_url: string
          created: string
        }>
      }

      return (data.results || []).map(job => ({
        id: `adzuna-${job.id}`,
        source: 'adzuna' as const,
        url: job.redirect_url,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        description: job.description,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary_currency: job.salary_currency,
        remote: job.location.display_name.toLowerCase().includes('remote'),
        posted_at: job.created
      }))
    } catch (err) {
      console.error('[adzuna] Fetch error:', err)
      return []
    }
  }
}