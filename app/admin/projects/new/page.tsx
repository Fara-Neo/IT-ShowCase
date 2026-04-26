import type { Metadata } from "next";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Новый проект | Админ",
};

export default async function AdminNewProjectPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Создать проект</h1>
      <ProjectForm categories={categories} />
    </div>
  );
}
