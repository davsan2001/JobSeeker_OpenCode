'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type TierInfo = {
  tier: string
  isPro: boolean
  isElite: boolean
  hasActiveSubscription: boolean
}

const PRICING = [
  {
    tier: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with manual applications',
    features: [
      'Up to 10 applications/month',
      'AI-powered analysis',
      'CV tailoring',
      'Cover letter generation',
      'Bring your own API key'
    ],
    cta: 'Current Plan',
    ctaDisabled: true
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '$10',
    period: '/month',
    description: 'Unlock discovery and unlimited applications',
    features: [
      'Unlimited applications',
      'Job discovery (AI-matched)',
      'Priority support',
      'All Free features',
      'Use our AI keys'
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '#',
    popular: true
  },
  {
    tier: 'elite',
    name: 'Elite',
    price: '$20',
    period: '/month',
    description: 'Full automation for serious job seekers',
    features: [
      'Everything in Pro',
      'Auto-apply (10/day)',
      'Daily summary email',
      'Priority processing',
      'Early access to features'
    ],
    cta: 'Upgrade to Elite',
    ctaLink: '#',
    elite: true
  }
]

export default function PricingPage() {
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/tier')
      .then(r => r.json())
      .then(setTierInfo)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCheckout = async (tier: 'pro' | 'elite') => {
    setCheckingOut(tier)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed')
      }
    } catch {
      alert('Checkout failed')
    } finally {
      setCheckingOut(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <div className="skeleton" style={{ width: '200px', height: '40px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: '300px' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 250, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Pricing
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Choose the plan that fits your job search needs
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {PRICING.map(plan => {
          const isCurrentPlan = tierInfo?.tier === plan.tier
          const isUpgrade = (plan.tier === 'pro' && !tierInfo?.isPro) || (plan.tier === 'elite' && !tierInfo?.isElite)
          
          return (
            <div 
              key={plan.tier}
              style={{
                background: plan.popular ? 'var(--interview-bg)' : plan.elite ? 'var(--elite-bg)' : 'var(--surface)',
                border: `0.5px solid ${plan.popular ? 'var(--interview-border)' : plan.elite ? 'var(--elite-border)' : 'var(--border-default)'}`,
                borderRadius: '10px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {plan.popular && (
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: 'var(--interview)',
                  marginBottom: '8px'
                }}>
                  Most Popular
                </div>
              )}
              
              {plan.elite && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  fontSize: '10px', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em',
                  color: 'var(--elite)',
                  marginBottom: '8px'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--elite-dot)' }} />
                  Automation
                </div>
              )}

              <h3 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {plan.name}
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '32px', fontWeight: 200, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                  {plan.price}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                  {plan.period}
                </span>
              </div>
              
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {plan.description}
              </p>

              <ul style={{ flex: 1, listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px', 
                    marginBottom: '8px',
                    fontSize: '11px',
                    color: 'var(--text-secondary)'
                  }}>
                    <span style={{ color: 'var(--match-high)', marginTop: '2px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={plan.ctaDisabled || isCurrentPlan || checkingOut !== null}
                onClick={() => plan.tier === 'pro' ? handleCheckout('pro') : plan.tier === 'elite' ? handleCheckout('elite') : undefined}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: plan.ctaDisabled || isCurrentPlan || checkingOut !== null ? 'not-allowed' : 'pointer',
                  background: isCurrentPlan ? 'var(--elevated)' : plan.popular ? 'var(--interview)' : plan.elite ? 'var(--elite)' : 'var(--match-high)',
                  color: isCurrentPlan ? 'var(--text-muted)' : plan.popular || plan.elite ? 'var(--text-primary)' : 'var(--base)',
                  border: '0.5px solid transparent',
                  opacity: plan.ctaDisabled || isCurrentPlan || checkingOut !== null ? 0.5 : 1
                }}
              >
                {checkingOut === plan.tier ? 'Redirecting...' : isCurrentPlan ? 'Current Plan' : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  )
}