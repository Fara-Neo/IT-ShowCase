import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProjectCatalog } from "@/components/projects/ProjectCatalog";

export const metadata: Metadata = {
  title: "Каталог проектов",
  description: "Готовые IT-проекты для покупки: сайты, мобильные приложения, боты и сервисы",
};

export default async function ProjectsPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог проектов</h1>
        <p className="mt-2 text-muted-foreground">
          Готовые IT-решения для вашего бизнеса
        </p>
      </div>
      <ProjectCatalog categories={categories} />
    </div>
  );
}
