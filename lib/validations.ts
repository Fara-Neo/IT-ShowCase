import { z } from "zod";

const projectBaseSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа").max(100, "Максимум 100 символов"),
  slug: z.string().optional(),
  description: z.string().min(20, "Минимум 20 символов"),
  price: z.number().min(0, "Цена не может быть отрицательной"),
  imageUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

const projectPatchBaseSchema = projectBaseSchema.partial();
type ProjectRefinementInput = z.infer<typeof projectPatchBaseSchema>;

function applyProjectRefinements(data: ProjectRefinementInput, ctx: z.RefinementCtx) {
    if (data.slug !== undefined && data.slug.trim() !== "") {
      const value = data.slug.trim();
      if (value.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Минимум 3 символа",
          path: ["slug"],
        });
      }
      if (value.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Максимум 100 символов",
          path: ["slug"],
        });
      }
    }

    if (data.imageUrl !== undefined && data.imageUrl.trim() !== "") {
      const result = z.string().url().safeParse(data.imageUrl.trim());
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Некорректный URL изображения",
          path: ["imageUrl"],
        });
      }
    }

    if (data.demoUrl !== undefined && data.demoUrl.trim() !== "") {
      const result = z.string().url().safeParse(data.demoUrl.trim());
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Некорректный URL демо",
          path: ["demoUrl"],
        });
      }
    }
}

export const projectSchema = projectBaseSchema.superRefine(applyProjectRefinements);
export const projectPatchSchema = projectPatchBaseSchema.superRefine(applyProjectRefinements);

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
export type ProjectFormValues = z.input<typeof projectSchema>;
export type ProjectPatchInput = z.infer<typeof projectPatchSchema>;
export type RequestInput = z.infer<typeof requestSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
