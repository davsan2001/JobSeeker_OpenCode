export interface Job {
  id: string
  source: 'adzuna' | 'remotive' | 'remoteok' | 'weworkremotely'
  url: string
  title: string
  company: string
  location: string
  description: string
  salary_min?: number
  salary_max?: number
  salary_currency?: string
  remote?: boolean
  posted_at?: string
  tags?: string[]
}

export interface JobSearchParams {
  query?: string
  location?: string
  remote?: boolean
  limit?: number
}

export interface JobSource {
  name: string
  fetchJobs(params: JobSearchParams): Promise<Job[]>
}

import { adzunaSource } from './adzuna'
import { remoteokSource } from './remoteok'
import { remotiveSource } from './remotive'
import { weworkremotelySource } from './weworkremotely'

export const sources = {
  adzuna: adzunaSource,
  remoteok: remoteokSource,
  remotive: remotiveSource,
  weworkremotely: weworkremotelySource
}

const SOURCES: Record<string, JobSource> = {
  adzuna: adzunaSource,
  remoteok: remoteokSource,
  remotive: remotiveSource,
  weworkremotely: weworkremotelySource
}

export function registerSource(name: string, source: JobSource) {
  SOURCES[name] = source
}

export async function searchAllJobs(params: JobSearchParams): Promise<Job[]> {
  const results: Job[] = []
  
  for (const source of Object.values(SOURCES)) {
    try {
      const jobs = await source.fetchJobs(params)
      results.push(...jobs)
    } catch (err) {
      console.error(`[job-search] ${source.name} failed:`, err)
    }
  }
  
  return results
}

export async function searchJobs(
  sourceNames: string[],
  params: JobSearchParams
): Promise<Job[]> {
  const results: Job[] = []
  
  for (const name of sourceNames) {
    const source = SOURCES[name]
    if (!source) {
      console.warn(`[job-search] Unknown source: ${name}`)
      continue
    }
    try {
      const jobs = await source.fetchJobs(params)
      results.push(...jobs)
    } catch (err) {
      console.error(`[job-search] ${source.name} failed:`, err)
    }
  }
  
  return results
}