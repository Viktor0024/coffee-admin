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
