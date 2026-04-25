import type { Metadata } from "next";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  return {
    title: params.slug,
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{params.slug}</h1>
      <p className="mt-4 text-muted-foreground">
        Страница проекта в разработке...
      </p>
    </div>
  );
}
