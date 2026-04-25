# ARCHITECTURE

> Архитектура IT Project Showcase — Next.js 14 App Router, feature-based структура, PostgreSQL + Prisma.

---

## 1. Структура папок

```
project-root/
├── app/                          # Next.js App Router — страницы и API
│   ├── (auth)/                   # Route group: страницы авторизации (не влияет на URL)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                   # Route group: основной публичный сайт
│   │   ├── layout.tsx            # Общий layout с Header и Footer
│   │   ├── page.tsx              # Главная страница (Hero + каталог)
│   │   ├── projects/
│   │   │   ├── page.tsx          # Каталог проектов с фильтрацией
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Страница отдельного проекта
│   │   └── about/
│   │       └── page.tsx
│   ├── admin/                    # Административная панель (защищена middleware)
│   │   ├── layout.tsx            # Layout с сайдбаром админа
│   │   ├── page.tsx              # Дашборд: статистика
│   │   ├── projects/
│   │   │   ├── page.tsx          # Список всех проектов
│   │   │   ├── new/page.tsx      # Форма создания проекта
│   │   │   └── [id]/edit/page.tsx
│   │   ├── requests/
│   │   │   └── page.tsx          # Управление заявками
│   │   └── users/
│   │       └── page.tsx          # Управление пользователями
│   ├── api/                      # API Routes (Next.js Route Handlers)
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth handler
│   │   ├── projects/
│   │   │   ├── route.ts          # GET /api/projects, POST /api/projects
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PATCH, DELETE /api/projects/:id
│   │   ├── requests/
│   │   │   └── route.ts          # POST /api/requests (создание заявки)
│   │   ├── upload/
│   │   │   └── route.ts          # POST /api/upload (Cloudinary)
│   │   └── users/
│   │       └── route.ts          # GET /api/users (только admin)
│   ├── globals.css               # Глобальные стили, CSS-переменные тем
│   └── layout.tsx                # Root layout: Providers, ThemeProvider, Toaster
│
├── components/                   # Переиспользуемые UI-компоненты
│   ├── ui/                       # shadcn/ui компоненты (auto-generated, не редактировать)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   └── ...
│   ├── layout/                   # Структурные компоненты
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AdminSidebar.tsx
│   │   └── MobileNav.tsx
│   ├── projects/                 # Feature: проекты
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── ProjectForm.tsx
│   │   └── ProjectImageUpload.tsx
│   ├── requests/                 # Feature: заявки
│   │   ├── RequestForm.tsx
│   │   └── RequestStatusBadge.tsx
│   ├── auth/                     # Feature: авторизация
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── UserMenu.tsx
│   └── shared/                   # Общие переиспользуемые компоненты
│       ├── ThemeToggle.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── ConfirmDialog.tsx
│
├── lib/                          # Утилиты и конфигурация
│   ├── prisma.ts                 # Singleton Prisma Client
│   ├── auth.ts                   # NextAuth config (providers, callbacks, JWT)
│   ├── cloudinary.ts             # Cloudinary SDK setup
│   ├── mailer.ts                 # Nodemailer транспорт и шаблоны писем
│   ├── validations.ts            # Zod-схемы (проект, заявка, пользователь)
│   └── utils.ts                  # cn(), formatDate(), formatPrice(), slugify()
│
├── hooks/                        # Кастомные React-хуки
│   ├── useProjects.ts            # Fetch + фильтрация проектов
│   ├── useRequests.ts            # Fetch заявок (для продавца и админа)
│   └── useDebounce.ts            # Дебаунс для поиска
│
├── types/                        # TypeScript типы и интерфейсы
│   ├── index.ts                  # Re-export всех типов
│   ├── project.ts
│   ├── request.ts
│   └── user.ts
│
├── prisma/                       # Схема и миграции БД
│   ├── schema.prisma             # Модели: User, Project, Request, Category
│   └── migrations/               # Автогенерируемые SQL-миграции
│
├── public/                       # Статические файлы
│   ├── images/
│   └── icons/
│
├── middleware.ts                 # Защита роутов (проверка сессии + роли)
├── next.config.ts                # Конфигурация Next.js
├── tailwind.config.ts            # Tailwind + shadcn/ui токены
├── tsconfig.json
└── .env.local                    # Переменные окружения (локально, не в git)
```

---

## 2. Основные компоненты

| Компонент | Путь | Ключевые Props | Ответственность |
|---|---|---|---|
| `ProjectCard` | `components/projects/ProjectCard.tsx` | `project: Project` | Карточка проекта в каталоге: изображение, название, цена, категория, кнопка «Подробнее» |
| `ProjectGrid` | `components/projects/ProjectGrid.tsx` | `projects: Project[]`, `isLoading: boolean` | Сетка карточек с поддержкой skeleton-лоадеров |
| `ProjectFilters` | `components/projects/ProjectFilters.tsx` | `onFilterChange: (filters) => void` | Фильтры каталога: категория, ценовой диапазон, поиск по названию |
| `ProjectForm` | `components/projects/ProjectForm.tsx` | `initialData?: Project`, `onSuccess: () => void` | Универсальная форма создания/редактирования проекта (react-hook-form + zod) |
| `RequestForm` | `components/requests/RequestForm.tsx` | `projectId: string`, `projectTitle: string` | Форма заявки на проект: имя, email, телефон, сообщение |
| `Header` | `components/layout/Header.tsx` | — | Навигация, логотип, ThemeToggle, UserMenu, мобильный бургер |
| `AdminSidebar` | `components/layout/AdminSidebar.tsx` | — | Боковое меню админ-панели с иконками и активным состоянием |
| `ThemeToggle` | `components/shared/ThemeToggle.tsx` | — | Кнопка переключения light/dark через `next-themes` |
| `UserMenu` | `components/auth/UserMenu.tsx` | `user: Session['user']` | Дропдаун с аватаром, ссылками на профиль и выходом |
| `RequestStatusBadge` | `components/requests/RequestStatusBadge.tsx` | `status: RequestStatus` | Цветной бейдж статуса заявки (`new`, `in_review`, `completed`, `rejected`) |
| `ConfirmDialog` | `components/shared/ConfirmDialog.tsx` | `onConfirm`, `title`, `description` | Модальное окно подтверждения деструктивных действий |
| `ProjectImageUpload` | `components/projects/ProjectImageUpload.tsx` | `onUpload: (url: string) => void` | Загрузка изображений через `/api/upload` → Cloudinary |

---

## 3. Потоки данных

### 3.1 Просмотр каталога (публичный пользователь)

```
Браузер (Client Component)
    │
    ├─ GET /projects (SSR page.tsx)
    │       │
    │       └─ lib/prisma.ts → PostgreSQL
    │               └─ SELECT projects WHERE published = true
    │                       │
    │               ← [{id, title, slug, price, imageUrl, category}]
    │
    └─ Рендер ProjectGrid → ProjectCard[]
            │
            └─ Клик «Подробнее» → /projects/[slug]
                    │
                    └─ generateStaticParams() + ISR (revalidate: 60s)
```

### 3.2 Отправка заявки

```
Пользователь заполняет RequestForm
    │
    ├─ react-hook-form + zod (клиентская валидация)
    │
    └─ POST /api/requests
            │
            ├─ Серверная валидация (zod schema)
            ├─ prisma.request.create({...})
            ├─ nodemailer → email продавцу ("Новая заявка на проект X")
            ├─ nodemailer → email клиенту ("Ваша заявка принята")
            └─ 201 Created
                    │
                    └─ react-hot-toast: «Заявка успешно отправлена»
```

### 3.3 Публикация проекта (продавец)

```
Seller открывает /admin/projects/new
    │
    ├─ middleware.ts проверяет сессию NextAuth + role === 'seller' | 'admin'
    │
    ├─ Заполняет ProjectForm
    │       │
    │       ├─ Загрузка изображения:
    │       │       POST /api/upload
    │       │           └─ cloudinary.uploader.upload() → returns { secure_url }
    │       │
    │       └─ Submit формы:
    │               POST /api/projects
    │                   ├─ Валидация + проверка роли
    │                   ├─ slugify(title) → уникальный slug
    │                   ├─ prisma.project.create({...})
    │                   └─ 201 Created → redirect /admin/projects
```

### 3.4 Авторизация

```
Пользователь → /login → LoginForm
    │
    └─ signIn('credentials', { email, password })
            │
            └─ NextAuth authorize()
                    ├─ prisma.user.findUnique({ where: { email } })
                    ├─ bcrypt.compare(password, user.hashedPassword)
                    └─ Возвращает { id, name, email, role }
                            │
                            └─ JWT токен → httpOnly cookie
                                    │
                                    └─ useSession() доступен в любом компоненте
```

---

## 4. Паттерны и принципы

### Feature-based организация
Компоненты сгруппированы по фичам (`projects/`, `requests/`, `auth/`), а не по типу (`components/forms/`, `components/lists/`). Это упрощает навигацию по коду при росте команды и позволяет изолированно разрабатывать и тестировать каждую функциональность.

### Server Components по умолчанию
Все компоненты являются серверными (RSC) по умолчанию. `'use client'` добавляется явно только там, где необходимы интерактивность, хуки или браузерные API (формы, фильтры, переключатель темы).

### Composition Pattern
Крупные страницы собираются из мелких атомарных компонентов. Например, страница каталога: `ProjectFilters` + `ProjectGrid` → `ProjectCard`. Бизнес-логика вынесена в хуки и серверные функции, UI-компоненты максимально «глупые».

### Кастомные хуки
- `useProjects(filters)` — инкапсулирует fetch, состояние загрузки и фильтрацию.
- `useRequests()` — получение и обновление статусов заявок.
- `useDebounce(value, delay)` — задержка перед отправкой поискового запроса.

### Валидация через Zod
Единые схемы в `lib/validations.ts` используются как на клиенте (react-hook-form resolver), так и на сервере (API-роуты). Исключает дублирование логики валидации.

### Singleton Prisma Client
`lib/prisma.ts` экспортирует один экземпляр `PrismaClient` с сохранением в `global` объекте в dev-режиме — предотвращает исчерпание пула соединений при hot-reload.

---

## 5. Масштабируемость: задел под биржу

Следующие части архитектуры намеренно заложены с расчётом на расширение до полноценной биржи:

### Роли пользователей
Модель `User` содержит поле `role: UserRole` с enum `guest | user | seller | admin`. Middleware и API-роуты проверяют роль на каждый запрос. Роль `seller` уже имеет собственный дашборд и может быть расширена правами управления балансом, статистикой продаж и выводом средств.

### Модели Prisma (закомментированные расширения)
В `prisma/schema.prisma` оставлены закомментированные модели для второго этапа:
- `Transaction` — хранение платёжных транзакций (Stripe Payment Intent ID, статус, сумма).
- `Review` — отзывы покупателей о проектах (rating, comment, authorId, projectId).
- `Message` — внутренний мессенджер (senderId, receiverId, body, readAt).
- `Escrow` — депонирование средств до завершения сделки.

### API-заглушки
- `POST /api/payments/create-intent` — заготовка под Stripe PaymentIntent, возвращает 501 Not Implemented с сообщением «Payment integration coming soon».
- `GET /api/seller/dashboard` — заготовка под статистику продавца.

### Конфигурация окружения
Переменные `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` присутствуют в `.env.example` и закомментированы, готовы к активации.

### Структура URL
Маршрутизация спроектирована с учётом будущих разделов: `/seller/`, `/buyer/`, `/escrow/`, `/reviews/` — ни один из существующих роутов не конфликтует с этими путями.
