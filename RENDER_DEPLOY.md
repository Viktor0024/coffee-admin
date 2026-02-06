# Деплой на Render: админка + единый backend для мобильного приложения

Один публичный сервер (Next.js в папке `coffee-admin`) заменяет localhost и ngrok: на нём работает веб-админка и API для приложения (GET заказа по ID).

---

## Как это сделать (пошагово)

### Шаг 1: Задеплоить coffee-admin на Render

1. Зайдите на [render.com](https://render.com) и войдите в аккаунт.
2. Нажмите **New** → **Web Service**.
3. Подключите репозиторий (GitHub/GitLab/Bitbucket): выберите репозиторий с этим проектом и нажмите **Connect**.
4. Настройте сервис:
   - **Name:** например `coffee-admin`.
   - **Region:** выберите ближайший.
   - **Root Directory:** обязательно укажите `coffee-admin` (приложение лежит в подпапке).
   - **Runtime:** Node.
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
5. В блоке **Environment** нажмите **Add Environment Variable** и добавьте две переменные (значения возьмите из Supabase Dashboard → Project Settings → API):
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`  
     **Value:** `https://ваш-project-id.supabase.co`
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     **Value:** ваш anon (public) key
6. Нажмите **Create Web Service**. Дождитесь окончания сборки и деплоя (несколько минут).
7. Вверху страницы сервиса скопируйте **URL** (например `https://coffee-admin-xxxx.onrender.com`) — это и есть адрес вашего backend.

### Шаг 2: Проверить, что админка работает

- Откройте в браузере URL сервиса (из шага 1.7). Должна открыться главная страница админки.
- Перейдите на страницу заказов (например `/orders`). Должен отображаться Kanban с заказами из Supabase (если они есть).
- Откройте в новой вкладке: `https://ваш-url.onrender.com/api/health` — должен вернуться ответ `{"status":"ok"}`.

### Шаг 3: Указать EXPO_PUBLIC_API_URL в мобильном приложении

1. Откройте папку **coffee-mobile** в редакторе.
2. Откройте или создайте файл **`.env`** или **`.env.local`** (в корне coffee-mobile, рядом с `app.json`).
3. Добавьте строку (подставьте свой URL из шага 1.7, **без** слэша в конце):

   ```
   EXPO_PUBLIC_API_URL=https://coffee-admin-xxxx.onrender.com
   ```

4. Сохраните файл. Перезапустите приложение (например `npx expo start --clear` или пересоберите билд), чтобы переменная подхватилась.

После этого приложение будет запрашивать данные заказа по адресу `https://ваш-url.onrender.com/orders/<id>`.

---

## 1. Что за проект

- **coffee-admin** — Next.js 15 (App Router), SSR-страницы и API routes.
- **API:** есть маршруты `/api/health` и `/api/orders/[id]`. Для мобильного приложения добавлен rewrite: **GET /orders/:id** → тот же ответ, что и **GET /api/orders/:id**.
- **Supabase:** заказы и реальное время через Supabase (клиент в браузере и в приложении). Бэкенд только отдаёт заказ по ID для экрана «Статус замовлення».

---

## 2. package.json (coffee-admin)

Уже настроено:

- `scripts.dev` → `next dev`
- `scripts.build` → `next build`
- `scripts.start` → `next start`

Дополнительно ничего менять не нужно.

---

## 3. Убраны жёсткие ссылки на localhost/ngrok

- **Корневой Express** (`index.js`) больше не нужен для деплоя: мобильное приложение может работать только с Render (через Supabase и GET /orders/:id на Render).
- **coffee-mobile:** базовый URL бэкенда задаётся через **EXPO_PUBLIC_API_URL**. Если переменная задана (например `https://coffee-admin-xxxx.onrender.com`) — используется она; иначе в dev используется LAN IP. Жёсткие localhost/ngrok в коде убраны.

---

## 4. SSR

- Серверный код не использует `window`/`document`. Использование `document` есть только в клиентском компоненте `order-items-preview.tsx` (`"use client"`), что для Next.js допустимо.
- Данные заказов в админке подгружаются на клиенте через Supabase (realtime). Для первого рендера страница не пустая (есть разметка и состояние загрузки).

---

## 5. Подготовка к деплою на Render

- **Runtime:** Node.js (рекомендуется 20).
- **Root Directory:** `coffee-admin` (репозиторий — корень проекта, приложение в подпапке).
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`
- **Порт:** Render задаёт переменную **PORT**; Next.js при `next start` использует её автоматически.

---

## 6. Переменные окружения на Render

Задайте в Render Dashboard → ваш сервис → Environment:

| Переменная | Где задать | Публичная? | Описание |
|------------|------------|------------|----------|
| **NEXT_PUBLIC_SUPABASE_URL** | Render + .env.local (локально) | Да (попадает в клиент) | URL проекта Supabase, например `https://xxxx.supabase.co` |
| **NEXT_PUBLIC_SUPABASE_ANON_KEY** | Render + .env.local (локально) | Да | Anon key из Supabase Dashboard → Project Settings → API |
| **PORT** | Только Render (подставляется автоматически) | — | Порт сервера, трогать не нужно |

Серверные секреты (например `SUPABASE_SERVICE_ROLE_KEY`) в текущей реализации админки и API не используются: везде anon key.

---

## 7. После деплоя — что проверить

1. **Админка:** открывается по URL Render (например `https://coffee-admin-xxxx.onrender.com`).
2. **Замовлення:** страница «Замовлення» загружает список из Supabase, Kanban отображается.
3. **Смена статусів:** перетаскивание/кнопки меняют статус в Supabase — без ошибок.
4. **Realtime:** при изменении в Supabase данные в админке обновляются (если подписка включена).
5. **API для приложения:** в браузере или Postman: `GET https://your-app.onrender.com/orders/<order-uuid>` и `GET https://your-app.onrender.com/api/health` — оба возвращают ожидаемый ответ (заказ или `{ "status": "ok" }`).

---

## 8. Мобильное приложение после перехода на Render

- **API URL:** в **coffee-mobile** в `.env` (или `.env.local`) задайте:
  - `EXPO_PUBLIC_API_URL=https://your-app.onrender.com`
  - Без слэша в конце; протокол `https://` обязателен для продакшена.
- **Что убрать из конфигурации:** любые ссылки на ngrok и localhost в конфигах/документации. В коде они уже не используются: базовый URL только из `EXPO_PUBLIC_API_URL` или dev-фолбек (LAN).
- Приложение по-прежнему создаёт заказы через Supabase и получает детали заказа через **GET** `{EXPO_PUBLIC_API_URL}/orders/:id`, что на Render обслуживается вашим Next.js (rewrite на `/api/orders/:id`).

---

## 9. Если что-то не работает

- **Пустая страница / ошибки при сборке:** проверьте, что в Render в Root Directory указано `coffee-admin` и что заданы `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Заказы не загружаются в админке:** проверьте Supabase (RLS, anon key, что таблица `orders` доступна для чтения).
- **В приложении не приходит заказ по ID:** проверьте, что `EXPO_PUBLIC_API_URL` указывает на URL Render без слэша в конце и что запрос идёт на `https://...`. Проверьте тот же URL в браузере: `https://your-app.onrender.com/orders/<uuid>`.

---

## Быстрый старт (ручной деплой)

1. Render Dashboard → **New** → **Web Service**.
2. Подключите репозиторий (GitHub/GitLab/Bitbucket).
3. **Root Directory:** `coffee-admin`.
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm run start`
6. В **Environment** добавьте `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
7. Сохраните и задеплойте. После деплоя скопируйте URL сервиса и укажите его в мобильном приложении как `EXPO_PUBLIC_API_URL`.

Либо используйте **Blueprint** и файл **render.yaml** в корне репозитория (в нём уже указаны `rootDir: coffee-admin`, команды сборки и старта; переменные Supabase нужно задать вручную в Dashboard).
