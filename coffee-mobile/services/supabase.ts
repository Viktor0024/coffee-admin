import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

let client: SupabaseClient | null = null;

/** Проверка: заданы ли переменные Supabase в .env.local */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl?.trim() || !supabaseAnonKey?.trim()) {
    throw new Error(
      "Supabase не налаштовано. Додайте в .env.local: EXPO_PUBLIC_SUPABASE_URL та EXPO_PUBLIC_SUPABASE_ANON_KEY (див. README)."
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

const ORDERS_TABLE = "orders";

export type OrderInsert = {
  items: unknown;
  total: number;
  status: string;
  push_token?: string | null;
};

export type OrderRow = {
  id: string;
  total: number;
  status: string;
};

/**
 * Insert a new order (anon key). Payload: items, total, status = "new", optional push_token.
 */
export async function insertOrder(
  items: unknown,
  total: number,
  status: string = "new",
  pushToken?: string | null
): Promise<{ data: OrderRow | null; error: Error | null }> {
  try {
    const supabase = getSupabaseClient();
    const row: Record<string, unknown> = { items, total, status };
    if (pushToken?.trim()) row.push_token = pushToken.trim();
    const { data, error } = await supabase
      .from(ORDERS_TABLE)
      .insert(row)
      .select("id, total, status")
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return {
      data: data as OrderRow,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e : new Error("Failed to create order"),
    };
  }
}
