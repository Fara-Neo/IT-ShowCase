"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Проекты", href: "/projects" },
  { label: "О платформе", href: "/about" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Меню"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-background border-t transition-all",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-3 text-base font-medium rounded-md hover:bg-accent"
          >
            Войти
          </Link>
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-3 py-3 text-base font-medium rounded-md bg-primary text-primary-foreground"
          >
            Регистрация
          </Link>
        </nav>
      </div>
    </div>
  );
}
