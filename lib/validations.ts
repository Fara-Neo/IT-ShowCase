import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(100, "Максимум 100 символов"),
  slug: z.string().min(3).max(100).optional(),
  description: z.string().min(20, "Минимум 20 символов"),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  imageUrl: z.string().url("Некорректный URL изображения").optional(),
  techStack: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  published: z.boolean().optional(),
});

export const requestSchema = z.object({
  projectId: z.string().min(1, "Укажите проект"),
  clientName: z.string().min(2, "Минимум 2 символа"),
  clientEmail: z.string().email("Некорректный email"),
  clientPhone: z.string().optional(),
  message: z.string().max(1000, "Максимум 1000 символов").optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Некорректный email"),
  password: z
    .string()
    .min(8, "Минимум 8 символов")
    .regex(/[A-Z]/, "Нужна хотя бы одна заглавная буква")
    .regex(/[0-9]/, "Нужна хотя бы одна цифра"),
});

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type RequestInput = z.infer<typeof requestSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
