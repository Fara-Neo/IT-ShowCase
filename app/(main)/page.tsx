import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Маркетплейс{" "}
          <span className="text-primary">IT-проектов</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Находите готовые IT-решения или представляйте свои разработки.
          Профессиональная площадка для разработчиков и заказчиков.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/projects" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto justify-center")}>
            Смотреть проекты
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto justify-center")}
          >
            Стать продавцом
          </Link>
        </div>
      </section>
    </div>
  );
}
