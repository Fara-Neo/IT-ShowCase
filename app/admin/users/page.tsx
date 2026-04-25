import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользователи | Админ",
};

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Пользователи</h1>
      <p className="text-muted-foreground">Управление пользователями в разработке...</p>
    </div>
  );
}
