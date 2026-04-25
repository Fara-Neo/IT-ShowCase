"use client";

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
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Fara-Neo"
              target="_blank"
              rel="noreferrer"
              title="GitHub"
              className="rounded border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              title="LinkedIn"
              className="rounded border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              title="Twitter"
              className="rounded border px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Twitter
            </a>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} IT ShowCase
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
