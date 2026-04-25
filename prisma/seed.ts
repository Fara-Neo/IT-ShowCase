import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Категории
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "web" },
      update: {},
      create: { name: "Веб-сайты", slug: "web" },
    }),
    prisma.category.upsert({
      where: { slug: "mobile" },
      update: {},
      create: { name: "Мобильные приложения", slug: "mobile" },
    }),
    prisma.category.upsert({
      where: { slug: "saas" },
      update: {},
      create: { name: "SaaS-решения", slug: "saas" },
    }),
    prisma.category.upsert({
      where: { slug: "ecommerce" },
      update: {},
      create: { name: "Интернет-магазины", slug: "ecommerce" },
    }),
    prisma.category.upsert({
      where: { slug: "automation" },
      update: {},
      create: { name: "Автоматизация", slug: "automation" },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Admin пользователь
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@itshowcase.dev" },
    update: {},
    create: {
      name: "Администратор",
      email: "admin@itshowcase.dev",
      hashedPassword: adminPassword,
      role: "admin",
    },
  });

  // Seller пользователь
  const sellerPassword = await bcrypt.hash("Seller123!", 12);
  const seller = await prisma.user.upsert({
    where: { email: "seller@itshowcase.dev" },
    update: {},
    create: {
      name: "Алексей Разработчик",
      email: "seller@itshowcase.dev",
      hashedPassword: sellerPassword,
      role: "seller",
    },
  });

  console.log(`✅ Created admin: ${admin.email}`);
  console.log(`✅ Created seller: ${seller.email}`);

  // Тестовые проекты
  const projects = [
    {
      title: "CRM-система для малого бизнеса",
      slug: "crm-sistema-dlya-malogo-biznesa",
      description:
        "Полнофункциональная CRM-система для управления клиентами, сделками и задачами. Включает аналитику продаж, историю взаимодействий, интеграцию с email и телефонией. Адаптивный интерфейс, тёмная тема, экспорт данных в Excel.",
      price: 120000,
      demoUrl: "https://demo-crm.itshowcase.dev",
      techStack: ["React", "Node.js", "PostgreSQL", "Redis"],
      categoryId: categories.find((c) => c.slug === "saas")!.id,
      published: true,
    },
    {
      title: "Интернет-магазин одежды",
      slug: "internet-magazin-odezhdy",
      description:
        "Готовый интернет-магазин с каталогом товаров, корзиной, онлайн-оплатой через Stripe и ЮКассу. Система управления заказами, уведомления по email и SMS, личный кабинет покупателя. Интеграция с 1С.",
      price: 85000,
      demoUrl: "https://demo-shop.itshowcase.dev",
      techStack: ["Next.js", "TypeScript", "Prisma", "Stripe"],
      categoryId: categories.find((c) => c.slug === "ecommerce")!.id,
      published: true,
    },
    {
      title: "Мобильное приложение для доставки еды",
      slug: "mobilnoe-prilozhenie-dlya-dostavki-edy",
      description:
        "Кроссплатформенное мобильное приложение для заказа еды с GPS-трекингом курьера в реальном времени. Включает приложение для курьеров, панель ресторана и административный дашборд.",
      price: 250000,
      demoUrl: "https://demo-delivery.itshowcase.dev",
      techStack: ["React Native", "Node.js", "Socket.io", "MongoDB"],
      categoryId: categories.find((c) => c.slug === "mobile")!.id,
      published: true,
    },
    {
      title: "Лендинг с конструктором блоков",
      slug: "lending-s-konstruktorom-blokov",
      description:
        "Современный лендинг-конструктор с drag-and-drop интерфейсом для самостоятельной настройки. 20+ готовых блоков, анимации, SEO-оптимизация, интеграция с формами и аналитикой. Хостинг включён.",
      price: 35000,
      demoUrl: "https://demo-landing.itshowcase.dev",
      techStack: ["Vue.js", "TailwindCSS", "Vite"],
      categoryId: categories.find((c) => c.slug === "web")!.id,
      published: true,
    },
    {
      title: "Система автоматизации HR-процессов",
      slug: "sistema-avtomatizacii-hr-processov",
      description:
        "Платформа для автоматизации найма: публикация вакансий, воронка кандидатов, автоматическая проверка резюме с AI, расписание собеседований, электронный документооборот.",
      price: 180000,
      demoUrl: "https://demo-hr.itshowcase.dev",
      techStack: ["Python", "FastAPI", "React", "OpenAI"],
      categoryId: categories.find((c) => c.slug === "automation")!.id,
      published: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        ...project,
      },
      create: {
        ...project,
        authorId: seller.id,
      },
    });
  }

  console.log(`✅ Created ${projects.length} projects`);
  console.log("\n🎉 Seed complete!");
  console.log("\n📋 Test accounts:");
  console.log("   Admin:  admin@itshowcase.dev  / Admin123!");
  console.log("   Seller: seller@itshowcase.dev / Seller123!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
