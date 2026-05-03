import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app'

  if (code) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return redirect(next)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}