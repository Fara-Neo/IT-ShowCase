import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "О платформе",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">О платформе</h1>
      <div className="space-y-8">
        <section className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Маркетплейс <span className="text-primary">IT-проектов</span>
          </h2>
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

        <p className="max-w-3xl text-muted-foreground">
          IT ShowCase — профессиональная площадка для демонстрации и продажи IT-проектов.
          Мы соединяем разработчиков с заказчиками, упрощая процесс выбора, демонстрации и
          приобретения готовых IT-решений.
        </p>
      </div>
    </div>
  );
}
