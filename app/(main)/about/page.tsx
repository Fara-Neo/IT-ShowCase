import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О платформе",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">О платформе</h1>
      <div className="prose prose-neutral dark:prose-invert max-w-3xl">
        <p className="text-muted-foreground">
          IT ShowCase — профессиональная площадка для демонстрации и продажи
          IT-проектов. Мы соединяем разработчиков с заказчиками, упрощая процесс
          демонстрации и приобретения готовых IT-решений.
        </p>
      </div>
    </div>
  );
}
