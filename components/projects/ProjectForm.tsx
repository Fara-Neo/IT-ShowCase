"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import type { Project } from "@/types";

interface ProjectFormValues {
  title: string;
  description: string;
  price: number;
  slug?: string;
  imageUrl?: string;
  techStack?: string[];
  categoryId?: string;
  published?: boolean;
}

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSuccess: () => void;
}

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      published: initialData?.published ?? false,
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    try {
      const url = initialData?.id
        ? `/api/projects/${initialData.id}`
        : "/api/projects";
      const method = initialData?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");

      toast.success(
        initialData?.id ? "Проект обновлён" : "Проект создан"
      );
      onSuccess();
    } catch {
      toast.error("Произошла ошибка. Попробуйте снова.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Название проекта</Label>
        <Input id="title" {...register("title")} placeholder="Мой IT-проект" />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Подробное описание проекта..."
          rows={5}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Цена (₽)</Label>
        <Input
          id="price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          placeholder="50000"
        />
        {errors.price && (
          <p className="text-sm text-destructive">{errors.price.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting
          ? "Сохранение..."
          : initialData?.id
          ? "Сохранить изменения"
          : "Создать проект"}
      </Button>
    </form>
  );
}
