-- Усі позиції меню (кава, чай, десерти, морозиво) для збереження в адмінці та блокування/розблокування.
-- Виконайте один раз після supabase-menu.sql та supabase-menu-active.sql.
-- Важливо: категорії мають бути створені з supabase-menu.sql (ті самі UUID для Кава, Чай, Десерти, Морозиво).

-- Унікальний індекс, щоб при повторному запуску не створювались дублікати
CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_items_category_name
  ON public.menu_items(category_id, name);

-- Кава (category_id з supabase-menu.sql)
INSERT INTO public.menu_items (category_id, name, price, image_url, sort_order, active) VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Еспресо', 3.0, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', 1, true),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Лате', 4.5, 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400', 2, true),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Капучино', 4.0, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 3, true),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Американо', 3.5, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', 4, true),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Мокачино', 4.8, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 5, true),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Флет-вайт', 4.2, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 6, true),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'Макіато', 3.8, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', 7, true)
ON CONFLICT (category_id, name) DO NOTHING;

-- Чай
INSERT INTO public.menu_items (category_id, name, price, image_url, sort_order, active) VALUES
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'Зелений чай', 1.0, 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400', 1, true),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'Чорний чай', 2.5, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400', 2, true),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'Холодний чай', 3.5, 'https://masterpiecer-images.s3.yandex.net/a9bcff5b7bc611eebb2eb646b2a0ffc1:upscaled', 3, true),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'Ромашковий чай', 3.0, 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&q=80', 4, true),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'Мʼятний чай', 3.2, 'https://здоровое-питание.рф/upload/iblock/744/l0l1bjj9168mbvqa9kfhoidqyc4pnhs4/lori_0042181802_bigwww-_1_.jpg', 5, true)
ON CONFLICT (category_id, name) DO NOTHING;

-- Десерти
INSERT INTO public.menu_items (category_id, name, price, image_url, sort_order, active) VALUES
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Круасан', 4.0, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 1, true),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Чізкейк', 5.0, 'https://images.unsplash.com/photo-1533134242443-d4ea4b2f4a28?w=400', 2, true),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Брауні', 4.5, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', 3, true),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Мафін', 3.5, 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400', 4, true),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Тірамісу', 5.5, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', 5, true),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'Млинці', 4.2, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400', 6, true)
ON CONFLICT (category_id, name) DO NOTHING;

-- Морозиво
INSERT INTO public.menu_items (category_id, name, price, image_url, sort_order, active) VALUES
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'Ваніль', 3.5, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 1, true),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'Шоколад', 4.0, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400', 2, true),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'Полуниця', 3.8, 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400', 3, true),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'Фісташка', 4.2, 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', 4, true),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'Карамель', 4.0, 'https://images.unsplash.com/photo-1560008581-98ca2fd13b15?w=400', 5, true)
ON CONFLICT (category_id, name) DO NOTHING;
