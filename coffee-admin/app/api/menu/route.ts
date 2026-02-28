/**
 * API для мобільного застосунку: отримання меню з Supabase.
 * GET /api/menu — формат як у coffee-mobile (menu-data): категорії з масивом items.
 */
import { NextRequest } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET(_req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select("id, name, image, sort_order")
      .order("sort_order", { ascending: true });

    if (catError) {
      console.error("Supabase menu_categories error:", catError);
      return Response.json({ error: "Failed to load menu." }, { status: 500 });
    }

    const { data: items, error: itemsError } = await supabase
      .from("menu_items")
      .select("id, category_id, name, price, image_url, sort_order")
      .order("sort_order", { ascending: true });

    if (itemsError) {
      console.error("Supabase menu_items error:", itemsError);
      return Response.json({ error: "Failed to load menu." }, { status: 500 });
    }

    const catList = (categories ?? []).map((c: { id: string; name: string; image: string; sort_order: number }) => ({
      id: c.id,
      name: c.name,
      image: c.image ?? "",
      items: (items ?? [])
        .filter((i: { category_id: string }) => i.category_id === c.id)
        .map((i: { id: string; category_id: string; name: string; price: number; image_url: string | null }) => ({
          id: i.id,
          name: i.name,
          price: Number(i.price),
          categoryId: i.category_id,
          image_url: i.image_url ?? undefined,
        })),
    }));

    return Response.json({ categories: catList });
  } catch (e) {
    console.error("API menu error:", e);
    return Response.json({ error: "Failed to load menu." }, { status: 500 });
  }
}
