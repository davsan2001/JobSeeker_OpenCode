import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Service-role Supabase client. **Server-only.** Bypasses RLS — only use
 * from trusted server code (webhooks, cron jobs, admin routes).
 *
 * Never import this from a file that can end up in a Client Component bundle.
 * The `SUPABASE_SERVICE_ROLE_KEY` must NEVER leak to the browser.
 */
let cached: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseAdminClient() {
  if (cached) return cached;

  if (typeof window !== 'undefined') {
    throw new Error('createSupabaseAdminClient must not be called in the browser');
  }

  cached = createClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
  return cached;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}
