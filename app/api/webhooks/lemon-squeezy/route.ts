import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { handleLemonSqueezyWebhook } from '@/lib/lemon-squeezy'

export const runtime = 'nodejs'

const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    console.error('[webhook] LEMON_SQUEEZY_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    )
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  // Verify signature
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET)
  const digest = hmac.update(rawBody).digest('hex')

  if (digest !== signature) {
    console.error('[webhook] Invalid signature')
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    )
  }

  try {
    const payload = JSON.parse(rawBody)
    const eventType = payload.meta.event_name
    const data = payload.data?.attributes || {}

    console.log('[webhook] Received event:', eventType)

    await handleLemonSqueezyWebhook(eventType, data)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook] Error processing webhook:', err)
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    )
  }
}