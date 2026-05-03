import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = [
  '/',
  '/login',
  '/auth/callback'
]

const apiPublicPaths = [
  '/api/auth',
  '/api/llm/detect'
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(p => pathname === p || pathname.startsWith(p))
}

function isApiPublicPath(pathname: string): boolean {
  return apiPublicPaths.some(p => pathname.startsWith(p))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const supabase = createSupabaseMiddlewareClient(request)

  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('[middleware] session error:', error.message)
  }

  const isPublic = isPublicPath(pathname)
  const isApiPublic = isApiPublicPath(pathname)

  if (isPublic || isApiPublic) {
    if (pathname === '/login' && session) {
      return NextResponse.redirect(new URL('/app', request.url))
    }
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
}