"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate, formatPrice } from "@/lib/utils";

interface AdminProjectRow {
  id: string;
  title: string;
  slug: string;
  price: number;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface AdminProjectsTableProps {
  projects: AdminProjectRow[];
}

export function AdminProjectsTable({ projects }: AdminProjectsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProjectRow | null>(null);

  const handleDelete = async () => {
    if (!pendingDelete) return;

    setDeletingId(pendingDelete.id);
    try {
      const response = await fetch(`/api/projects/${pendingDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Не удалось удалить проект");
      }

      toast.success("Проект удален");
      setPendingDelete(null);
      router.refresh();
    } catch {
      toast.error("Ошибка удаления. Попробуйте снова.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (project: AdminProjectRow) => {
    setTogglingFeaturedId(project.id);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить избранное");
      }

      toast.success(
        !project.featured
          ? "Проект добавлен в избранное"
          : "Проект убран из избранного"
      );
      router.refresh();
    } catch {
      toast.error("Ошибка обновления. Попробуйте снова.");
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Пока нет проектов"
        description="Создайте первый проект и опубликуйте его в каталоге."
        action={
          <Link href="/admin/projects/new" className={buttonVariants()}>
            Добавить проект
          </Link>
        }
      />
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Проект</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Избранное</TableHead>
            <TableHead>Создан</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <div className="space-y-1">
                  <p className="max-w-[320px] truncate font-medium">{project.title}</p>
                  <p className="max-w-[320px] truncate text-xs text-muted-foreground">
                    /projects/{project.slug}
                  </p>
                </div>
              </TableCell>
              <TableCell>{project.category?.name ?? "Без категории"}</TableCell>
              <TableCell>{formatPrice(project.price)}</TableCell>
              <TableCell>
                <Badge variant={project.published ? "default" : "outline"}>
                  {project.published ? "Опубликован" : "Черновик"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={project.featured ? "default" : "outline"}>
                  {project.featured ? "Да" : "Нет"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(project.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={project.featured ? "secondary" : "outline"}
                    onClick={() => handleToggleFeatured(project)}
                    disabled={togglingFeaturedId === project.id}
                  >
                    {project.featured ? "Убрать из избранного" : "В избранное"}
                  </Button>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    Редактировать
                  </Link>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setPendingDelete(project)}
                    disabled={deletingId === project.id}
                  >
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        title="Удалить проект?"
        description={
          pendingDelete
            ? `Проект "${pendingDelete.title}" будет удален без возможности восстановления.`
            : undefined
        }
        confirmLabel={deletingId ? "Удаление..." : "Удалить"}
        onConfirm={handleDelete}
        isLoading={Boolean(deletingId)}
      />
    </>
  );
}
