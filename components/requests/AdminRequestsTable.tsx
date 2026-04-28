"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { RequestStatus } from "@/types";

interface AdminRequestRow {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  message: string | null;
  status: RequestStatus;
  createdAt: Date;
  project: {
    id: string;
    title: string;
    slug: string;
  };
}

interface AdminRequestsTableProps {
  requests: AdminRequestRow[];
  canSendSmtpTest?: boolean;
  initialSmtpEmail?: string;
}

const statusOptions: { value: "all" | RequestStatus; label: string }[] = [
  { value: "all", label: "Все статусы" },
  { value: "new", label: "Новая" },
  { value: "in_review", label: "На рассмотрении" },
  { value: "completed", label: "Завершена" },
  { value: "rejected", label: "Отклонена" },
];

function mapSmtpErrorToRu(message: string) {
  switch (message) {
    case "Forbidden":
      return "Доступ запрещен. Нужны права администратора.";
    case "Invalid JSON body":
      return "Некорректный формат запроса.";
    case "Invalid email for test message":
      return "Укажите корректный email для тестовой отправки.";
    case "SMTP is not configured":
      return "SMTP не настроен. Проверьте переменные окружения.";
    case "Failed to send test email":
      return "Не удалось отправить тестовое письмо.";
    default:
      return message;
  }
}

export function AdminRequestsTable({
  requests,
  canSendSmtpTest = false,
  initialSmtpEmail = "",
}: AdminRequestsTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [smtpEmail, setSmtpEmail] = useState(initialSmtpEmail);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);

  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((item) => item.status === statusFilter);
  }, [requests, statusFilter]);

  const handleStatusChange = async (
    requestId: string,
    nextStatus: RequestStatus
  ) => {
    setUpdatingId(requestId);
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Не удалось обновить статус");
      }

      toast.success("Статус заявки обновлен");
      router.refresh();
    } catch {
      toast.error("Ошибка обновления статуса");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendSmtpTest = async () => {
    if (!smtpEmail.trim()) {
      toast.error("Укажите email для тестовой отправки");
      return;
    }

    setIsSendingTestEmail(true);
    try {
      const response = await fetch("/api/admin/mail-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: smtpEmail.trim() }),
      });

      if (!response.ok) {
        let message = "Не удалось отправить тестовое письмо";
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData.error) {
            message = errorData.error;
          }
        } catch {
          // Keep default message when response is not JSON.
        }
        throw new Error(mapSmtpErrorToRu(message));
      }

      toast.success("Тестовое письмо отправлено");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ошибка отправки тестового письма"
      );
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  if (requests.length === 0) {
    return (
      <EmptyState
        title="Заявок пока нет"
        description="Новые заявки пользователей появятся здесь."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="statusFilter" className="text-sm text-muted-foreground">
            Фильтр по статусу:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | RequestStatus)
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {canSendSmtpTest && (
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={smtpEmail}
              onChange={(e) => setSmtpEmail(e.target.value)}
              placeholder="test@example.com"
              className="h-9 w-full min-w-[220px] rounded-md border border-input bg-background px-3 text-sm md:w-auto"
            />
            <button
              type="button"
              onClick={handleSendSmtpTest}
              disabled={isSendingTestEmail}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSendingTestEmail ? "Отправка..." : "Тест SMTP"}
            </button>
          </div>
        )}
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          title="По этому фильтру заявок нет"
          description="Попробуйте выбрать другой статус."
          className="py-10"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Клиент</TableHead>
              <TableHead>Проект</TableHead>
              <TableHead>Сообщение</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Смена статуса</TableHead>
              <TableHead>Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{item.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.clientEmail}
                    </p>
                    {item.clientPhone && (
                      <p className="text-xs text-muted-foreground">
                        {item.clientPhone}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-[220px] truncate font-medium">
                    {item.project.title}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="max-w-[320px] whitespace-normal text-sm text-muted-foreground">
                    {item.message || "—"}
                  </p>
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value as RequestStatus)
                    }
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {statusOptions
                      .filter((option) => option.value !== "all")
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
