import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// SECURITY: this client uses the Supabase SERVICE ROLE key, which
// bypasses Row Level Security entirely. Never import this file from
// client components, never send this key to the browser, and only use
// this client for the narrow set of server-side actions (like payment
// verification) that legitimately need to bypass RLS.
//
// SUPABASE_SERVICE_ROLE_KEY must be set WITHOUT the NEXT_PUBLIC_ prefix
// so Next.js never bundles it into client-side JavaScript.
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
