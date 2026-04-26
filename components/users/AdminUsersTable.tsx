"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { UserRole } from "@/types";

interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: UserRole;
  createdAt: Date;
}

interface AdminUsersTableProps {
  users: AdminUserRow[];
  currentUserId?: string;
}

const roleLabels: Record<UserRole, string> = {
  guest: "Гость",
  user: "Пользователь",
  seller: "Продавец",
  admin: "Админ",
};

const roleOptions: UserRole[] = ["guest", "user", "seller", "admin"];

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
  const router = useRouter();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdatingUserId(userId);
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить роль");
      }

      toast.success("Роль пользователя обновлена");
      router.refresh();
    } catch {
      toast.error("Ошибка обновления роли");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (users.length === 0) {
    return (
      <EmptyState
        title="Пользователей пока нет"
        description="После регистрации они появятся в этом списке."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Пользователь</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Текущая роль</TableHead>
          <TableHead>Смена роли</TableHead>
          <TableHead>Дата регистрации</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isCurrentUser = currentUserId === user.id;
          const initials =
            user.name
              ?.split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "U";

          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={user.image ?? undefined} alt={user.name ?? user.email} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium">{user.name ?? "Без имени"}</p>
                    {isCurrentUser && (
                      <Badge variant="secondary">Вы</Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "default" : "outline"}>
                  {roleLabels[user.role]}
                </Badge>
              </TableCell>
              <TableCell>
                <select
                  value={user.role}
                  disabled={updatingUserId === user.id}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                  className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
