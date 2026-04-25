import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заявки | Админ",
};

export default function AdminRequestsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Заявки</h1>
      <p className="text-muted-foreground">Управление заявками в разработке...</p>
    </div>
  );
}
