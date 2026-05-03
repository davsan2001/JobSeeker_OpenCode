import { Job, JobSource, JobSearchParams } from './index'

const WEWORKREMOTELY_URL = 'https://weworkremotely.com/browse/RSS'

export const weworkremotelySource: JobSource = {
  name: 'weworkremotely',
  
  async fetchJobs(params: JobSearchParams): Promise<Job[]> {
    try {
      const res = await fetch(WEWORKREMOTELY_URL, {
        headers: {
          'User-Agent': 'JobSeeker/1.0'
        }
      })
      
      if (!res.ok) {
        throw new Error(`WeWorkRemotely error: ${res.status}`)
      }

      const xml = await res.text()
      
      // Simple XML parser for RSS items
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
      const limit = params.limit || 25

      const jobs: Job[] = []
      
      for (const item of items.slice(0, limit)) {
        const title = extractXmlTag(item, 'title')
        const link = extractXmlTag(item, 'link')
        const company = extractXmlTag(item, 'company')
        const location = extractXmlTag(item, 'location')
        const description = extractXmlTag(item, 'description') || extractXmlTag(item, 'content:encoded')
        const pubDate = extractXmlTag(item, 'pubDate')

        if (title && link) {
          jobs.push({
            id: `weworkremotely-${btoa(link).slice(0, 20)}`,
            source: 'weworkremotely',
            url: link,
            title: title.replace(/&amp;/g, '&'),
            company: company || 'Unknown',
            location: location || 'Remote',
            description: stripHtml(description || ''),
            remote: true,
            posted_at: pubDate
          })
        }
      }

      return jobs
    } catch (err) {
      console.error('[weworkremotely] Fetch error:', err)
      return []
    }
  }
}

function extractXmlTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return match ? (match[1] || match[2] || '').trim() : ''
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}