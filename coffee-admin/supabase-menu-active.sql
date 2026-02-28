-- Блокування категорій і позицій (без видалення). Виконайте після supabase-menu.sql.
-- Заблоковані не показуються в додатку, в адмінці відображаються як «Заблоковано».

ALTER TABLE public.menu_categories
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.menu_categories.active IS 'false = заблоковано, не показується в додатку';
COMMENT ON COLUMN public.menu_items.active IS 'false = заблоковано, не показується в додатку';
