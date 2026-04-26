import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Mail, MessageCircle, ExternalLink } from "lucide-react";
import { TiltCard } from "@/components/home/TiltCard";

const stats = [
  { label: "проектов", value: "12+" },
  { label: "довольных клиентов", value: "98%" },
  { label: "технологий в стеке", value: "7" },
];

const techStack = [
  "React",
  "Next.js",
  "PostgreSQL",
  "FastAPI",
  "TypeScript",
  "Vercel",
  "Prisma",
];

const reviews = [
  {
    name: "CEO стартапа",
    text: "Система запустилась в срок. Качество архитектуры и скорость внедрения превзошли ожидания.",
  },
  {
    name: "CTO продуктовой компании",
    text: "Получили устойчивую, расширяемую платформу. Код чистый, поддержка прозрачная и быстрая.",
  },
];

export default async function HomePage() {
  const featuredProjectsRaw = await prisma.project.findMany({
    where: { published: true, featured: true },
    include: { category: true },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
  const featuredProjects = [...featuredProjectsRaw]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const parallaxStyle = {
    backgroundImage:
      "radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.28), transparent 40%), radial-gradient(circle at 80% 30%, hsl(var(--primary) / 0.15), transparent 35%)",
    backgroundAttachment: "fixed" as const,
  };

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden px-4 py-24 sm:py-28" style={parallaxStyle}>
        <div className="container mx-auto text-center fade-up">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Fullstack-разработка и <span className="text-primary">AI-решения</span> под ваш бизнес
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Создаю и внедряю масштабируемые digital-продукты: от витрин и CRM до AI-сервисов с продуманной архитектурой.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row sm:justify-center">
            <Link href="/projects" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto justify-center")}>
              Смотреть проекты
            </Link>
            <Link href="#contact" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto justify-center")}>
              Связаться
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((item, idx) => (
            <Card key={item.label} className={`fade-up delay-${(idx + 1) * 100}`}>
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{item.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{item.label}</CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2 fade-up delay-200">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Избранные проекты</h2>
          <Link href="/projects" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Все проекты
          </Link>
        </div>
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {featuredProjects.map((project, idx) => (
              <TiltCard key={project.title}>
                <Card className={`h-full ${idx ? `delay-${(idx + 1) * 100}` : ""}`}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {project.category?.name ?? "IT-проект"}
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col space-y-4">
                    <p className="text-xl font-semibold text-primary">{formatPrice(project.price)}</p>
                    <p className="min-h-[72px] text-sm text-muted-foreground">
                      {project.description.length > 140
                        ? `${project.description.slice(0, 140)}...`
                        : project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto pt-4 flex gap-2">
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(buttonVariants({ size: "sm" }), "flex-1 justify-center")}
                      >
                        Демо
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className={cn(buttonVariants({ size: "sm" }), "flex-1 justify-center opacity-50")}
                      >
                        Демо
                      </button>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      className={cn(buttonVariants({ size: "sm", variant: "outline" }), "flex-1 justify-center")}
                    >
                      Подробнее
                    </Link>
                  </CardFooter>
                </Card>
              </TiltCard>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Пока нет избранных проектов. Добавьте их в админ-панели.
            </CardContent>
          </Card>
        )}
      </section>

      <section id="contact" className="container mx-auto px-4 py-12">
        <Card className="fade-up">
          <CardHeader>
            <CardTitle className="text-2xl">О студии / разработчике</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Делаю упор на масштабируемую архитектуру, чистый код и предсказуемый релиз-процесс. Практический опыт — от MVP до production-систем с интеграцией AI.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://github.com/Fara-Neo" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                <ExternalLink className="h-4 w-4" /> GitHub
              </a>
              <a href="https://t.me/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                <MessageCircle className="h-4 w-4" /> Telegram
              </a>
              <a href="mailto:hello@itshowcase.dev" className="inline-flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" /> hello@itshowcase.dev
              </a>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="mailto:hello@itshowcase.dev" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              Написать напрямую
            </Link>
          </CardFooter>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-14 pt-4">
        <h2 className="mb-6 text-2xl font-bold">Отзывы</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((review, idx) => (
            <Card key={review.name} className={`fade-up delay-${(idx + 1) * 100}`}>
              <CardContent className="pt-4">
                <p className="mb-2 text-yellow-500">★★★★★</p>
                <p className="text-muted-foreground">{review.text}</p>
                <p className="mt-3 text-sm font-semibold">{review.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
