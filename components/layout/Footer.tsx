import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-primary">IT</span>
            <span>ShowCase</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/projects" className="hover:text-foreground transition-colors">
              Проекты
            </Link>
            <Link href="/about" className="hover:text-foreground transition-colors">
              О платформе
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} IT ShowCase
          </p>
        </div>
      </div>
    </footer>
  );
}
