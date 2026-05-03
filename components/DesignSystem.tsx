'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavItem = {
  href: string
  label: string
}

const navItems: NavItem[] = [
  { href: '/app', label: 'DISCOVER' },
  { href: '/app/history', label: 'PIPELINE' },
  { href: '/app/history', label: 'HISTORY' },
  { href: '/app/settings', label: 'SETTINGS' },
]

export function DashboardNav() {
  const pathname = usePathname()
  
  return (
    <nav className="nav-container">
      <NavLink href="/app" current={pathname === '/app'}>DISCOVER</NavLink>
      <NavLink href="/app/history" current={pathname === '/app/history'}>PIPELINE</NavLink>
      <NavLink href="/app/history" current={pathname === '/app/history'}>HISTORY</NavLink>
      <NavLink href="/app/settings" current={pathname === '/app/settings'}>SETTINGS</NavLink>
    </nav>
  )
}

function NavLink({ href, children, current }: { href: string; children: React.ReactNode; current?: boolean }) {
  return (
    <Link href={href} className={`nav-tab ${current ? 'active' : ''}`}>
      {children}
    </Link>
  )
}

export function StatCard({ value, label, dot }: { value: string | number; label: string; dot?: 'green' | 'blue' | 'orange' }) {
  const dotColors = {
    green: 'var(--match-high)',
    blue: 'var(--interview)',
    orange: 'var(--match-medium)'
  }
  
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {dot && (
        <div 
          className="dot" 
          style={{ 
            width: '7px', 
            height: '7px', 
            borderRadius: '50%', 
            background: dotColors[dot],
            marginTop: '4px'
          }} 
        />
      )}
    </div>
  )
}

export function MatchBadge({ score }: { score: number }) {
  let variant = 'high'
  let color = 'var(--match-high)'
  let bg = 'var(--match-high-bg)'
  
  if (score < 40) {
    variant = 'low'
    color = 'var(--rejected)'
    bg = 'var(--rejected-bg)'
  } else if (score < 70) {
    variant = 'medium'
    color = 'var(--match-medium)'
    bg = 'var(--match-medium-bg)'
  }
  
  return (
    <div 
      className="pill" 
      style={{ background: bg, color }}
    >
      <div 
        className="dot" 
        style={{ 
          width: '7px', 
          height: '7px', 
          borderRadius: '50%', 
          background: color 
        }} 
      />
      <span className="text-score">{score}%</span>
    </div>
  )
}

export function SkillTag({ label, match }: { label: string; match?: boolean }) {
  return (
    <span 
      className="skill-tag"
      style={{
        background: match ? 'var(--match-high-bg)' : 'var(--elevated)',
        color: match ? 'var(--match-high)' : 'var(--text-muted)'
      }}
    >
      {label}
    </span>
  )
}

export function MatchBar({ score }: { score: number }) {
  let fillClass = 'high'
  if (score < 40) fillClass = 'low'
  else if (score < 70) fillClass = 'medium'
  
  return (
    <div className="match-bar">
      <div 
        className={`match-bar-fill ${fillClass}`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

export function TierBadge({ tier }: { tier: 'free' | 'pro' | 'elite' }) {
  const tierStyles = {
    free: 'tier-free',
    pro: 'tier-pro',
    elite: 'tier-elite'
  }
  
  return (
    <span 
      className={`pill tier-${tier}`}
      style={{ textTransform: 'capitalize', fontWeight: 600 }}
    >
      {tier}
    </span>
  )
}

export function JobCard({ 
  title, 
  company, 
  location, 
  salary, 
  score, 
  description, 
  skills = [], 
  matchSkills = [],
  source,
  daysAgo 
}: { 
  title: string
  company: string
  location?: string
  salary?: string
  score: number
  description?: string
  skills?: string[]
  matchSkills?: string[]
  source?: string
  daysAgo?: number 
}) {
  const matchSkillsLower = matchSkills.map(s => s.toLowerCase())
  
  return (
    <div className="job-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <div className="text-heading">{title}</div>
          <div className="text-body" style={{ marginTop: '2px', color: 'var(--text-muted)' }}>
            {company}{location ? ` · ${location}` : ''}{salary ? ` · ${salary}` : ''}
          </div>
        </div>
        <MatchBadge score={score} />
      </div>
      
      {description && (
        <div className="text-body" style={{ marginBottom: '8px' }}>
          {description}
        </div>
      )}
      
      {skills.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {skills.map(skill => (
            <SkillTag 
              key={skill} 
              label={skill} 
              match={matchSkillsLower.includes(skill.toLowerCase())} 
            />
          ))}
        </div>
      )}
      
      <MatchBar score={score} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
          {source}{daysAgo ? ` · hace ${daysAgo} días` : ''}
        </span>
        <span style={{ fontSize: '9px', color: score >= 70 ? 'var(--match-high)' : score >= 40 ? 'var(--match-medium)' : 'var(--text-muted)' }}>
          {score >= 70 ? 'Match alto' : score >= 40 ? 'Revisar antes' : 'Bajo match'}
        </span>
      </div>
    </div>
  )
}

export function ApplicationCard({
  title,
  company,
  dateApplied,
  status,
  note
}: {
  title: string
  company: string
  dateApplied: string
  status: 'applied' | 'interview' | 'rejected' | 'offer'
  note?: string
}) {
  const statusConfig = {
    applied: { label: 'Aplicado', color: 'var(--match-high)', bg: 'var(--match-high-bg)' },
    interview: { label: 'Entrevista', color: 'var(--interview)', bg: 'var(--interview-bg)' },
    rejected: { label: 'Rechazado', color: 'var(--rejected)', bg: 'var(--rejected-bg)' },
    offer: { label: 'Oferta', color: 'var(--match-high)', bg: 'var(--match-high-bg)' }
  }
  const config = statusConfig[status]
  
  const pipelineColors: Record<string, string> = {
    applied: 'var(--match-high)',
    interview: 'var(--interview)',
    rejected: 'var(--rejected)',
    offer: 'var(--match-high)',
    pending: 'var(--border-default)'
  }
  
  const steps = ['Aplicado', 'Respuesta', 'Entrevista', 'Oferta']
  const currentIndex = status === 'applied' ? 0 : status === 'interview' ? 2 : status === 'rejected' ? 1 : status === 'offer' ? 3 : 0
  
  return (
    <div className="job-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <div className="text-heading" style={{ fontSize: '13px' }}>{title}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
            {company} · Aplicado el {dateApplied}
          </div>
        </div>
        <div className="pill" style={{ background: config.bg, color: config.color }}>
          <div className="dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: config.color }} />
          <span>{config.label}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 0, marginBottom: '8px' }}>
        {steps.map((step, i) => (
          <div key={step} className="pipeline-segment">
            <div 
              className="pipeline-bar" 
              style={{ 
                background: i <= currentIndex ? pipelineColors[status] : pipelineColors.pending,
                borderRadius: i === 0 ? '2px 0 0 2px' : i === 3 ? '0 2px 2px 0' : '0'
              }} 
            />
            <div 
              className="pipeline-label"
              style={{ color: i <= currentIndex ? pipelineColors[status] : 'var(--border-hover)' }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
      
      {note && (
        <div className="text-body">{note}</div>
      )}
    </div>
  )
}

export function WarnPanel({ items }: { items: { text: string; critical?: boolean }[] }) {
  return (
    <div className="panel-warn">
      <div className="text-label" style={{ color: 'var(--warn)', marginBottom: '6px' }}>
        Acción requerida
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
          <div 
            className="dot" 
            style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: item.critical ? 'var(--rejected)' : 'var(--match-medium)',
              marginTop: '3px',
              flexShrink: 0
            }} 
          />
          <div 
            className="text-body"
            style={{ color: item.critical ? 'var(--rejected)' : 'var(--text-secondary)' }}
          >
            {item.text}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ElitePanel({ description }: { description: string }) {
  return (
    <div className="panel-elite">
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
        <div 
          className="dot" 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: 'var(--elite-dot)' 
          }} 
        />
        <span className="text-label" style={{ color: 'var(--elite)' }}>
          Elite — Auto-apply
        </span>
      </div>
      <div className="text-body" style={{ color: 'var(--elite)' }}>
        {description}
      </div>
    </div>
  )
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-label" style={{ paddingBottom: '8px', borderBottom: '0.5px solid var(--border-default)', marginBottom: '12px' }}>
      {children}
    </div>
  )
}