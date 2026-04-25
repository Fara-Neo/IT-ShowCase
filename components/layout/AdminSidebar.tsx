"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  Users,
} from "lucide-react";

const navItems = [
  {
    label: "Дашборд",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Проекты",
    href: "/admin/projects",
    icon: FolderOpen,
  },
  {
    label: "Заявки",
    href: "/admin/requests",
    icon: MessageSquare,
  },
  {
    label: "Пользователи",
    href: "/admin/users",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-sidebar min-h-screen p-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">IT</span>
          <span>Showcase</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Админ-панель</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
