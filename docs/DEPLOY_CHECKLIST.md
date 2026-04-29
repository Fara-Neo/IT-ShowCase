# DEPLOY CHECKLIST

> Быстрый pre-deploy чеклист для первого production запуска (`Vercel + Neon`).

---

## 1) Переменные окружения в Vercel

Добавьте в **Project Settings → Environment Variables**:

- `DATABASE_URL` — Neon production connection string
- `NEXTAUTH_URL` — ваш production-домен (`https://your-domain.com`)
- `NEXTAUTH_SECRET` — длинный случайный секрет (32+ символа)
- `NEXT_PUBLIC_APP_URL` — тот же production-домен
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `ADMIN_EMAIL`

---

## 2) База данных (Neon)

- Убедитесь, что `DATABASE_URL` в Vercel указывает на production БД.
- Миграции применяются автоматически во время деплоя на Vercel благодаря `npm run build` (`prisma migrate deploy` выполняется перед `next build`).
- При необходимости можно дополнительно применить миграции вручную локально:
  - `npx prisma migrate deploy`
- При необходимости заполните тестовые данные:
  - `npx prisma db seed` (только если это уместно для production).

---

## 3) Cloudinary

- Проверьте, что `cloud_name`, `api_key`, `api_secret` корректны.
- В админке загрузите тестовое изображение через `ProjectImageUpload`.
- Убедитесь, что URL изображения сохраняется в проекте.

---

## 4) Email

- Проверьте, что SMTP-провайдер принимает `EMAIL_FROM`.
- Нажмите «Тест SMTP» в админке.
- Отправьте заявку из карточки проекта и проверьте:
  - письмо продавцу;
  - письмо клиенту.

---

## 5) Smoke test после деплоя

- Публичная часть:
  - `/` открывается;
  - `/projects` и `/projects/[slug]` открываются;
  - отправка заявки работает.
- Админка:
  - вход admin/seller;
  - CRUD проектов;
  - загрузка изображения;
  - смена статуса заявки;
  - смена ролей пользователей.

---

## 6) Минимум перед публичным анонсом

- Поменять тестовые пароли/аккаунты.
- Убедиться, что `.env.local` не в git.
- Проверить, что demo-domain для email не используется в production.
- Включить мониторинг ошибок (например, Sentry) — по возможности.
