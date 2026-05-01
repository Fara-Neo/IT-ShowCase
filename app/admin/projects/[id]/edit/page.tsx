import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { prisma } from "@/lib/prisma";

interface EditProjectPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Редактировать проект | Админ",
};

export const dynamic = "force-dynamic";

export default async function AdminEditProjectPage({ params }: EditProjectPageProps) {
  const [project, categories] = await Promise.all([
    prisma.project.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Редактировать проект</h1>
      <ProjectForm initialData={project} categories={categories} />
    </div>
  );
}
