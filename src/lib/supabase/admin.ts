import { createClient } from "@supabase/supabase-js";

/**
 * Cliente com a SERVICE ROLE KEY — ignora RLS.
 * ⚠️ SÓ pode ser importado em código de servidor (Route Handlers, Server Actions).
 * Nunca use em Client Components.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
