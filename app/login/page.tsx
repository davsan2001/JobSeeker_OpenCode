'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="spinner" /></div>}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get('redirect') || '/app'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(redirect)
      }
    })
  }, [router, redirect])

  async function signInWithGoogle() {
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'openid email profile'
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="card-soft p-8 text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome to JobSeeker</h1>
            <p className="text-sm text-zinc-400 mt-2">
              Sign in to start creating tailored applications
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-800 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="btn btn-primary btn-lg w-full"
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

<p className="text-xs text-zinc-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}