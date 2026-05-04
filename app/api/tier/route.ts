import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getUserTier, canAccessProFeature, canAccessEliteFeature } from '@/lib/lemon-squeezy'
import { getPaymentProvider, isSimulationMode } from '@/lib/payments/simulation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET() {
  const user = await requireUser()
  const tier = await getUserTier(user.id)
  const isPro = await canAccessProFeature(user.id)
  const isElite = await canAccessEliteFeature(user.id)
  
  const supabase = createSupabaseServerClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single() as { data: { email: string } | null }
  
  return NextResponse.json({
    tier,
    isPro,
    isElite,
    hasActiveSubscription: tier !== 'free',
    email: profile?.email || '',
    paymentProvider: getPaymentProvider(),
    simulationMode: isSimulationMode()
  })
}