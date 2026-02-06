# Coffee Admin

Веб-админка для кофе-проекта: просмотр заказов из Supabase и управление их статусами (принять заказ и т.д.).

## Запуск

```bash
npm install
npm run dev
```

Приложение откроется на **http://localhost:3000**.

- **Главная** — `/`
- **Заказы** — `/orders` (список заказов из таблицы `public.orders`, кнопка «Принять заказ»)

## Переменные окружения

Создайте в корне проекта файл **`.env.local`** (не коммитить). Нужны две переменные:

| Переменная | Описание |
|------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL проекта Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный (anon) ключ API |

**Где взять:** [Supabase Dashboard](https://supabase.com/dashboard) → ваш проект → **Project Settings** → **API** → Project URL и ключ **anon** `public`.

Пример `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

После изменения `.env.local` перезапустите `npm run dev`.

## Стек

- **Next.js** (App Router, TypeScript)
- **Supabase** — чтение и обновление заказов в таблице `orders`
