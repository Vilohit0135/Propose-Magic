import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-only Supabase client. Uses the service role key, so it bypasses
// RLS — never import this into client components. If the URL/key aren't
// set, returns null and lib/db.ts falls back to its in-memory store. That
// fallback keeps local dev working when .env isn't populated yet.
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
