"use server";

import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";
import type { MenuCategoryWithItems, MenuCategoryDb, MenuItemDb } from "@/lib/types";
import { fallbackMenu } from "@/lib/fallback-menu";

export async function getMenu(): Promise<{
  data: MenuCategoryWithItems[] | null;
  error: string | null;
  isFallback?: boolean;
}> {
  if (!isSupabaseConfigured()) {
    return { data: fallbackMenu, error: null, isFallback: true };
  }
  try {
    const supabase = getSupabaseClient();
    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (catError) return { data: fallbackMenu, error: null, isFallback: true };
    if (!categories?.length) return { data: fallbackMenu, error: null, isFallback: true };

    const { data: items, error: itemsError } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (itemsError) return { data: fallbackMenu, error: null, isFallback: true };

    const itemsByCat = (items ?? []).reduce<Record<string, MenuItemDb[]>>((acc, item) => {
      const row = item as unknown as MenuItemDb;
      if (!acc[row.category_id]) acc[row.category_id] = [];
      acc[row.category_id].push(row);
      return acc;
    }, {});

    const result: MenuCategoryWithItems[] = (categories as unknown as MenuCategoryDb[]).map(
      (c) => ({
        ...c,
        items: itemsByCat[c.id] ?? [],
      })
    );
    return { data: result, error: null, isFallback: false };
  } catch {
    return { data: fallbackMenu, error: null, isFallback: true };
  }
}

export async function createCategory(name: string, image: string): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("menu_categories").insert({
      name,
      image: image || "",
      sort_order: 999,
    });
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка створення категорії" };
  }
}

export async function updateCategory(
  id: string,
  data: { name?: string; image?: string; sort_order?: number; active?: boolean }
): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("menu_categories").update(data).eq("id", id);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка оновлення категорії" };
  }
}

export async function deleteCategory(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("menu_categories").delete().eq("id", id);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка видалення категорії" };
  }
}

export async function createItem(
  categoryId: string,
  name: string,
  price: number,
  imageUrl?: string
): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("menu_items").insert({
      category_id: categoryId,
      name,
      price: Number(price),
      image_url: imageUrl || null,
      sort_order: 999,
    });
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка додавання позиції" };
  }
}

export async function updateItem(
  id: string,
  data: { name?: string; price?: number; image_url?: string | null; sort_order?: number; active?: boolean }
): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const payload = data.price !== undefined ? { ...data, price: Number(data.price) } : data;
    const { error } = await supabase.from("menu_items").update(payload).eq("id", id);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка оновлення позиції" };
  }
}

export async function deleteItem(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка видалення позиції" };
  }
}

const FALLBACK_CATEGORY_NAME_TO_ID: Record<string, string> = {
  Кава: "coffee",
  Чай: "tea",
  Десерти: "desserts",
  Морозиво: "icecream",
};

/** Імпортує усі позиції з резервного меню в базу (за назвою категорії). Існуючі (категорія + назва) пропускаються. */
export async function seedMenuItemsFromFallback(): Promise<{ error: string | null; added: number }> {
  if (!isSupabaseConfigured()) return { error: "Supabase не налаштовано", added: 0 };
  try {
    const supabase = getSupabaseClient();
    const { data: categories, error: catError } = await supabase
      .from("menu_categories")
      .select("id, name")
      .order("sort_order", { ascending: true });
    if (catError || !categories?.length) return { error: catError?.message ?? "Немає категорій", added: 0 };

    const { data: existingItems } = await supabase.from("menu_items").select("category_id, name");
    const existingSet = new Set(
      (existingItems ?? []).map((i: { category_id: string; name: string }) => `${i.category_id}:${i.name}`)
    );

    let added = 0;
    for (const dbCat of categories as { id: string; name: string }[]) {
      const fallbackId = FALLBACK_CATEGORY_NAME_TO_ID[dbCat.name];
      if (!fallbackId) continue;
      const fallbackCat = fallbackMenu.find((c) => c.id === fallbackId);
      if (!fallbackCat?.items?.length) continue;
      for (const item of fallbackCat.items) {
        const key = `${dbCat.id}:${item.name}`;
        if (existingSet.has(key)) continue;
        const { error: insErr } = await supabase.from("menu_items").insert({
          category_id: dbCat.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url ?? null,
          sort_order: item.sort_order,
          active: true,
        });
        if (!insErr) {
          added++;
          existingSet.add(key);
        }
      }
    }
    return { error: null, added };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Помилка імпорту", added: 0 };
  }
}
