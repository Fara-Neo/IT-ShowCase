import type { User } from "./user";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string | null;
  techStack: string[];
  published: boolean;
  categoryId: string | null;
  category: Category | null;
  authorId: string;
  author: Pick<User, "id" | "name" | "image">;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
