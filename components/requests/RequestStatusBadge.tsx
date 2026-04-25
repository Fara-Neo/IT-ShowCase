import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types";

const statusConfig: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  new: {
    label: "Новая",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  in_review: {
    label: "На рассмотрении",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  completed: {
    label: "Завершена",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  rejected: {
    label: "Отклонена",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge className={cn("font-medium", config.className)} variant="outline">
      {config.label}
    </Badge>
  );
}
