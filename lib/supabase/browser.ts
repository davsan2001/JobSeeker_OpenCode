'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Browser-side Supabase client. Use from Client Components for auth flows
 * (signInWithOAuth, signOut, onAuthStateChange) and light reads that don't
 * need server-side auth enforcement.
 *
 * Safe to call in render: `createBrowserClient` internally caches the
 * singleton per origin.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  );
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}
