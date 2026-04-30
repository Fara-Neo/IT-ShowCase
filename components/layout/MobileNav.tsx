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
          "fixed inset-x-0 top-16 z-40 border-t shadow-xl transition-all duration-300 ease-out",
          "bg-background/95 backdrop-blur-md",
          isOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-3"
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
        </nav>
      </div>
    </div>
  );
}
