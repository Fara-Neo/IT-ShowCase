"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect } from "react";
import type { ProjectFilters as Filters } from "@/types";

interface ProjectFiltersProps {
  onFilterChange: (filters: Filters) => void;
}

export function ProjectFilters({ onFilterChange }: ProjectFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch || undefined,
      category: category && category !== "all" ? category : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }, [debouncedSearch, category, minPrice, maxPrice, onFilterChange]);

  const handleReset = () => {
    setSearch("");
    setCategory("all" as string | null);
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все категории</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Цена от"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className="sm:w-32"
      />
      <Input
        type="number"
        placeholder="Цена до"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className="sm:w-32"
      />
      <Button variant="outline" onClick={handleReset}>
        Сбросить
      </Button>
    </div>
  );
}
