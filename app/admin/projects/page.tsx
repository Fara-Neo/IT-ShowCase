import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Проекты | Админ",
};

export default function AdminProjectsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          Добавить проект
        </Link>
      </div>
      <p className="text-muted-foreground">Список проектов в разработке...</p>
    </div>
  );
}
