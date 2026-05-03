import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, fetchUserEmail } from '@/lib/google';
import { getGoogleOAuthClient, saveGoogleTokens } from '@/lib/storage';

export const runtime = 'nodejs';

/**
 * Google redirects here with either `?code=...` (success) or `?error=...`.
 *   1. Verify the `state` cookie matches the query param.
 *   2. Exchange the code for tokens (gets us a refresh_token thanks to
 *      access_type=offline + prompt=consent).
 *   3. Fetch the user's email so we can show "Connected as ..." in Settings.
 *   4. Persist everything encrypted-at-rest.
 *   5. Redirect back to /settings with a status flag so the UI can react.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const err = url.searchParams.get('error');

  const settings = new URL('/settings', url.origin);

  if (err) {
    settings.searchParams.set('google', 'error');
    settings.searchParams.set('reason', err);
    return NextResponse.redirect(settings, 302);
  }

  // Verify CSRF state.
  const cookieState = req.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('gauth_state='))
    ?.split('=')[1];

  if (!code || !state || !cookieState || cookieState !== state) {
    settings.searchParams.set('google', 'error');
    settings.searchParams.set('reason', 'invalid_state');
    return NextResponse.redirect(settings, 302);
  }

  const client = await getGoogleOAuthClient();
  if (!client) {
    settings.searchParams.set('google', 'error');
    settings.searchParams.set('reason', 'no_client');
    return NextResponse.redirect(settings, 302);
  }

  try {
    const redirectUri = `${url.origin}/api/google/callback`;
    const tokens = await exchangeCodeForTokens({
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      code,
      redirectUri
    });
    const email = await fetchUserEmail(tokens.access_token);
    await saveGoogleTokens({ tokens, email });

    settings.searchParams.set('google', 'connected');
    const res = NextResponse.redirect(settings, 302);
    // Clear the state cookie — single-use.
    res.cookies.set('gauth_state', '', { path: '/', maxAge: 0 });
    return res;
  } catch (e) {
    settings.searchParams.set('google', 'error');
    settings.searchParams.set('reason', (e as Error).message.slice(0, 200));
    return NextResponse.redirect(settings, 302);
  }
}
