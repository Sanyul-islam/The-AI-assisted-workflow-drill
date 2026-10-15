import { SettingsForm } from "@/components/settings-form";

export const metadata = {
  title: "Settings",
  description: "Manage your profile, theme, and notification preferences.",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-12 dark:bg-black">
      <main className="w-full max-w-3xl rounded-2xl border border-black/[.06] bg-white p-6 shadow-sm dark:border-white/[.08] dark:bg-zinc-950 sm:p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            User settings
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Update your personal details.
          </p>
        </div>
        <SettingsForm />
      </main>
    </div>
  );
}
