// @ts-nocheck - Types issue with Next.js middleware Request
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from './types'
import type { NextRequest } from 'next/server'

export function createSupabaseMiddlewareClient(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!baseUrl || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  return createServerClient<Database>(baseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
        })
      }
    }
  })
}