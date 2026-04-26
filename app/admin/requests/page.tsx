import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { AdminRequestsTable } from "@/components/requests/AdminRequestsTable";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Заявки | Админ",
};

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions);
  const requests = await prisma.request.findMany({
    include: {
      project: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Заявки</h1>
      <AdminRequestsTable
        requests={requests}
        canSendSmtpTest={session?.user?.role === "admin"}
        initialSmtpEmail={session?.user?.email ?? ""}
      />
    </div>
  );
}
