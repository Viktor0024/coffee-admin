"use server";

import { getSupabaseClient } from "@/lib/supabase";
import type { OrderStatus } from "@/lib/orders-constants";

export async function acceptOrder(
  orderId: string
): Promise<{ error: string | null }> {
  return updateOrderStatus(orderId, "in_progress");
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ error: string | null }> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
