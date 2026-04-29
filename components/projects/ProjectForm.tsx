"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  type ProjectFormValues,
  type ProjectInput,
} from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProjectImageUpload } from "@/components/projects/ProjectImageUpload";
import toast from "react-hot-toast";
import type { Category, Project } from "@/types";

interface ProjectFormProps {
  initialData?: Partial<Project>;
  categories: Category[];
  onSuccess?: () => void;
}

export function ProjectForm({ initialData, categories, onSuccess }: ProjectFormProps) {
  const router = useRouter();
  const defaultTechStack = useMemo(
    () => (initialData?.techStack?.length ? initialData.techStack.join(", ") : ""),
    [initialData?.techStack]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price ?? 0,
      slug: "",
      imageUrl: initialData?.imageUrl ?? "",
      demoUrl: initialData?.demoUrl ?? "",
      categoryId: initialData?.categoryId ?? "",
      published: initialData?.published ?? false,
      featured: initialData?.featured ?? false,
      techStack: [defaultTechStack],
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    const techStackRaw = data.techStack?.[0] ?? "";
    const normalized: ProjectInput = projectSchema.parse({
      ...data,
      techStack: techStackRaw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });

    try {
      const url = initialData?.id
        ? `/api/projects/${initialData.id}`
        : "/api/projects";
      const method = initialData?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });

      if (!res.ok) throw new Error("Ошибка сохранения");

      toast.success(
        initialData?.id ? "Проект обновлён" : "Проект создан"
      );
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/projects");
        router.refresh();
      }
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
        <Label htmlFor="slug">
          Slug <span className="text-muted-foreground">(необязательно)</span>
        </Label>
        <Input id="slug" {...register("slug")} placeholder="my-it-project" />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
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

      <div className="space-y-2">
        <Label>Изображение проекта</Label>
        <ProjectImageUpload
          currentUrl={watch("imageUrl")}
          onUpload={(url) => {
            setValue("imageUrl", url || "", {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          }}
        />
        {errors.imageUrl && (
          <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="demoUrl">Ссылка на демо</Label>
        <Input
          id="demoUrl"
          type="url"
          {...register("demoUrl")}
          placeholder="https://demo.example.com"
        />
        {errors.demoUrl && (
          <p className="text-sm text-destructive">{errors.demoUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">
          Категория <span className="text-muted-foreground">(необязательно)</span>
        </Label>
        <select
          id="categoryId"
          {...register("categoryId")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Без категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStackInput">
          Стек технологий <span className="text-muted-foreground">(через запятую)</span>
        </Label>
        <Input
          id="techStackInput"
          defaultValue={defaultTechStack}
          {...register("techStack.0")}
          placeholder="Next.js, TypeScript, Prisma"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          {...register("published")}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="published" className="cursor-pointer">
          Опубликовать проект сразу
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          {...register("featured")}
          className="h-4 w-4 rounded border-input"
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Добавить в избранное (на главную)
        </Label>
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
