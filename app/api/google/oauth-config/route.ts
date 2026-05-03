import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * @deprecated Google OAuth client configuration has been removed.
 * Use Supabase Auth instead.
 */
export async function PUT() {
  return NextResponse.json(
    { error: 'Google OAuth configuration has been removed. Use Supabase Auth at /login' },
    { status: 410 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Google OAuth configuration has been removed. Use Supabase Auth at /login' },
    { status: 410 }
  )
}