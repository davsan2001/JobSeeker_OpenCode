import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { 
  getPaymentProvider,
  getSimulationSubscription,
  getSimulationCustomer,
  buildSimulationWebhookPayload,
  cancelSimulationSubscription,
  resumeSimulationSubscription,
  pauseSimulationSubscription,
  createSimulationSubscription
} from '@/lib/payments/simulation'
import { handleLemonSqueezyWebhook } from '@/lib/lemon-squeezy'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const user = await requireUser()
  
  const body = await req.json() as {
    subscriptionId?: string
    customerId?: string
    tier?: 'pro' | 'elite'
    action: 'complete' | 'cancel' | 'resume' | 'pause'
  }

  const { subscriptionId, customerId, tier, action } = body

  const provider = getPaymentProvider()
  
  if (provider !== 'simulation') {
    return NextResponse.json(
      { error: 'Simulation not enabled' },
      { status: 400 }
    )
  }

  if (action === 'complete') {
    if (!subscriptionId || !tier) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      )
    }

    let subscription = getSimulationSubscription(subscriptionId)
    
    if (!subscription) {
      if (!customerId) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        )
      }
      
      subscription = createSimulationSubscription(customerId, tier)
    }

    const customer = getSimulationCustomer(customerId as string)

    try {
      const payload = {
        meta: {
          event_name: 'subscription_created',
          custom_data: { user_id: user.id }
        },
        data: {
          attributes: {
            id: subscription.id,
            status: 'active',
            customer_id: customerId,
            variant_id: subscription.variantId,
            renews_at: subscription.renewsAt,
            ends_at: null,
            trial_ends_at: null
          }
        },
        customer_email: customer?.email || '',
        subscription_id: subscription.id,
        customer_id: customerId,
        variant_id: subscription.variantId,
        status: 'active',
        renews_at: subscription.renewsAt
      }
      
      console.log('[simulation] Calling webhook with payload:', JSON.stringify(payload, null, 2))
      
      await handleLemonSqueezyWebhook('subscription_created', payload)

      return NextResponse.json({
        success: true,
        tier: subscription.tier,
        status: subscription.status
      })
    } catch (err) {
      console.error('[simulation] Complete error:', err)
      return NextResponse.json(
        { error: 'Failed to process payment' },
        { status: 500 }
      )
    }
  }

  if (action === 'cancel') {
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscription ID' },
        { status: 400 }
      )
    }

    const subscription = cancelSimulationSubscription(subscriptionId)
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const customer = getSimulationCustomer(subscription.customerId)

    try {
      await handleLemonSqueezyWebhook('subscription_cancelled', {
        meta: {
          event_name: 'subscription_cancelled',
          custom_data: { user_id: user.id }
        },
        data: {
          attributes: {
            id: subscription.id,
            status: 'cancelled'
          }
        },
        subscription_id: subscription.id,
        customer_email: customer?.email || ''
      })

      return NextResponse.json({
        success: true,
        status: subscription.status
      })
    } catch (err) {
      console.error('[simulation] Cancel error:', err)
      return NextResponse.json(
        { error: 'Failed to cancel subscription' },
        { status: 500 }
      )
    }
  }

  if (action === 'resume') {
    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscription ID' },
        { status: 400 }
      )
    }

    const subscription = resumeSimulationSubscription(subscriptionId)
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    const customer = getSimulationCustomer(subscription.customerId)

    try {
      await handleLemonSqueezyWebhook('subscription_resumed', {
        meta: {
          event_name: 'subscription_resumed',
          custom_data: { user_id: user.id }
        },
        data: {
          attributes: {
            id: subscription.id,
            status: 'active',
            renews_at: subscription.renewsAt
          }
        },
        subscription_id: subscription.id,
        renews_at: subscription.renewsAt,
        customer_email: customer?.email || ''
      })

      return NextResponse.json({
        success: true,
        status: subscription.status
      })
    } catch (err) {
      console.error('[simulation] Resume error:', err)
      return NextResponse.json(
        { error: 'Failed to resume subscription' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  )
}