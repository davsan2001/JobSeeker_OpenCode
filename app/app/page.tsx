'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Help } from '@/components/Help'

type Ready = {
  hasProvider: boolean
  providerLabel: string
  hasCvSummary: boolean
  loaded: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [ready, setReady] = useState<Ready>({
    hasProvider: false,
    providerLabel: '',
    hasCvSummary: false,
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
    (async () => {
      const [cfg, cv] = await Promise.all([
        fetch('/api/config').then((r) => r.json()),
        fetch('/api/cv').then((r) => r.json())
      ])
      const activeId = cfg?.activeProvider as string | undefined
      const activeCfg = activeId ? cfg?.providers?.[activeId] : undefined
      const needsKey = activeId && ['anthropic', 'google', 'openai', 'groq'].includes(activeId)
      const hasProvider = !!activeCfg && (!needsKey || !!activeCfg.hasKey)
      setReady({
        hasProvider,
        providerLabel: activeId || '',
        hasCvSummary: !!cv.summary,
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
      <div className="space-y-3">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-32 w-full" />
      </div>
    )
  }

  if (!ready.hasProvider || !ready.hasCvSummary) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-accent p-7 sm:p-9 space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Let&apos;s get you set up</h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-2">
              Two quick things and you&apos;re ready. Both happen once — after that, every new
              application is a few clicks.
            </p>
          </div>
          <ol className="space-y-3">
            <OnboardStep
              n={1}
              done={ready.hasProvider}
              title="Pick an AI provider"
              body={
                <>
                  This is the engine that reads job postings and writes your tailored CV.
                  You can pick one that&apos;s free (Google Gemini, Groq, or Ollama on your
                  computer), or use Claude / OpenAI if you have credit.
                </>
              }
            />
            <OnboardStep
              n={2}
              done={ready.hasCvSummary}
              title="Upload your master CV"
              body={
                <>
                  We summarise it <strong>once</strong> into a compact profile and reuse that
                  for every application — so we never resend your full resume, which saves
                  tokens (money) on every call.
                </>
              }
            />
          </ol>
          <Link href="/app/settings" className="btn btn-primary btn-lg w-full sm:w-auto">
            Open Settings →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-6 md:gap-8">
      <form onSubmit={submit} className="card-soft p-5 sm:p-7 space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            New application
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Paste the posting. We&apos;ll analyse the company and score the fit automatically —
            you only decide whether to apply.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <LabelWithHelp label="Company" help="The hiring company's name. Used as a header on your CV and to cache research so reapplying to the same company is cheaper." />
            <input
              className="input"
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. Epic Games"
            />
          </div>
          <div>
            <LabelWithHelp label="Role" help="The exact job title as it appears in the posting. Helps the AI mirror the keywords recruiters scan for." />
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
          <LabelWithHelp
            label="Posting URL"
            optional
            help="Optional. Used only as a reference — we do not scrape or open the page; we work from the description you paste below."
          />
          <input
            className="input"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://…"
          />
        </div>

        <div>
          <LabelWithHelp
            label="Job description"
            help="Copy the full posting text here (requirements, responsibilities, about the company). The more complete, the better the match analysis."
          />
          <textarea
            className="textarea min-h-[200px]"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Paste the full job description…"
          />
        </div>

        <div>
          <LabelWithHelp
            label="Anything you already know about the company?"
            optional
            help="Free-text hints — funding stage, Glassdoor score, who the hiring manager is, gossip from a friend, anything. The AI folds it into its analysis."
          />
          <textarea
            className="textarea min-h-[80px]"
            value={form.userNotes}
            onChange={(e) => setForm({ ...form, userNotes: e.target.value })}
            placeholder="e.g. 'Just closed Series B — 60 devs. Glassdoor 4.2. HM is ex-Ubisoft.'"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm select-none">
            <input
              type="checkbox"
              checked={form.mode === 'full'}
              onChange={(e) => setForm({ ...form, mode: e.target.checked ? 'full' : 'fast' })}
            />
            <span>Deep mode</span>
            <Help title="Fast vs Deep">
              <strong>Fast</strong> uses lean prompts and our company cache — cheapest, works
              great for most postings.
              <br />
              <strong>Deep</strong> spends more tokens for richer culture analysis and hiring
              manager guesses. Use it for roles you really care about.
            </Help>
          </label>
          {error && <span className="text-sm text-red-400">{error}</span>}
          <button className="btn btn-primary btn-lg w-full sm:w-auto" disabled={submitting}>
            {submitting ? <span className="spinner" /> : 'Analyse this posting →'}
          </button>
        </div>
      </form>

      <aside className="space-y-4">
        <div className="card-soft p-5">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-3">How it works</div>
          <ol className="space-y-3 text-sm">
            <HowStep n={1} title="Research" auto>
              We decode the role and compare it to your CV.
            </HowStep>
            <HowStep n={2} title="Score" auto>
              Six stakeholders (hiring manager, recruiter, peers…) rate the fit.
            </HowStep>
            <HowStep n={3} title="Decide" human>
              You choose: Go, Hold, or Skip.
            </HowStep>
            <HowStep n={4} title="Create" auto>
              Tailored CV + cover letter + email, reviewed by 7 reviewers.
            </HowStep>
          </ol>
          <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
            Steps 1 &amp; 2 happen automatically once you submit. You only step in at{' '}
            <strong>Decide</strong>.
          </p>
        </div>
        <div className="card-soft p-5 text-xs text-zinc-400 space-y-2">
          <div className="uppercase tracking-wide text-zinc-500">
            Cost control{' '}
            <Help title="What is a token?">
              Tokens are the unit AI providers bill in — roughly 4 characters or ¾ of a word.
              A typical application here costs 2–10k tokens. Most free tiers comfortably cover
              several applications per day.
            </Help>
          </div>
          <div>Fast mode → cheapest (any model works).</div>
          <div>Deep mode → recommended with a mid-tier model.</div>
          <div className="pt-1">
            Change model or budget in{' '}
            <Link className="underline" href="/app/settings">settings</Link>.
          </div>
        </div>
      </aside>
    </div>
  )
}

function LabelWithHelp({
  label,
  help,
  optional
}: {
  label: string
  help: string
  optional?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
      <span>{label}</span>
      {optional && <span className="text-zinc-600">(optional)</span>}
      <Help>{help}</Help>
    </label>
  )
}

function OnboardStep({
  n,
  title,
  body,
  done
}: {
  n: number
  title: string
  body: React.ReactNode
  done: boolean
}) {
  return (
    <li className="flex gap-3">
      <div
        className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          done ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
        }`}
      >
        {done ? '✓' : n}
      </div>
      <div className="text-sm">
        <div className="font-semibold">{title}</div>
        <div className="text-zinc-400 mt-0.5">{body}</div>
      </div>
    </li>
  )
}

function HowStep({
  n,
  title,
  children,
  auto,
  human
}: {
  n: number
  title: string
  children: React.ReactNode
  auto?: boolean
  human?: boolean
}) {
  return (
    <li className="flex gap-3 items-start">
      <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
        {n}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-200">{title}</span>
          {auto && <span className="chip chip-info text-[10px]">auto</span>}
          {human && <span className="chip chip-warn text-[10px]">you decide</span>}
        </div>
        <div className="text-zinc-400 text-xs mt-0.5">{children}</div>
      </div>
    </li>
  )
}