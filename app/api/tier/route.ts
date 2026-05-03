import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getUserTier, canAccessProFeature, canAccessEliteFeature } from '@/lib/lemon-squeezy'
import { getPaymentProvider, isSimulationMode } from '@/lib/payments/simulation'

export const runtime = 'nodejs'

export async function GET() {
  const user = await requireUser()
  const tier = await getUserTier(user.id)
  const isPro = await canAccessProFeature(user.id)
  const isElite = await canAccessEliteFeature(user.id)
  
  return NextResponse.json({
    tier,
    isPro,
    isElite,
    hasActiveSubscription: tier !== 'free',
    paymentProvider: getPaymentProvider(),
    simulationMode: isSimulationMode()
  })
}