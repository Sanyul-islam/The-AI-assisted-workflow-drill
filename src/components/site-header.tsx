"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/settings", label: "Settings" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/[.08] bg-white/80 backdrop-blur-xl dark:border-white/[.12] dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-950 transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-200"
        >
          Workflow Drill
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "rounded-full px-3 py-1.5 transition-colors",
                  isActive
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-950"
                    : "hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/[.08] dark:hover:text-zinc-50",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
