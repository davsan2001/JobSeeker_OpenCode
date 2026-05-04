import { createSupabaseServerClient } from '@/lib/supabase/server'
import { decryptSecret } from '@/lib/crypto'

export async function handleLemonSqueezyWebhook(
  eventType: string,
  payload: Record<string, unknown>
) {
  const supabase = createSupabaseServerClient()
  
  switch (eventType) {
    case 'subscription_created':
    case 'subscription_updated': {
      const { customer_id, subscription_id, variant_id, status, trial_ends_at, ends_at, renews_at, customer_email } = payload
      
      // Map variant_id to tier
      const tier = await getTierFromVariantId(variant_id as string)
      if (!tier) {
        console.error('[webhook] Unknown variant_id:', variant_id)
        return
      }

      // Try to find user by custom_data.user_id first (for simulation)
      const meta = payload.meta as { custom_data?: { user_id?: string } } | undefined
      let profileId = meta?.custom_data?.user_id

      // If not found, try to find by subscription_id
      if (!profileId && subscription_id) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('subscription_id', subscription_id as string)
          .single() as { data: { id: string } | null }
        profileId = existingProfile?.id
      }

      // If still not found, try to find by customer_email
      if (!profileId && customer_email) {
        const { data: profileByEmail } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customer_email as string)
          .single() as { data: { id: string } | null }
        profileId = profileByEmail?.id
      }

      if (profileId) {
        await supabase
          .from('profiles')
          .update({
            tier: tier,
            subscription_status: status === 'active' ? 'active' : status === 'on_trial' ? 'on_trial' : 'past_due',
            subscription_provider: 'lemon_squeezy',
            subscription_id: subscription_id as string,
            subscription_variant_id: variant_id as string,
            subscription_current_period_end: renews_at ? new Date(renews_at as string).toISOString() : null,
            updated_at: new Date().toISOString()
          } as never)
          .eq('id', profileId)

        console.log(`[webhook] Updated profile ${profileId} to tier ${tier}`)
      }
      break
    }

    case 'subscription_cancelled':
    case 'subscription_expired': {
      const { subscription_id } = payload
      
      // Find by subscription_id and update to free tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscription_id', subscription_id as string)
        .single() as { data: { id: string } | null }

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            tier: 'free',
            subscription_status: 'cancelled',
            subscription_id: null,
            subscription_variant_id: null,
            subscription_current_period_end: null,
            updated_at: new Date().toISOString()
          } as never)
          .eq('id', profile.id)

        console.log(`[webhook] Cancelled subscription for profile ${profile.id}`)
      }
      break
    }

    case 'subscription_resumed': {
      const { subscription_id, renews_at } = payload

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscription_id', subscription_id as string)
        .single() as { data: { id: string } | null }

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'active',
            subscription_current_period_end: renews_at ? new Date(renews_at as string).toISOString() : null,
            updated_at: new Date().toISOString()
          } as never)
          .eq('id', profile.id)
      }
      break
    }

    case 'subscription_paused': {
      const { subscription_id } = payload
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('subscription_id', subscription_id as string)
        .single() as { data: { id: string } | null }

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'paused',
            updated_at: new Date().toISOString()
          } as never)
          .eq('id', profile.id)
      }
      break
    }

    default:
      console.log('[webhook] Unhandled event type:', eventType)
  }
}

async function getTierFromVariantId(variantId: string): Promise<'free' | 'pro' | 'elite' | null> {
  // These should be configured in environment variables
  const proVariantId = process.env.LEMON_SQUEEZY_VARIANT_PRO
  const eliteVariantId = process.env.LEMON_SQUEEZY_VARIANT_ELITE
  
  // Simulation variant IDs (fallback for dev mode)
  const simProVariantId = 'sim_pro_001'
  const simEliteVariantId = 'sim_elite_001'
  
  if (variantId === proVariantId || variantId === simProVariantId) return 'pro'
  if (variantId === eliteVariantId || variantId === simEliteVariantId) return 'elite'
  
  return null
}

export async function getUserTier(userId: string): Promise<'free' | 'pro' | 'elite'> {
  const supabase = createSupabaseServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', userId)
    .single() as { data: { tier: string } | null }

  return (profile?.tier as 'free' | 'pro' | 'elite') || 'free'
}

export async function canAccessProFeature(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId)
  return tier === 'pro' || tier === 'elite'
}

export async function canAccessEliteFeature(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId)
  return tier === 'elite'
}

export function requireTier(
  userId: string,
  requiredTier: 'free' | 'pro' | 'elite'
): void {
  const tierOrder = { free: 0, pro: 1, elite: 2 }
  const userTier = getUserTier(userId) // This won't work synchronously
  
  // This should be used with async/await
  // Use canAccessProFeature or canAccessEliteFeature instead
}