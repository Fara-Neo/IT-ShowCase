import type { Metadata } from "next";

interface EditProjectPageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Редактировать проект | Админ",
};

export default function AdminEditProjectPage({ params }: EditProjectPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Редактировать проект</h1>
      <p className="text-muted-foreground">
        Редактирование проекта {params.id} в разработке...
      </p>
    </div>
  );
}
