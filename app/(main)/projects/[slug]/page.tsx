import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestForm } from "@/components/requests/RequestForm";
import { prisma } from "@/lib/prisma";
import { cn, formatDate, formatPrice } from "@/lib/utils";

interface ProjectPageProps {
  params: { slug: string };
}

export const revalidate = 60;

async function getPublicProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: {
      slug,
      published: true,
    },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

async function getRelatedPublicProjects(params: {
  projectId: string;
  categoryId: string | null;
}) {
  const where = params.categoryId
    ? {
        published: true,
        id: { not: params.projectId },
        categoryId: params.categoryId,
      }
    : {
        published: true,
        id: { not: params.projectId },
      };

  return prisma.project.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getPublicProjectBySlug(params.slug);
  const projectUrl = `/projects/${params.slug}`;

  if (!project) {
    return {
      title: "Проект не найден",
      description: "Запрошенный проект не существует или недоступен.",
      robots: { index: false, follow: false },
    };
  }

  const description = project.description.slice(0, 160);
  const title = `${project.title} | IT ShowCase`;

  return {
    title,
    description,
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title,
      description,
      url: projectUrl,
      siteName: "IT ShowCase",
      type: "website",
      locale: "ru_RU",
      images: project.imageUrl
        ? [
            {
              url: project.imageUrl,
              alt: project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getPublicProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedPublicProjects({
    projectId: project.id,
    categoryId: project.categoryId,
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-10">
      <div className="mb-6">
        <Link
          href="/projects"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-0")}
        >
          ← Назад в каталог
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border bg-card">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
                priority
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted text-sm text-muted-foreground">
                Изображение проекта не добавлено
              </div>
            )}
          </div>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {project.category && (
                <Badge variant="secondary">{project.category.name}</Badge>
              )}
              <Badge variant="outline">
                Опубликован {formatDate(project.createdAt)}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Технологии</h2>
            {project.techStack.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Стек не указан.
              </p>
            )}
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>О проекте</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Автор:{" "}
                  <span className="font-medium text-foreground">
                    {project.author.name ?? "Разработчик IT ShowCase"}
                  </span>
                </p>
                <p>
                  Последнее обновление:{" "}
                  <span className="font-medium text-foreground">
                    {formatDate(project.updatedAt)}
                  </span>
                </p>
                <p>
                  Формат:{" "}
                  <span className="font-medium text-foreground">
                    Готовый к запуску проект
                  </span>
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{formatPrice(project.price)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-7">
              <p className="text-sm text-muted-foreground">
                Заинтересовал проект? Оставьте заявку, и мы свяжемся с вами для
                обсуждения деталей.
              </p>
              <div className="pt-3">
                {project.demoUrl ? (
                  <a href={project.demoUrl} target="_blank" rel="noreferrer">
                    <Button className="w-full">Открыть демо</Button>
                  </a>
                ) : (
                  <Button disabled className="w-full">
                    Демо недоступно
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Оставить заявку</CardTitle>
            </CardHeader>
            <CardContent>
              <RequestForm projectId={project.id} projectTitle={project.title} />
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Похожие проекты</h2>
          <Link
            href="/projects"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Весь каталог
          </Link>
        </div>

        {relatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((item) => (
              <Card key={item.id} className="h-full">
                <CardHeader className="space-y-2">
                  {item.category && (
                    <Badge variant="secondary" className="w-fit">
                      {item.category.name}
                    </Badge>
                  )}
                  <CardTitle className="line-clamp-1 text-lg">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    {formatPrice(item.price)}
                  </p>
                  <Link
                    href={`/projects/${item.slug}`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Подробнее
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground">
              Пока нет похожих проектов. Посмотрите остальные варианты в каталоге.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
