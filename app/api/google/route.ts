import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * @deprecated Google OAuth integration has been removed.
 * Auth is now handled via Supabase Auth (Google OAuth).
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Google OAuth integration has been removed. Use Supabase Auth instead.' },
    { status: 410 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Google OAuth integration has been removed. Use Supabase Auth instead.' },
    { status: 410 }
  )
}