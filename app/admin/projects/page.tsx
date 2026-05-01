import type { Metadata } from "next";
import Link from "next/link";
import { AdminProjectsTable } from "@/components/projects/AdminProjectsTable";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Проекты | Админ",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      category: true,
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          Добавить проект
        </Link>
      </div>
      <AdminProjectsTable projects={projects} />
    </div>
  );
}
