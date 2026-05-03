import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { 
  getPaymentProvider, 
  isSimulationMode,
  createSimulationCustomer,
  buildSimulationWebhookPayload,
  createSimulationSubscription
} from '@/lib/payments/simulation'
import { handleLemonSqueezyWebhook } from '@/lib/lemon-squeezy'

export const runtime = 'nodejs'

const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY
const LEMON_SQUEEZY_STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID
const LEMON_SQUEEZY_VARIANT_PRO = process.env.LEMON_SQUEEZY_VARIANT_PRO
const LEMON_SQUEEZY_VARIANT_ELITE = process.env.LEMON_SQUEEZY_VARIANT_ELITE

export async function POST(req: Request) {
  const user = await requireUser()
  
  const { tier } = await req.json() as { tier: 'pro' | 'elite' }
  
  if (!tier || (tier !== 'pro' && tier !== 'elite')) {
    return NextResponse.json(
      { error: 'Invalid tier' },
      { status: 400 }
    )
  }

  const provider = getPaymentProvider()
  
  if (provider === 'simulation') {
    return handleSimulationCheckout(user.id, tier)
  }

  return handleLemonSqueezyCheckout(req, user, tier)
}

async function handleSimulationCheckout(userId: string, tier: 'pro' | 'elite') {
  const supabase = createSupabaseServerClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single() as { data: { email: string } | null }

  const customerEmail = profile?.email || ''
  
  const customer = createSimulationCustomer(userId, customerEmail)
  const subscription = createSimulationSubscription(customer.id, tier)
  
  const webhookPayload = buildSimulationWebhookPayload(
    'subscription_created',
    subscription,
    customer
  )

  try {
    await handleLemonSqueezyWebhook('subscription_created', webhookPayload)
  } catch (err) {
    console.error('[simulation] Webhook error:', err)
  }

  const simulationUrl = `/app/simulation-checkout?sub=${subscription.id}&customer=${customer.id}&tier=${tier}`
  
  return NextResponse.json({ 
    url: simulationUrl,
    simulation: true,
    provider: 'simulation'
  })
}

async function handleLemonSqueezyCheckout(req: Request, user: { id: string }, tier: 'pro' | 'elite') {
  if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID) {
    return NextResponse.json(
      { error: 'Payment not configured' },
      { status: 500 }
    )
  }

  const variantId = tier === 'pro' ? LEMON_SQUEEZY_VARIANT_PRO : LEMON_SQUEEZY_VARIANT_ELITE
  
  if (!variantId) {
    return NextResponse.json(
      { error: `${tier.toUpperCase()} variant not configured` },
      { status: 500 }
    )
  }

  const supabase = createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single() as { data: { email: string } | null }

  const customerEmail = profile?.email || ''

  try {
    const checkoutResponse = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: customerEmail,
              custom: {
                user_id: user.id
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: LEMON_SQUEEZY_STORE_ID
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: variantId
              }
            }
          }
        }
      })
    })

    if (!checkoutResponse.ok) {
      const error = await checkoutResponse.text()
      console.error('[checkout] Lemon Squeezy error:', error)
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      )
    }

    const checkoutData = await checkoutResponse.json() as {
      data: {
        attributes: {
          url: string
        }
      }
    }

    const checkoutUrl = checkoutData.data?.attributes?.url

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'No checkout URL returned' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: checkoutUrl })
  } catch (err) {
    console.error('[checkout] Error:', err)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}