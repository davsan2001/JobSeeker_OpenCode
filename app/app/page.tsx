'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Ready = {
  hasProvider: boolean
  providerLabel: string
  hasCvSummary: boolean
  isPro: boolean
  isElite: boolean
  loaded: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState<Ready>({
    hasProvider: false,
    providerLabel: '',
    hasCvSummary: false,
    isPro: false,
    isElite: false,
    loaded: false
  })
  const [form, setForm] = useState({
    company: '',
    role: '',
    description: '',
    url: '',
    userNotes: '',
    mode: 'fast' as 'fast' | 'full'
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const [cfg, cv, tier] = await Promise.all([
        fetch('/api/config').then((r) => r.json()),
        fetch('/api/cv').then((r) => r.json()),
        fetch('/api/tier').then((r) => r.json())
      ])
      const activeId = cfg?.activeProvider
      const activeCfg = activeId ? cfg?.providers?.[activeId] : undefined
      const needsKey = activeId && ['anthropic', 'google', 'openai', 'groq'].includes(activeId)
      // Pro/Elite users have provider included, no need for their own key
      const hasKey = !!activeCfg?.hasKey || tier.isPro || tier.isElite
      const hasProvider = !!activeCfg || tier.isPro || tier.isElite
      setReady({
        hasProvider,
        providerLabel: activeId || 'included',
        hasCvSummary: !!cv.summary,
        isPro: tier.isPro,
        isElite: tier.isElite,
        loaded: true
      })
    })()
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.push(`/app/application/${data.application.id}?autorun=1`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!ready.loaded) {
    return (
      <div>
        <div className="skeleton" style={{ width: '120px', height: '32px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ height: '200px' }} />
      </div>
    )
  }

  if (!ready.hasProvider || !ready.hasCvSummary) {
    return (
      <div style={{ maxWidth: '600px' }}>
        <div style={{ 
          background: 'var(--surface)', 
          border: '0.5px solid var(--border-default)', 
          borderRadius: '10px', 
          padding: '24px' 
        }}>
          <h1 style={{ fontSize: '22px', fontWeight: 250, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Lets get you set up
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Two quick things and you are ready. Both happen once.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: ready.hasProvider ? 'var(--match-high)' : 'var(--elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: ready.hasProvider ? 'var(--base)' : 'var(--text-muted)'
            }}>
              {ready.hasProvider ? '✓' : '1'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Pick an AI provider
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Configure your AI engine for generating CVs.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              background: ready.hasCvSummary ? 'var(--match-high)' : 'var(--elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: ready.hasCvSummary ? 'var(--base)' : 'var(--text-muted)'
            }}>
              {ready.hasCvSummary ? '✓' : '2'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Upload your master CV
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                We summarize it once and reuse for every application.
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/app/settings')}
            className="btn btn-primary"
            style={{ marginTop: '24px' }}
          >
            Open Settings →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 250, color: 'var(--text-primary)', marginBottom: '4px' }}>
          New application
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Paste the posting. We will analyze the company and score the fit automatically.
        </p>
      </div>

      {error && (
        <div style={{ 
          padding: '12px', 
          borderRadius: '8px', 
          background: 'var(--rejected-bg)', 
          border: '0.5px solid var(--rejected-border)',
          color: 'var(--rejected)',
          fontSize: '12px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Company
            </label>
            <input
              className="input"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Epic Games"
            />
          </div>
          <div>
            <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Role
            </label>
            <input
              className="input"
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Gameplay Programmer"
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
            Posting URL
          </label>
          <input
            className="input"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div>
          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
            Job description
          </label>
          <textarea
            className="textarea"
            required
            style={{ minHeight: '180px' }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Paste the full job description..."
          />
        </div>

        <div>
          <label style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
            Anything you already know about the company? (optional)
          </label>
          <textarea
            className="textarea"
            style={{ minHeight: '60px' }}
            value={form.userNotes}
            onChange={(e) => setForm({ ...form, userNotes: e.target.value })}
            placeholder="e.g. Just closed Series B — 60 devs. Glassdoor 4.2."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              checked={form.mode === 'full'}
              onChange={(e) => setForm({ ...form, mode: e.target.checked ? 'full' : 'fast' })}
              style={{ width: '16px', height: '16px' }}
            />
            Deep mode
          </label>
          <button className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? <span className="spinner" /> : 'Analyse this posting →'}
          </button>
        </div>
      </form>
    </div>
  )
}