import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Server-side Supabase client that reads/writes the auth cookie bound to the
 * current request. Use this in:
 *   - Server Components
 *   - Route Handlers (API routes)
 *   - Server Actions
 *
 * It automatically scopes every query to the authenticated user via RLS —
 * there's no need to pass `user_id` manually.
 *
 * Note: in Server Components, cookies are read-only. Supabase's SSR helper
 * may try to refresh the session; we swallow those set/remove errors because
 * Next.js will surface a "Cookies can only be modified in a Server Action
 * or Route Handler" error otherwise. Auth refresh happens cleanly inside
 * route handlers / server actions / middleware where writing is allowed.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Component context — ignore. Middleware will refresh.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Server Component context — ignore.
          }
        }
      }
    }
  );
}

/**
 * Returns the authenticated user or `null`. Use `requireUser()` when you need
 * to hard-gate a route.
 */
export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized - no session found');
  }
  return user;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}
