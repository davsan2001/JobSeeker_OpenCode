import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/supabase/server'
import { getProfile } from '@/lib/storage/supabase'

export const runtime = 'nodejs'

export async function GET() {
  const user = await requireUser()
  const profile = await getProfile(user.id)
  
  if (!profile) {
    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: null,
      avatarUrl: null,
      tier: 'free',
      subscriptionStatus: null
    })
  }
  
  return NextResponse.json(profile)
}