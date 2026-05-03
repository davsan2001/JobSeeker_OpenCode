import { createSupabaseServerClient } from '../supabase/server'

export type PaymentProvider = 'simulation' | 'lemonsqueezy'

export function getPaymentProvider(): PaymentProvider {
  return (process.env.PAYMENT_PROVIDER as PaymentProvider) || 'simulation'
}

export function isSimulationMode(): boolean {
  return getPaymentProvider() === 'simulation'
}

export const SIM_VARIANTS = {
  pro: 'sim_pro_001',
  elite: 'sim_elite_001'
}

export const SIM_PRICES = {
  pro: '10.00',
  elite: '20.00'
}

export interface SimulationCustomer {
  id: string
  email: string
  userId: string
}

export interface SimulationSubscription {
  id: string
  customerId: string
  variantId: string
  status: 'active' | 'on_trial' | 'cancelled' | 'expired' | 'paused'
  createdAt: string
  renewsAt: string | null
  endsAt: string | null
  tier: 'pro' | 'elite'
}

const simulationCustomers = new Map<string, SimulationCustomer>()
const simulationSubscriptions = new Map<string, SimulationSubscription>()

export function createSimulationCustomer(userId: string, email: string): SimulationCustomer {
  const customerId = `sim_cust_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const customer: SimulationCustomer = { id: customerId, email, userId }
  simulationCustomers.set(customerId, customer)
  return customer
}

export function getSimulationCustomer(customerId: string): SimulationCustomer | undefined {
  return simulationCustomers.get(customerId)
}

export function createSimulationSubscription(
  customerId: string,
  tier: 'pro' | 'elite'
): SimulationSubscription {
  const variantId = tier === 'pro' ? SIM_VARIANTS.pro : SIM_VARIANTS.elite
  const subId = `sim_sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const now = new Date().toISOString()
  const renews = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  
  const subscription: SimulationSubscription = {
    id: subId,
    customerId,
    variantId,
    status: 'active',
    createdAt: now,
    renewsAt: renews,
    endsAt: null,
    tier
  }
  
  simulationSubscriptions.set(subId, subscription)
  return subscription
}

export function getSimulationSubscription(subId: string): SimulationSubscription | undefined {
  return simulationSubscriptions.get(subId)
}

export function cancelSimulationSubscription(subId: string): SimulationSubscription | undefined {
  const sub = simulationSubscriptions.get(subId)
  if (sub) {
    sub.status = 'cancelled'
    sub.endsAt = new Date().toISOString()
    simulationSubscriptions.set(subId, sub)
  }
  return sub
}

export function resumeSimulationSubscription(subId: string): SimulationSubscription | undefined {
  const sub = simulationSubscriptions.get(subId)
  if (sub) {
    sub.status = 'active'
    sub.endsAt = null
    sub.renewsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    simulationSubscriptions.set(subId, sub)
  }
  return sub
}

export function pauseSimulationSubscription(subId: string): SimulationSubscription | undefined {
  const sub = simulationSubscriptions.get(subId)
  if (sub) {
    sub.status = 'paused'
    simulationSubscriptions.set(subId, sub)
  }
  return sub
}

export function buildSimulationWebhookPayload(
  eventType: string,
  subscription: SimulationSubscription,
  customer: SimulationCustomer
): Record<string, unknown> {
  const customerEmail = customer.email
  
  switch (eventType) {
    case 'subscription_created':
    case 'subscription_updated':
      return {
        meta: {
          event_name: eventType,
          custom_data: { user_id: customer.userId }
        },
        data: {
          attributes: {
            id: subscription.id,
            status: subscription.status,
            customer_id: subscription.customerId,
            variant_id: subscription.variantId,
            renews_at: subscription.renewsAt,
            ends_at: subscription.endsAt,
            trial_ends_at: null
          }
        },
        customer_email: customerEmail
      }
    
    case 'subscription_cancelled':
    case 'subscription_expired':
      return {
        meta: {
          event_name: eventType,
          custom_data: { user_id: customer.userId }
        },
        data: {
          attributes: {
            id: subscription.id,
            status: 'cancelled'
          }
        },
        subscription_id: subscription.id,
        customer_email: customerEmail
      }
    
    case 'subscription_resumed':
      return {
        meta: {
          event_name: eventType,
          custom_data: { user_id: customer.userId }
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
        customer_email: customerEmail
      }
    
    case 'subscription_paused':
      return {
        meta: {
          event_name: eventType,
          custom_data: { user_id: customer.userId }
        },
        data: {
          attributes: {
            id: subscription.id,
            status: 'paused'
          }
        },
        subscription_id: subscription.id,
        customer_email: customerEmail
      }
    
    default:
      return {}
  }
}