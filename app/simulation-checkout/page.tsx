'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SimulationCheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const subId = searchParams?.get('sub')
  const customerId = searchParams?.get('customer')
  const tier = searchParams?.get('tier')

  useEffect(() => {
    if (!subId || !customerId) {
      setStatus('error')
      return
    }

    async function completePayment() {
      try {
        const res = await fetch('/api/simulation-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscriptionId: subId,
            customerId,
            tier,
            action: 'complete'
          })
        })

        const data = await res.json()

        if (data.success) {
          setStatus('success')
          setTimeout(() => {
            router.push('/app/pricing')
          }, 2000)
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    completePayment()
  }, [subId, customerId, tier, router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--base)'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px'
      }}>
        {status === 'loading' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid var(--border-default)',
              borderTopColor: 'var(--match-high)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Processing Payment...
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Simulating secure payment
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--match-high)',
              color: 'var(--base)',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              ✓
            </div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Payment Successful!
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Your {tier} subscription is now active
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--error)',
              color: 'var(--base)',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              ✕
            </div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Payment Failed
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Please try again
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default function SimulationCheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--base)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid var(--border-default)',
          borderTopColor: 'var(--match-high)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    }>
      <SimulationCheckoutContent />
    </Suspense>
  )
}