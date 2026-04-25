import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Нет изображения
          </div>
        )}
        {project.category && (
          <Badge className="absolute top-3 left-3" variant="secondary">
            {project.category.name}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.techStack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.techStack.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <p className="text-lg font-bold text-primary">
          {formatPrice(project.price)}
        </p>
        <Link
          href={`/projects/${project.slug}`}
          className={buttonVariants({ size: "sm" })}
        >
          Подробнее
        </Link>
      </CardFooter>
    </Card>
  );
}
