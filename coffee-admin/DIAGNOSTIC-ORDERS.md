# Диагностика: заказы не отображаются на /orders

## 1. Один ли проект Supabase у coffee-mobile и coffee-admin?

| Приложение    | Файл        | Переменная                    | project-id              |
|--------------|-------------|-------------------------------|-------------------------|
| coffee-mobile | .env.local  | EXPO_PUBLIC_SUPABASE_URL      | **umbzkvjroicknmmaifen** |
| coffee-admin  | .env.local  | NEXT_PUBLIC_SUPABASE_URL      | **umbzkvjroicknmmaifen** |

**Вывод:** Один и тот же проект. Ошибки из-за разного project-id нет.

---

## 2. Диагностика в браузере (OrdersList)

В **coffee-admin** в клиентский компонент `app/orders/orders-list.tsx` добавлен вывод в консоль:

- `[OrdersList] NEXT_PUBLIC_SUPABASE_URL` — должен быть `https://umbzkvjroicknmmaifen.supabase.co`, не `undefined`.
- `[OrdersList] NEXT_PUBLIC_SUPABASE_ANON_KEY` — должен быть `set (eyJ...)`, не `undefined`.
- `[OrdersList] Тест .select(id, status).limit(5)` — объект с полями:
  - `data` — массив строк или `[]`;
  - `error` — объект ошибки или `null`;
  - `errorMessage`, `code` — если есть ошибка;
  - `count` — число строк (0, 5 и т.д.).
- `[OrdersList] Основной запрос` — `data`, `error`, `rows` (число строк).

Откройте **http://localhost:3000/orders**, откройте DevTools → Console и посмотрите эти логи.

- Если **URL или ANON_KEY = undefined** — переменные не доходят до клиента (перезапуск `npm run dev` после правок `.env.local`, пересборка).
- Если **test.data = []** и **error = null** — запрос прошёл, но RLS или политики не дают строк (см. п. 5).
- Если **error** не null — смотрите `errorMessage` и `code` (например, `PGRST301`, `42501`).

---

## 3. Тестовый запрос

Используется тот же клиент и таблица `orders`:

```ts
supabase.from("orders").select("id, status").limit(5)
```

Результат логируется в консоль как «Тест .select(id, status).limit(5)». По нему видно, приходят ли строки и есть ли ошибка.

---

## 4. Статусы в коде и в таблице

- **Таблица** `public.orders`: поле `status text not null default 'new'` — в БД могут быть любые значения, типично `new`, `accepted` и т.д.
- **Код** (orders-list.tsx, page, кнопка): используются `new`, `accepted`, `completed`, `preparing`, `ready`. Для отображения списка статус не фильтруется — показываются все заказы. Кнопка «Принять заказ» показывается только при `status === 'new'`.

Несоответствие статусов не может быть причиной пустого списка: список не фильтруется по статусу.

---

## 5. Таблица public.orders и RLS

- Таблица должна быть в схеме **public**: `public.orders` (в SQL Editor без указания схемы по умолчанию создаётся в `public`).
- Для чтения заказов из админки под **anon** нужна политика на **SELECT**.

Проверка в Supabase Dashboard:

1. **Table Editor** → выберите таблицу **orders** (в схеме public).
2. **Authentication** → **Policies** (или **RLS**) для этой таблицы:
   - RLS должен быть **enabled**;
   - Должна быть политика, разрешающая **SELECT** для роли **anon** (например, `using (true)`).

Если политики нет или RLS блокирует anon, то при запросе с anon-ключом Supabase вернёт **пустой массив** без ошибки. В консоли будет: `data: []`, `error: null`, `count: 0`.

Скрипт из репозитория: `supabase/orders-rls-anon.sql` — выполните его в SQL Editor, если политики ещё не применяли.

---

## 6. Где в коде получается пустой список

Логика в **app/orders/orders-list.tsx**:

- Стр. ~76: `setOrders((data ?? []) as Order[])` — если `data` пришло пустым массивом `[]`, список будет пустым.
- Пустой `data` приходит только если:
  1. Запрос к Supabase прошёл без ошибки, но RLS/политики не вернули ни одной строки, или
  2. В таблице реально 0 строк.

То есть пустой список на экране — это либо **RLS/политики** (anon не видит строки), либо **в таблице нет строк**. Ошибка «fetch failed» или исключение при вызове привели бы к блоку `catch` и показу `setError(...)`, а не к пустому списку.

---

## Чёткий вывод

1. **project-id совпадает** — coffee-mobile и coffee-admin смотрят в один проект Supabase.
2. После открытия `/orders` смотрите консоль браузера:
   - **URL или key = undefined** → поправьте `.env.local` и перезапустите `npm run dev`.
   - **test.data = []**, **error = null** → почти наверняка **RLS: для anon нет активной политики SELECT на `public.orders`**. Выполните `supabase/orders-rls-anon.sql` в SQL Editor.
   - **error** не null → исправьте по тексту `errorMessage` (права, таблица не найдена и т.д.).
3. Конкретная причина пустого списка при «заказы есть в Supabase» в 99% случаев: **включён RLS на `public.orders`, но нет политики SELECT для anon**. Фикс: применить политику из `orders-rls-anon.sql`.
