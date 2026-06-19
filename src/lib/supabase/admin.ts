import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

/**
 * Admin Supabase client - bypasses RLS.
 * SERVER ONLY. NEVER import in client components.
 * Used by API routes / cron jobs / admin operations.
 */
export function createAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
