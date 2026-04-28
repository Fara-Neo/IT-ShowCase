"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestSchema, type RequestInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface RequestFormProps {
  projectId: string;
  projectTitle?: string;
  onSuccess?: () => void;
}

function mapRequestErrorToRu(message: string) {
  switch (message) {
    case "Invalid JSON body":
      return "Некорректный формат данных формы.";
    case "Validation failed":
      return "Проверьте заполнение полей формы.";
    case "Project not found":
      return "Проект не найден.";
    case "Too many requests. Please try again later.":
      return "Слишком много запросов. Попробуйте позже.";
    case "Too many requests from this email. Please try again later.":
      return "С этого email уже отправлено слишком много заявок. Попробуйте позже.";
    case "Internal server error":
      return "Внутренняя ошибка сервера. Попробуйте позже.";
    default:
      return message;
  }
}

export function RequestForm({
  projectId,
  onSuccess,
}: RequestFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RequestInput>({
    resolver: zodResolver(requestSchema),
    defaultValues: { projectId },
  });

  const onSubmit = async (data: RequestInput) => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let message = "Ошибка отправки";
        try {
          const errorData = (await res.json()) as { error?: string };
          if (errorData.error) {
            message = errorData.error;
          }
        } catch {
          // Keep default message when response is not JSON.
        }
        throw new Error(mapRequestErrorToRu(message));
      }

      const payload = (await res.json()) as { warning?: string };
      if (payload.warning === "request_saved_but_email_failed") {
        toast("Заявка сохранена, но email-уведомление не отправлено.");
      }

      toast.success("Заявка успешно отправлена!");
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка. Попробуйте снова.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("projectId")} />

      <div className="space-y-1">
        <Label htmlFor="clientName">Ваше имя</Label>
        <Input
          id="clientName"
          {...register("clientName")}
          placeholder="Иван Иванов"
        />
        {errors.clientName && (
          <p className="text-xs text-destructive">{errors.clientName.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="clientEmail">Email</Label>
        <Input
          id="clientEmail"
          type="email"
          {...register("clientEmail")}
          placeholder="ivan@example.com"
        />
        {errors.clientEmail && (
          <p className="text-xs text-destructive">{errors.clientEmail.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="clientPhone">
          Телефон <span className="text-muted-foreground">(необязательно)</span>
        </Label>
        <Input
          id="clientPhone"
          {...register("clientPhone")}
          placeholder="+7 999 000-00-00"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="message">
          Сообщение <span className="text-muted-foreground">(необязательно)</span>
        </Label>
        <Textarea
          id="message"
          {...register("message")}
          placeholder="Ваш вопрос или комментарий..."
          rows={4}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  );
}
