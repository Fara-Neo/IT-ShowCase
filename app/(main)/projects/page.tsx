import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог проектов",
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Каталог проектов</h1>
      <p className="text-muted-foreground">Каталог проектов в разработке...</p>
    </div>
  );
}
