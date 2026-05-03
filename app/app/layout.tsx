'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { href: '/app', label: 'DISCOVER', icon: '◇' },
  { href: '/app/history', label: 'PIPELINE', icon: '▶' },
  { href: '/app/preferences', label: 'PREFERENCES', icon: '⚙' },
  { href: '/app/settings', label: 'SETTINGS', icon: '◎' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<{ email: string; tier: string } | null>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(setProfile)
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
            background: 'var(--elevated)',
            border: '0.5px solid var(--border-hover)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            textTransform: 'capitalize'
          }}>
            {profile?.tier || 'Free'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}