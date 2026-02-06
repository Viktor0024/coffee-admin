import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL_PATTERN = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/;

let client: SupabaseClient | null = null;

/**
 * Проверка: заданы ли NEXT_PUBLIC_ переменные и URL в формате https://<project-id>.supabase.co
 */
export function isSupabaseConfigured(): boolean {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  return Boolean(key && url && SUPABASE_URL_PATTERN.test(url));
}

/**
 * Supabase client (singleton). Только NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase не настроен. В .env.local задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY (Dashboard → Project Settings → API)."
    );
  }
  if (!SUPABASE_URL_PATTERN.test(supabaseUrl)) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL должен быть вида https://<project-id>.supabase.co"
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
