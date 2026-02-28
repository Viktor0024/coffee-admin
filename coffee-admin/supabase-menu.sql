-- Таблиці для управління меню в адмін-панелі.
-- Виконайте в Supabase Dashboard → SQL Editor.

-- Категорії (Кава, Чай, Десерти, Морозиво)
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Позиції меню
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);

-- RLS: дозволити anon читати та змінювати (як для orders). Для продакшену обмежте права.
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "menu_categories_select" ON public.menu_categories;
DROP POLICY IF EXISTS "menu_categories_insert" ON public.menu_categories;
DROP POLICY IF EXISTS "menu_categories_update" ON public.menu_categories;
DROP POLICY IF EXISTS "menu_categories_delete" ON public.menu_categories;

CREATE POLICY "menu_categories_select" ON public.menu_categories FOR SELECT TO anon USING (true);
CREATE POLICY "menu_categories_insert" ON public.menu_categories FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "menu_categories_update" ON public.menu_categories FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "menu_categories_delete" ON public.menu_categories FOR DELETE TO anon USING (true);

DROP POLICY IF EXISTS "menu_items_select" ON public.menu_items;
DROP POLICY IF EXISTS "menu_items_insert" ON public.menu_items;
DROP POLICY IF EXISTS "menu_items_update" ON public.menu_items;
DROP POLICY IF EXISTS "menu_items_delete" ON public.menu_items;

CREATE POLICY "menu_items_select" ON public.menu_items FOR SELECT TO anon USING (true);
CREATE POLICY "menu_items_insert" ON public.menu_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "menu_items_update" ON public.menu_items FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "menu_items_delete" ON public.menu_items FOR DELETE TO anon USING (true);

-- Опційно: початкові категорії. Позиції додавайте в адмінці «Меню».
INSERT INTO public.menu_categories (id, name, image, sort_order) VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Кава', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 1),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'Чай', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600', 2),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Десерти', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600', 3),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'Морозиво', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', 4)
ON CONFLICT (id) DO NOTHING;
