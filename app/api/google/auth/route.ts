import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * @deprecated Google OAuth flow has been removed.
 * Use Supabase Auth at /login instead.
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Google OAuth has been removed. Use Supabase Auth at /login' },
    { status: 410 }
  )
}