"use client";

import { useState, useCallback } from "react";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectGrid } from "./ProjectGrid";
import { useProjects } from "@/hooks/useProjects";
import type { Category, ProjectFilters as Filters } from "@/types";

interface ProjectCatalogProps {
  categories: Category[];
}

export function ProjectCatalog({ categories }: ProjectCatalogProps) {
  const [filters, setFilters] = useState<Filters>({});
  const { projects, isLoading, error } = useProjects(filters);

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="space-y-6">
      <ProjectFilters categories={categories} onFilterChange={handleFilterChange} />
      {error && (
        <p className="text-sm text-destructive">
          Ошибка загрузки проектов: {error}
        </p>
      )}
      <ProjectGrid projects={projects} isLoading={isLoading} />
    </div>
  );
}
