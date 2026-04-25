# TECH STACK

> Обоснование технологических решений, переменные окружения и инструкции по развёртыванию.

---

## 1. Основной стек

| Технология | Версия | Обоснование выбора |
|---|---|---|
| **Next.js** | 14.x (App Router) | SSR/SSG/ISR из коробки — критично для SEO страниц проектов. App Router даёт React Server Components, что снижает JS-бандл. File-system роутинг ускоряет разработку. Встроенные API Routes исключают необходимость отдельного бэкенда на старте. |
| **TypeScript** | 5.x | Строгая типизация предотвращает класс ошибок на этапе компиляции. Автодополнение ускоряет разработку. Prisma генерирует типы из схемы — сквозная типобезопасность от БД до UI. |
| **PostgreSQL** | 15.x | Реляционная БД с поддержкой JSON-полей для гибкости. Зрелая экосистема, надёжная обработка транзакций — важно при переходе к финансовым операциям. Отличная поддержка в Prisma. |
| **Prisma** | 5.x | Type-safe ORM с автогенерацией типов из схемы. Декларативные миграции. Удобный Prisma Studio для просмотра БД. Поддержка всех распространённых СУБД позволяет при необходимости сменить БД без переписывания слоя данных. |
| **NextAuth.js** | 4.x | Де-факто стандарт аутентификации для Next.js. Поддержка credentials, OAuth (Google, GitHub) без дополнительной конфигурации. JWT и session strategies. Простая интеграция с Prisma через `@auth/prisma-adapter`. |
| **TailwindCSS** | 3.x | Utility-first подход устраняет необходимость писать CSS вручную. JIT-компилятор генерирует только используемые классы — минимальный бандл CSS. Встроенная система тёмной темы через `dark:` префикс. Консистентная design-система через `tailwind.config.ts`. |
| **shadcn/ui** | latest | Не библиотека, а набор копируемых компонентов на базе Radix UI + Tailwind. Полный контроль над кодом компонентов. Доступность (a11y) из коробки (Radix UI). Быстрый старт без кастомных CSS. Активно поддерживается сообществом. |
| **Cloudinary** | 2.x SDK | Управляемое хранилище медиа с автоматической оптимизацией изображений (WebP, AVIF), CDN-доставкой и трансформациями на лету (resize, crop, quality). Бесплатный tier достаточен для MVP. Исключает необходимость настраивать S3 + CloudFront на старте. |

---

## 2. Вспомогательные библиотеки

| Библиотека | Версия | Назначение |
|---|---|---|
| **react-hook-form** | 7.x | Производительное управление формами без лишних ре-рендеров. Минимальный бойлерплейт. Нативная интеграция с zod через `@hookform/resolvers`. |
| **zod** | 3.x | Runtime-валидация и парсинг данных с генерацией TypeScript-типов. Единые схемы для клиента и сервера. |
| **nodemailer** | 6.x | Отправка транзакционных email (подтверждение заявки, уведомление продавцу). Работает с любым SMTP-провайдером (Gmail, Mailgun, SendGrid). |
| **framer-motion** | 11.x | Декларативные анимации и переходы между страницами. AnimatePresence для корректной анимации при размонтировании компонентов. |
| **next-themes** | 0.3.x | Переключение тёмной/светлой темы без вспышки (FOUC) за счёт скрипта до гидратации. Синхронизация с системными настройками ОС. |
| **react-hot-toast** | 2.x | Лёгкие toast-уведомления с кастомизируемым стилем и позиционированием. Не требует глобального store. |
| **bcryptjs** | 2.x | Хеширование паролей при регистрации и сравнение при входе. |
| **slugify** | 1.x | Генерация URL-safe slug из названия проекта для SEO-friendly URL. |
| **date-fns** | 3.x | Утилиты форматирования дат (дата публикации, дата заявки). Локализация. |

---

## 3. Переменные окружения

Создайте файл `.env.local` в корне проекта на основе `.env.example`:

```bash
# ============================================================
# DATABASE
# ============================================================
DATABASE_URL="postgresql://user:password@localhost:5432/it_showcase"

# ============================================================
# NEXTAUTH
# ============================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# ============================================================
# OAUTH PROVIDERS (опционально)
# ============================================================
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"

# ============================================================
# CLOUDINARY
# ============================================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ============================================================
# EMAIL (SMTP)
# ============================================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="IT Showcase <your-email@gmail.com>"

# ============================================================
# APP
# ============================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"

# ============================================================
# PAYMENTS (задел — активировать на этапе 3)
# ============================================================
# STRIPE_SECRET_KEY="sk_test_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

> **Важно:** Никогда не коммитьте `.env.local` в репозиторий. Файл добавлен в `.gitignore` по умолчанию.

---

## 4. Локальная установка и запуск

### Требования
- Node.js ≥ 18.17.0
- npm ≥ 9.x или pnpm ≥ 8.x
- PostgreSQL ≥ 14 (локально или Docker)

### Шаги

**1. Клонирование репозитория**
```bash
git clone https://github.com/your-org/it-showcase.git
cd it-showcase
```

**2. Установка зависимостей**
```bash
npm install
# или
pnpm install
```

**3. Настройка переменных окружения**
```bash
cp .env.example .env.local
# Откройте .env.local и заполните все значения
```

**4. Запуск PostgreSQL (если используете Docker)**
```bash
docker run --name it-showcase-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=it_showcase \
  -p 5432:5432 \
  -d postgres:15
```

**5. Применение миграций и генерация Prisma Client**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**6. (Опционально) Заполнение БД тестовыми данными**
```bash
npx prisma db seed
```

**7. Запуск dev-сервера**
```bash
npm run dev
```

Приложение доступно по адресу: [http://localhost:3000](http://localhost:3000)

**8. Просмотр БД через Prisma Studio**
```bash
npx prisma studio
```
Prisma Studio доступен по адресу: [http://localhost:5555](http://localhost:5555)

---

## 5. Деплой

### 5.1 Vercel (рекомендуется для старта)

Vercel — нативная платформа для Next.js, обеспечивает нулевую конфигурацию.

**Шаги:**
1. Создайте аккаунт на [vercel.com](https://vercel.com) и подключите Git-репозиторий.
2. В настройках проекта перейдите в **Settings → Environment Variables** и добавьте все переменные из `.env.local`.
3. Для `NEXTAUTH_URL` установите значение вашего продакшн-домена (`https://your-domain.com`).
4. Для базы данных используйте управляемый PostgreSQL: **Vercel Postgres**, **Supabase**, **Neon** или **Railway** — все поддерживают connection string формата `postgresql://`.
5. Cloudinary и SMTP-настройки добавьте в переменные окружения Vercel аналогично локальным.
6. Деплой запускается автоматически при каждом push в `main`-ветку.

**Важные нюансы Vercel:**
- Функции API имеют ограничение по времени выполнения (10–60 с в зависимости от плана).
- Загрузка файлов через API Routes ограничена 4,5 МБ на запрос — используйте прямую загрузку на Cloudinary через signed upload для обхода этого ограничения.
- ISR (Incremental Static Regeneration) работает из коробки, дополнительной конфигурации не требует.

---

### 5.2 VDS / Выделенный сервер (для production с полным контролем)

**Стек на сервере:** Ubuntu 22.04 LTS, Nginx, PM2, Node.js 18+, PostgreSQL 15.

**Общая последовательность:**

1. **Установка зависимостей на сервере**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs nginx postgresql
   ```

2. **Сборка приложения**
   ```bash
   npm run build
   ```
   Убедитесь, что все переменные окружения заданы на сервере до сборки (или используйте `.env.production`).

3. **Запуск через PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "it-showcase" -- start
   pm2 save
   pm2 startup
   ```

4. **Настройка Nginx как reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **HTTPS через Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

6. **Настройка PostgreSQL**
   - Создайте отдельного пользователя БД с минимально необходимыми правами.
   - Настройте регулярное резервное копирование (`pg_dump` через cron).
   - Ограничьте внешний доступ к порту 5432 через UFW.

7. **CI/CD (рекомендуется)**
   - GitHub Actions: при push в `main` — SSH на сервер → `git pull` → `npm install` → `npx prisma migrate deploy` → `npm run build` → `pm2 restart it-showcase`.

**Переменные окружения на VDS:**
Храните в `/etc/environment` или в `.env.production` (за пределами директории проекта), настроив симлинк. Не передавайте через аргументы командной строки.
