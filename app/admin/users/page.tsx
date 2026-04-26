import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { AdminUsersTable } from "@/components/users/AdminUsersTable";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Пользователи | Админ",
};

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      image: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Пользователи</h1>
      <AdminUsersTable users={users} currentUserId={session?.user?.id} />
    </div>
  );
}
