'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Job = {
  id: string
  source: string
  url: string
  title: string
  company: string
  location: string
  description: string
  salary_min?: number
  salary_max?: number
  remote?: boolean
  match_score?: number
  match_reasons?: string[]
}

const SOURCE_LABELS: Record<string, string> = {
  adzuna: 'Adzuna',
  remotive: 'Remotive',
  remoteok: 'RemoteOK',
  weworkremotely: 'WeWorkRemotely'
}

export default function DiscoverPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    q: '',
    location: '',
    remote: true,
    source: 'all',
    minScore: 0
  })

  const search = async (reset = false) => {
    setSearching(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (form.q) params.set('q', form.q)
      if (form.location) params.set('location', form.location)
      if (form.remote) params.set('remote', 'true')
      if (form.source !== 'all') params.set('source', form.source)
      if (form.minScore > 0) params.set('minScore', String(form.minScore))
      if (reset) params.set('limit', '50')

      const res = await fetch(`/api/discover?${params}`)
      const data = await res.json()

      if (data.jobs) {
        setJobs(data.jobs)
      } else {
        setError(data.error || 'Search failed')
      }
    } catch {
      setError('Search failed')
    } finally {
      setSearching(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    search()
  }, [])

  const handleSave = async (job: Job) => {
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_provided_url: job.url,
          user_provided_title: job.title,
          user_provided_company: job.company,
          user_provided_location: job.location,
          user_provided_description: job.description
        })
      })
      const data = await res.json()
      if (data.id) {
        router.push(`/app/history`)
      }
    } catch {
      alert('Failed to save')
    }
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null
    const fmt = (n: number) => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`
    if (min && max) return `${fmt(min)}-${fmt(max)}`
    if (min) return `${fmt(min)}+`
    return fmt(max || 0)
  }

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="skeleton" style={{ width: '200px', height: '40px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gap: '12px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton" style={{ height: '120px' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 250, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Discover
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          AI-matched jobs from across the web
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search (e.g. React, Python)"
          value={form.q}
          onChange={e => setForm(f => ({ ...f, q: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && search(true)}
          style={{
            flex: '1 1 200px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '0.5px solid var(--border-default)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
          onKeyDown={e => e.key === 'Enter' && search(true)}
          style={{
            width: '140px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '0.5px solid var(--border-default)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
        />
        <select
          value={form.source}
          onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
          style={{
            padding: '10px 14px',
            borderRadius: '6px',
            border: '0.5px solid var(--border-default)',
            background: 'var(--surface)',
            color: 'var(--text-primary)',
            fontSize: '13px'
          }}
        >
          <option value="all">All Sources</option>
          <option value="remoteok">RemoteOK</option>
          <option value="remotive">Remotive</option>
          <option value="adzuna">Adzuna</option>
          <option value="weworkremotely">WeWorkRemotely</option>
        </select>
        <button
          onClick={() => search(true)}
          disabled={searching}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '0.5px solid var(--match-high)',
            background: 'var(--match-high)',
            color: 'var(--base)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: searching ? 'not-allowed' : 'pointer'
          }}
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && (
        <div style={{ 
          padding: '12px', 
          borderRadius: '6px', 
          background: 'var(--error-bg)',
          color: 'var(--error)',
          marginBottom: '16px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {jobs.length === 0 && !loading && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px'
          }}>
            No jobs found. Try a different search.
          </div>
        )}
        
        {jobs.map(job => (
          <div 
            key={job.id}
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '0.5px solid var(--border-default)',
              background: 'var(--surface)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <h3 style={{ 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  color: 'var(--text-primary)',
                  marginBottom: '4px'
                }}>
                  {job.title}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {job.company} · {job.location}
                </div>
              </div>
              {job.match_score !== undefined && (
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: job.match_score >= 80 ? 'var(--match-high)' : job.match_score >= 60 ? 'var(--match-med)' : 'var(--match-low)',
                  color: 'var(--base)'
                }}>
                  {job.match_score}% match
                </div>
              )}
            </div>

            {job.match_reasons && job.match_reasons.length > 0 && (
              <div style={{ 
                fontSize: '11px', 
                color: 'var(--text-muted)', 
                marginBottom: '8px' 
              }}>
                {job.match_reasons.join(' · ')}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-muted)' 
            }}>
              <span style={{ 
                padding: '2px 6px',
                borderRadius: '3px',
                background: 'var(--elevated)',
                color: 'var(--text-secondary)'
              }}>
                {SOURCE_LABELS[job.source] || job.source}
              </span>
              {job.remote && (
                <span style={{ color: 'var(--match-high)' }}>Remote</span>
              )}
              {formatSalary(job.salary_min, job.salary_max) && (
                <span>{formatSalary(job.salary_min, job.salary_max)}</span>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '12px' 
            }}>
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '0.5px solid var(--border-default)',
                  background: 'var(--elevated)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  textDecoration: 'none'
                }}
              >
                View
              </a>
              <button
                onClick={() => handleSave(job)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: '0.5px solid transparent',
                  background: 'var(--match-high)',
                  color: 'var(--base)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Save to Pipeline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}