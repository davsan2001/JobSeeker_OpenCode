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

export default function HistoryPage() {
  const [apps, setApps] = useState<ApplicationMeta[] | null>(null)
  useEffect(() => {
    fetch('/api/applications')
      .then((r) => r.json())
      .then((d) => setApps(d.applications))
  }, [])

  return (
    <div className="space-y-5">
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