'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/app', label: 'DISCOVER', icon: '◇' },
  { href: '/app/history', label: 'PIPELINE', icon: '▶' },
  { href: '/app/preferences', label: 'PREFERENCES', icon: '⚙' },
  { href: '/app/pricing', label: 'PRICING', icon: '★' },
  { href: '/app/settings', label: 'SETTINGS', icon: '◎' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<{ email: string; tier: string } | null>(null)

  useEffect(() => {
    fetch('/api/tier')
      .then(r => r.json())
      .then(data => {
        setProfile({ 
          email: data.email || '', 
          tier: data.tier || 'free'
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--base)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '240px', 
        background: 'var(--surface)', 
        borderRight: '0.5px solid var(--border-default)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo / User */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
            JobSeeker
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {profile?.email || 'Loading...'}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: pathname === item.href ? 'var(--text-primary)' : 'var(--text-muted)',
                background: pathname === item.href ? 'var(--elevated)' : 'transparent',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ opacity: 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Tier Badge */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '0.5px solid var(--border-default)' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            padding: '4px 10px',
            borderRadius: '20px',
            background: profile?.tier === 'elite' ? 'var(--elite)' : profile?.tier === 'pro' ? 'var(--interview)' : 'var(--elevated)',
            border: `0.5px solid ${profile?.tier === 'elite' ? 'var(--elite-border)' : profile?.tier === 'pro' ? 'var(--interview-border)' : 'var(--border-hover)'}`,
            fontSize: '10px',
            fontWeight: 600,
            color: profile?.tier === 'elite' || profile?.tier === 'pro' ? 'var(--text-primary)' : 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {profile?.tier === 'elite' ? '★ Elite' : profile?.tier === 'pro' ? 'Pro' : 'Free'}
          </div>
          {profile?.tier === 'elite' && (
            <div style={{ marginTop: '8px', fontSize: '9px', color: 'var(--elite)' }}>
              Auto-apply: 5/day
            </div>
          )}
          {profile?.tier === 'pro' && (
            <div style={{ marginTop: '8px', fontSize: '9px', color: 'var(--interview)' }}>
              Unlimited apps
            </div>
          )}
          {profile?.tier === 'free' && (
            <div style={{ marginTop: '8px', fontSize: '9px', color: 'var(--text-muted)' }}>
              5 apps/month
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}