import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новый проект | Админ",
};

export default function AdminNewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Создать проект</h1>
      <p className="text-muted-foreground">Форма создания проекта в разработке...</p>
    </div>
  );
}
