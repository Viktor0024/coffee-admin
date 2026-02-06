/**
 * API для мобильного приложения: получение заказа по ID.
 * GET /api/orders/:id — тот же формат, что и старый Express GET /orders/:id.
 * Используется в coffee-mobile (order-status) вместо localhost/ngrok.
 */
import { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return Response.json({ error: "Order not found." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("id, items, total, status, created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase getOrderById error:", error);
      return Response.json({ error: "Failed to load order." }, { status: 500 });
    }
    if (!data) {
      return Response.json({ error: "Order not found." }, { status: 404 });
    }

    return Response.json({
      id: data.id,
      items: data.items ?? [],
      total: data.total,
      status: data.status,
      created_at: data.created_at,
    });
  } catch (e) {
    console.error("API orders [id] error:", e);
    return Response.json({ error: "Failed to load order." }, { status: 500 });
  }
}
