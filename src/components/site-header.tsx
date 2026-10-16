import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/[.08] bg-white/80 backdrop-blur dark:border-white/[.12] dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
        >
          Workflow Drill
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Home
          </Link>
          <Link
            href="/settings"
            className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
