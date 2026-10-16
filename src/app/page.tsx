import Link from "next/link";

const stats = [
  { label: "Focus blocks", value: "12" },
  { label: "Completed", value: "87%" },
  { label: "Streak", value: "5 days" },
];

const tasks = [
  "Review weekly priorities",
  "Ship the handoff checklist",
  "Finalize project updates",
];

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="w-full max-w-3xl">
        <section className="rounded-3xl border border-black/[.06] bg-white p-8 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                Daily workflow
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-5xl">
                Build momentum with a calmer routine.
              </h1>
            </div>
            <Link
              href="/settings"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
            >
              Adjust settings
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/[.06] bg-zinc-50 p-4 dark:border-white/[.08] dark:bg-white/[.02]"
              >
                <p className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                Today’s checklist
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                On track
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={task}
                  className="flex items-center gap-3 rounded-2xl border border-black/[.06] bg-zinc-50 px-3 py-3 text-sm text-zinc-700 dark:border-white/[.08] dark:bg-white/[.02] dark:text-zinc-300"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950">
                    {index + 1}
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-3xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
              Snapshot
            </p>
            <div className="mt-5 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div>
                <p className="text-zinc-950 dark:text-zinc-50">Deep work</p>
                <p className="mt-1">2 sessions</p>
              </div>
              <div>
                <p className="text-zinc-950 dark:text-zinc-50">Meetings</p>
                <p className="mt-1">1 planned</p>
              </div>
              <div>
                <p className="text-zinc-950 dark:text-zinc-50">Team sync</p>
                <p className="mt-1">4:30 PM</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
