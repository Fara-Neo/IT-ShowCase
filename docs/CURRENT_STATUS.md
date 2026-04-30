# CURRENT STATUS

> Проект на этапе **Этап 1 — активная разработка MVP**.
> Инфраструктура полностью поднята, репозиторий опубликован на GitHub. Обновлено: 30 апреля 2026.

---

## 1. Что уже сделано

### Проектирование и документация
- [x] Определена концепция продукта: портфолио-шоурум с заделом под биржу IT-проектов
- [x] Сформулированы краткосрочные и долгосрочные цели
- [x] Определена целевая аудитория и ключевые метрики успеха
- [x] Выбран и обоснован технологический стек (Next.js, PostgreSQL, Prisma, NextAuth, Tailwind, shadcn/ui, Cloudinary)
- [x] Спроектирована архитектура приложения: структура папок, компонентная модель, потоки данных
- [x] Определена система ролей: `guest`, `user`, `seller`, `admin`
- [x] Описан задел под масштабирование: закомментированные модели, API-заглушки, роли
- [x] Сформирован дизайн-гайд: цветовая палитра (light/dark), типографика, анимации, breakpoints
- [x] Написана документация: `PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`, `TECH_STACK.md`, `CURRENT_STATUS.md`
- [x] Подготовлен `.env.example` с полным списком переменных окружения

### Инфраструктура
- [x] Репозиторий создан: **https://github.com/Fara-Neo/IT-ShowCase**
- [x] Инициализация проекта Next.js 14 (App Router, TypeScript, Tailwind)
- [x] Первый коммит запушен в ветку `main` (94 файла, 15 367 строк)
- [x] Настройка CI/CD (GitHub Actions: `npm ci` + `prisma validate/generate/migrate deploy` + `lint` + `build`)
- [x] Настройка Ruleset для `main` с required status check

---

## 2. Завершённые задачи

| Задача | Дата | Результат |
|---|---|---|
| Определение концепции и целей продукта | апрель 2025 | `PROJECT_OVERVIEW.md` |
| Проектирование архитектуры и стека | апрель 2025 | `ARCHITECTURE.md`, `TECH_STACK.md` |
| Дизайн-система (цвета, типографика, адаптив) | апрель 2025 | Описана в `PROJECT_OVERVIEW.md` |
| Полная документация проекта v1 | апрель 2025 | Папка `/docs`, 4 файла |
| Инициализация Next.js 14 + зависимости | 25 апреля 2026 | `package.json`, `next.config.mjs` |
| Настройка Tailwind + shadcn/ui + дизайн-токены | 25 апреля 2026 | `tailwind.config.ts`, `globals.css` |
| Prisma схема v1 + первая миграция | 25 апреля 2026 | `prisma/schema.prisma`, миграция `20260425145633_init` |
| Подключение PostgreSQL | 25 апреля 2026 | `DATABASE_URL` в `.env.local` |
| Seed-данные | 25 апреля 2026 | 5 категорий, 2 тестовых аккаунта, 5 проектов |
| NextAuth.js (credentials + JWT + роли) | 25 апреля 2026 | `lib/auth.ts`, `/api/auth/[...nextauth]` |
| Регистрация пользователей | 25 апреля 2026 | `/api/auth/register`, `RegisterForm` |
| Middleware защита роутов | 25 апреля 2026 | `middleware.ts` |
| Полная структура компонентов | 25 апреля 2026 | `components/` — 28 файлов |
| API-роуты (projects, requests, upload, users) | 25 апреля 2026 | `app/api/` — 7 роутов |
| Кастомные хуки | 25 апреля 2026 | `useProjects`, `useRequests`, `useDebounce` |
| Создание GitHub-репозитория + первый коммит | 25 апреля 2026 | [Fara-Neo/IT-ShowCase](https://github.com/Fara-Neo/IT-ShowCase) |
| Исправление совместимости форм (react-hook-form) | 25 апреля 2026 | `Input`, `Textarea`, `Button` → нативные элементы с `forwardRef` |
| **Каталог проектов `/projects`** | 25 апреля 2026 | `ProjectCatalog` + SSR категорий из БД + `ProjectFilters` + `ProjectGrid` |
| Удаление дефолтной страницы Next.js | 25 апреля 2026 | `app/page.tsx` удалён, маршрут `/` → `app/(main)/page.tsx` |
| Подключение `MobileNav` в `Header` | 25 апреля 2026 | Бургер-меню на мобилке, кнопки скрыты на `< md` |
| Адаптив главной страницы (375px) | 25 апреля 2026 | Hero-кнопки в `flex-col` на мобилке, полная ширина |
| UX-полировка: hover, transitions, scroll | 25 апреля 2026 | `smooth scroll`, `duration-250/300 ease-out` глобально, `shadow-xl` на карточках |
| Ребрендинг: «IT Showcase» → «IT ShowCase» | 25 апреля 2026 | `Header`, `Footer`, `layout.tsx`, `about/page.tsx` |
| Фон мобильного меню | 25 апреля 2026 | `bg-background/95 backdrop-blur-md shadow-xl` + анимация slide-down |
| Редизайн главной страницы | 25 апреля 2026 | Новые блоки: Hero, статистика, стек, избранные проекты, отзывы, контакты |
| Перенос стартового Hero в `/about` | 25 апреля 2026 | Контент старой главной перенесён в `app/(main)/about/page.tsx` |
| Demo URL для проектов | 25 апреля 2026 | Добавлено поле `demoUrl` в Prisma, API, типы, формы и seed |
| Избранные проекты на SSR | 25 апреля 2026 | Главная получает 3 проекта напрямую из БД (`prisma.project.findMany`) |
| Кнопки карточек избранного | 25 апреля 2026 | `Демо` ведёт на `demoUrl`, `Подробнее` ведёт на `/projects/[slug]` |
| Багфиксы dev-среды | 25 апреля 2026 | Исправлены ошибки `Unsupported Server Component type` и битый кэш `.next` |
| Страница проекта `/projects/[slug]` | 26 апреля 2026 | SSR-деталка проекта из Prisma, `RequestForm`, похожие проекты, metadata + OG/Twitter |
| Admin CRUD проектов (UI) | 26 апреля 2026 | Рабочие страницы `new/edit/list`, загрузка изображения через `/api/upload`, удаление проекта |
| Избранные проекты через админ-панель | 26 апреля 2026 | Добавлен флаг `featured` в Prisma + миграция, переключатель в админ-таблице и в форме проекта |
| Главная страница: показ избранных | 26 апреля 2026 | Блок «Избранные проекты» берёт `published + featured`, выводит случайные 3 проекта |
| UX карточки проекта `/projects/[slug]` | 26 апреля 2026 | Увеличены внутренние отступы в правой карточке с CTA «Открыть демо» |
| Admin-панель заявок | 26 апреля 2026 | Реализованы список, фильтр по статусу, смена статуса и API `GET/PATCH` для заявок |
| Admin-панель пользователей | 26 апреля 2026 | Реализованы список пользователей и смена роли через API (с защитой от снятия admin у себя) |
| SMTP тестирование в админке | 26 апреля 2026 | Добавлен endpoint `POST /api/admin/mail-test` и кнопка «Тест SMTP» в `admin/requests` |
| CI workflow в GitHub Actions | 28 апреля 2026 | Добавлен `.github/workflows/ci.yml`, включены проверки install/prisma/lint/build |
| Стабилизация `npm ci` в CI | 28 апреля 2026 | Обновлён lockfile и зафиксирован `preact` для консистентной установки зависимостей |
| Фикс type-check в `api/requests` | 28 апреля 2026 | Использован enum `RequestStatus` из Prisma, сборка `next build` проходит в CI |
| SMTP в dev-окружении (Mailtrap Sending) | 28 апреля 2026 | Заполнены SMTP env, подтверждена отправка через «Тест SMTP» и форму заявки |
| Rate limiting для формы заявки | 28 апреля 2026 | В `POST /api/requests` добавлены лимиты по IP и email с ответом `429` |
| Улучшение обработки ошибок SMTP/заявок | 28 апреля 2026 | Добавлены `400/429/502`, диагностические сообщения и локализованные уведомления в UI |
| Переход `/api/upload` на signed upload | 29 апреля 2026 | Добавлена выдача подписи на сервере и прямая загрузка изображения в Cloudinary из клиента |
| Cloudinary e2e тест загрузки | 29 апреля 2026 | Исправлен `cloud_name`, проверена успешная загрузка изображений через signed upload в админ-форме |
| Optional slug в форме проекта | 29 апреля 2026 | Исправлена валидация: пустой `slug` больше не блокирует сохранение |
| Deploy readiness (auth providers) | 29 апреля 2026 | `GoogleProvider` подключается только при наличии OAuth env-переменных |
| Deploy checklist | 29 апреля 2026 | Добавлен `docs/DEPLOY_CHECKLIST.md` с pre-deploy и post-deploy smoke-check |
| Prisma migrate на Vercel build | 30 апреля 2026 | В `package.json` добавлен `prisma migrate deploy` в `npm run build` для автоприменения миграций при деплое |
| Валидация `ProjectForm` + production build | 30 апреля 2026 | Упрощена Zod-схема проекта и типизация формы, чтобы `next build` проходил без конфликтов resolver типов |
| Neon production БД | 30 апреля 2026 | Подключён облачный Postgres (Neon), применены миграции и выполнен `db seed` для тестовых данных |
| Деплой на Vercel (в процессе) | 30 апреля 2026 | Проект подключён к GitHub, добавлены production env и домен `itshowcase.online`; выполняется настройка сборки и финальный smoke-check |
| Временное отключение онбординга продавцов в UI | 30 апреля 2026 | Убраны CTA/ссылки `Регистрация` и `Стать продавцом`; на `/about` обновлён визуальный блок описания |
| OAuth (Google) подключение для production | 30 апреля 2026 | Подготовлены OAuth redirect/origin для `itshowcase.online` и локальной разработки; определён обязательный набор env для Vercel |
| Диагностика авторизации на проде | 30 апреля 2026 | Выявлена критичная причина редиректов на `/login`: отсутствовал `NEXTAUTH_SECRET` в Vercel Production |
| DNS-подготовка Mailtrap sending domain | 30 апреля 2026 | Подготовлены и добавляются DNS записи (CNAME/DKIM/DMARC) для верификации домена отправителя |
| Финальная полировка текста на `/about` | 30 апреля 2026 | Первый подзаголовочный абзац возвращён к базовому виду; основной абзац про IT ShowCase оформлен как акцентный визуальный блок |
| Redis rate limiting для заявок | 30 апреля 2026 | Добавлен Upstash Redis клиент, лимиты `POST /api/requests` перенесены в Redis с fallback на in-memory при отсутствии env |
| Smoke-тест rate limit после миграции | 30 апреля 2026 | Локально подтверждён порог по email: 3 успешных запроса подряд, 4-й получает `429` |
| Фикс Vercel deploy для Prisma migrate (Neon) | 30 апреля 2026 | Добавлен `directUrl` в Prisma datasource и `DIRECT_URL` в `.env.example`, чтобы `prisma migrate deploy` использовал direct connection вместо pooler |

---

## 3. Текущий этап (Этап 1 — MVP: шоурум + заявки)

### Публичная часть
- [x] Layout с Header и Footer (`components/layout/`)
- [x] Главная страница — полный лендинг с избранными проектами и отзывами (`app/(main)/page.tsx`)
- [x] **Каталог проектов `/projects`** — подключён к БД, отображает `ProjectGrid` + `ProjectFilters` с категориями
- [x] **Страница проекта `/projects/[slug]`** — SSR-деталка с контентом, `RequestForm`, похожими проектами и SEO metadata
- [x] Страница `/about` — перенесён контент стартового Hero и описание платформы
- [x] Временный UX-режим без регистрации — кнопки/ссылки `Регистрация` убраны из `Header`, `MobileNav` и `LoginForm`; CTA `Стать продавцом` убран из `/about`
- [x] Полировка контента `/about` — обновлён акцентный блок с текстом о платформе для более чистой визуальной иерархии

### Административная панель
- [x] Layout с `AdminSidebar`
- [x] Дашборд (заглушка со статистикой)
- [x] **Список проектов** — таблица, edit/delete, подтверждение удаления, быстрый toggle «В избранное»
- [x] **Форма создания/редактирования проекта** — `ProjectForm` + `ProjectImageUpload` + категории/стек/публикация/избранное
- [x] **Управление заявками** — список, смена статуса, фильтрация
- [x] **Управление пользователями** — список, смена роли

### Сервисы
- [x] Cloudinary — signed upload реализован, ключи заполнены и загрузка протестирована end-to-end
- [x] Nodemailer / Mailtrap — SMTP настроен, протестированы endpoint `POST /api/admin/mail-test` и отправка из формы заявки
- [~] OAuth (Google) — провайдер подключается условно по env, в production настроены redirect URI; требуется финальная проверка входа после обновления env
- [~] Redis/Upstash rate limiting — серверная логика переведена на Redis (с fallback), локальный smoke-тест пройден; требуется прод-проверка на Vercel
- [~] Prisma migrate на Vercel + Neon — добавлен `DIRECT_URL` для миграций; нужно заполнить env в Vercel и подтвердить успешный деплой
- [ ] Production-хостинг — Vercel + кастомный домен: env перенесены, идёт проверка успешного деплоя и маршрутов на проде

---

## 4. План следующих этапов

### Этап 2 — SEO, UX-полировка, онбординг продавцов (2–3 недели)
SEO: `generateMetadata()`, OG-теги, `sitemap.xml`, JSON-LD. Верификация email, восстановление пароля. Профиль продавца (публичная страница). Личный кабинет пользователя: история заявок. Категории проектов через админ-панель.

### Этап 3 — Онлайн-оплата (3–4 недели)
Интеграция платёжного провайдера (Stripe / ЮКасса). PaymentIntent при покупке, webhook-обработчик подтверждения. История транзакций. Комиссия платформы (take rate).

### Этап 4 — Социальные функции и рейтинги (2–3 недели)
Отзывы и оценки (1–5 звёзд). Избранное (wishlists). Внутренние уведомления. Базовый мессенджер покупатель↔продавец.

### Этап 5 — Полноценная биржа (1–2 месяца)
Escrow-механизм. Полнотекстовый поиск. Публичный API. Аналитический дашборд. Программа аффилиатов.

---

## 5. Known Issues

| # | Проблема | Приоритет | Статус / Комментарий |
|---|---|---|---|
| 1 | Загрузка файлов >4,5 МБ через Vercel Serverless Functions | High | **Решено:** реализована прямая signed upload загрузка в Cloudinary (без проксирования файла через serverless API) |
| 2 | Отсутствие устойчивого rate limiting на форме заявки в multi-instance окружении | High | **В основном решено:** лимит в `POST /api/requests` переведён на Redis/Upstash (IP + email, окно 1 час, `429`) с fallback; требуется финальная проверка на production |
| 3 | FOUC при смене темы в Safari | Low | Решено: `next-themes` с `attribute="class"` + `suppressHydrationWarning` |
| 4 | Prisma Client в Edge Runtime | Low | Решено: `middleware.ts` использует только JWT-проверку через `next-auth/jwt` |
| 5 | `@base-ui/react` компоненты несовместимы с `react-hook-form` | — | **Исправлено:** `Input`, `Textarea`, `Button` переписаны на нативные элементы |
| 6 | git / gh CLI отсутствуют в системном PATH | Low | Workaround: использовать git из VS 2019 Build Tools; добавить в PATH постоянно |
| 7 | Задержка появления status checks в Ruleset после первого прогона CI | Low | Решено: после успешного run check добавлен в required checks для `main` |
| 8 | Ошибка Vercel: «No Output Directory named public» | Medium | **Причина:** проект настроен не как Next.js (или задан неверный Output Directory). Для Next.js Output Directory должен быть по умолчанию; Framework Preset — Next.js |
| 9 | После логина возможен возврат на `/login` при открытии `/admin` | High | **Основная причина найдена:** отсутствует `NEXTAUTH_SECRET` в Vercel Production, из-за чего middleware не получает валидный JWT токен из cookie |
| 10 | Mailtrap domain status: Unverified | Medium | В процессе: на стороне DNS (reg.ru) добавляются записи CNAME/DKIM/DMARC для подтверждения sending domain |
| 11 | Vercel deploy падает на `prisma migrate deploy` с P1002 (advisory lock timeout) | High | **Причина найдена:** миграции шли через Neon pooler URL. **Фикс в коде:** добавлен `directUrl`/`DIRECT_URL`; требуется задать direct connection string в Vercel env |

---

## 6. Тестовые аккаунты (dev)

| Роль | Email | Пароль |
|---|---|---|
| admin | `admin@itshowcase.dev` | `Admin123!` |
| seller | `kadirov987@gmail.com` | `Seller123!` |

---

## 7. Следующие шаги для разработчика

1. **Стабилизировать auth на проде** — добавить/проверить `NEXTAUTH_SECRET` в Vercel Production, выполнить Redeploy, проверить `/api/auth/session`, логин и доступ к `/admin`.
2. **Завершить деплой на Vercel** — добавить `DIRECT_URL` (Neon direct, без pooler) для миграций Prisma; Framework Preset: Next.js; Output Directory: по умолчанию; `NEXTAUTH_URL`/`NEXT_PUBLIC_APP_URL` = канонический URL домена; smoke-check публичных страниц и админки.
3. **Завершить Mailtrap DNS verification** — дождаться propagation записей, подтвердить домен в Mailtrap, повторно проверить отправку из `POST /api/admin/mail-test`.
4. **Расширить CI/CD** — добавить отдельные jobs для тестов и (опционально) авто-деплоя.
5. **Проверка Redis rate limiting на production** — подтвердить срабатывание лимита на Vercel (включая IP/email кейсы) и отсутствие регрессий по отправке заявок.
6. **Обновлять этот файл** после каждой значимой задачи.

> **Правило:** Этот документ — живой. Устаревшая документация хуже её отсутствия.
