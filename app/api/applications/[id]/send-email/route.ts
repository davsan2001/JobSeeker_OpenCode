import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * @deprecated Gmail API integration has been removed.
 * In Phase 2, emails will be sent via the user's SMTP (App Password) instead.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Gmail API integration has been removed. Email sending will move to SMTP in Phase 2.' },
    { status: 410 }
  )
}