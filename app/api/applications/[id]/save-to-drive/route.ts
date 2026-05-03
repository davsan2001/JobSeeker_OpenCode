import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * @deprecated Google Drive integration has been removed.
 * In Phase 2, files will be stored in Supabase Storage instead.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Google Drive integration has been removed. Storage will move to Supabase Storage in Phase 2.' },
    { status: 410 }
  )
}