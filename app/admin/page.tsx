import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Дашборд | Админ",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Всего проектов</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Заявок</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Пользователей</p>
          <p className="text-3xl font-bold mt-1">—</p>
        </div>
      </div>
    </div>
  );
}
