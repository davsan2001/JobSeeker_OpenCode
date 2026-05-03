import Link from 'next/link'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--base)' }}>
      <header style={{ 
        padding: '16px 24px', 
        borderBottom: '0.5px solid var(--border-default)',
        display: 'flex',
        gap: '24px'
      }}>
        <Link href="/" style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          color: 'var(--text-primary)',
          textDecoration: 'none'
        }}>
          JobSeeker
        </Link>
        <nav style={{ display: 'flex', gap: '16px' }}>
          <Link href="/legal/terms" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Terms</Link>
          <Link href="/legal/privacy" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Privacy</Link>
        </nav>
      </header>
      {children}
    </div>
  )
}