'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ApplicationMeta } from '@/lib/types'

const LABELS: Record<ApplicationMeta['status'], { label: string; chip: string }> = {
  created: { label: 'Not started', chip: 'chip' },
  investigating: { label: 'Analysing…', chip: 'chip chip-warn' },
  investigated: { label: 'Scoring…', chip: 'chip chip-warn' },
  evaluating: { label: 'Scoring…', chip: 'chip chip-warn' },
  evaluated: { label: 'Awaiting your decision', chip: 'chip chip-warn' },
  decided_go: { label: 'Go', chip: 'chip chip-ok' },
  decided_nogo: { label: 'Skipped', chip: 'chip chip-bad' },
  creating: { label: 'Generating docs…', chip: 'chip chip-warn' },
  created_docs: { label: 'Docs ready', chip: 'chip chip-ok' },
  sent: { label: 'Sent', chip: 'chip chip-ok' }
}

type TierInfo = { tier: string; isElite: boolean; isPro: boolean }

export default function HistoryPage() {
  const [apps, setApps] = useState<ApplicationMeta[] | null>(null)
  const [tier, setTier] = useState<TierInfo | null>(null)
  const [autoApplyLoading, setAutoApplyLoading] = useState(false)
  const [autoApplyResult, setAutoApplyResult] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/applications').then(r => r.json()),
      fetch('/api/tier').then(r => r.json())
    ]).then(([appsData, tierData]) => {
      setApps(appsData.applications)
      setTier(tierData)
    })
  }, [])

  async function runAutoApply() {
    setAutoApplyLoading(true)
    setAutoApplyResult(null)
    try {
      const res = await fetch('/api/auto-apply', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setAutoApplyResult(data.error)
      } else {
        setAutoApplyResult(`Processed ${data.processed} apps, ${data.successful} successful`)
        window.location.reload()
      }
    } catch {
      setAutoApplyResult('Failed to run auto-apply')
    } finally {
      setAutoApplyLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {(tier?.isElite || tier?.isPro) && (
        <div className="card-soft p-4 border border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-purple-400">Auto-Apply</h2>
              <p className="text-xs text-zinc-400 mt-1">
                {tier.isElite ? 'Run automated applications (5/day)' : 'Run automated applications (10/day)'}
              </p>
            </div>
            <button
              onClick={runAutoApply}
              disabled={autoApplyLoading}
              className="btn btn-primary bg-purple-600 hover:bg-purple-500"
            >
              {autoApplyLoading ? 'Running...' : 'Run Now'}
            </button>
          </div>
          {autoApplyResult && (
            <p className="text-xs text-purple-400 mt-2">{autoApplyResult}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <Link href="/app" className="btn btn-primary">New application</Link>
      </div>

      {apps === null && (
        <div className="space-y-2">
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
          <div className="skeleton h-14 w-full" />
        </div>
      )}

      {apps && apps.length === 0 && (
        <div className="card-soft p-8 text-center">
          <div className="text-lg font-semibold mb-1">No applications yet</div>
          <p className="text-sm text-zinc-400 mb-4">
            Start one from the home page — paste a job posting and we&apos;ll take it from there.
          </p>
          <Link href="/app" className="btn btn-primary">Start your first application</Link>
        </div>
      )}

      {apps && apps.length > 0 && (
        <div className="card-soft divide-y divide-[#27272a] overflow-hidden">
          {apps.map((a) => (
            <Link
              key={a.id}
              href={`/app/application/${a.id}`}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 hover:bg-[#18181b] transition"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{a.company}</div>
                <div className="text-xs text-zinc-500 truncate">{a.role}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="hidden sm:inline">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
                <span className="whitespace-nowrap">
                  {(a.totalTokens || 0).toLocaleString()} tok
                </span>
                <span className={LABELS[a.status].chip + ' whitespace-nowrap'}>
                  {LABELS[a.status].label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}