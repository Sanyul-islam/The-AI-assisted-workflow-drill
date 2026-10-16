"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  SETTINGS_STORAGE_KEY,
  defaultSettings,
  loadSettings,
  saveSettings,
  validateSettings,
  type SettingsErrors,
  type ThemePreference,
  type UserSettings,
} from "@/lib/settings";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-black/[.08] bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950 dark:border-white/[.14] dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50";

const errorFieldClassName =
  "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400";

const FIELD_IDS = {
  displayName: "settings-display-name",
  username: "settings-username",
  email: "settings-email",
  bio: "settings-bio",
  theme: "settings-theme",
  emailNotifications: "settings-email-notifications",
  productUpdates: "settings-product-updates",
} as const;

export function SettingsForm() {
  const [values, setValues] = useState<UserSettings>(() => loadSettings());
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [status, setStatus] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      values.theme === "dark" ||
      (values.theme === "system" && prefersDark);

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  }, [values.theme]);

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setStatus("idle");
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }
      const next = { ...current };
      delete next[key as keyof SettingsErrors];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateSettings(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    saveSettings(values);
    setStatus("saved");
  }

  function handleReset() {
    setValues(defaultSettings);
    setErrors({});
    setStatus("idle");
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-8"
    >
      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Profile
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            This information is stored in your browser for this demo.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id={`${FIELD_IDS.displayName}`}
            label="Display name"
            error={errors.displayName}
          >
            <input
              id={`${FIELD_IDS.displayName}`}
              name="displayName"
              type="text"
              autoComplete="name"
              value={values.displayName}
              onChange={(event) => update("displayName", event.target.value)}
              className={`${fieldClassName} ${errors.displayName ? errorFieldClassName : ""}`}
              aria-invalid={Boolean(errors.displayName)}
              aria-describedby={
                errors.displayName ? `${FIELD_IDS.displayName}-error` : undefined
              }
            />
          </Field>

          <Field
            id={`${FIELD_IDS.username}`}
            label="Username"
            error={errors.username}
          >
            <input
              id={`${FIELD_IDS.username}`}
              name="username"
              type="text"
              autoComplete="username"
              value={values.username}
              onChange={(event) => update("username", event.target.value)}
              className={`${fieldClassName} ${errors.username ? errorFieldClassName : ""}`}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                errors.username ? `${FIELD_IDS.username}-error` : undefined
              }
            />
          </Field>
        </div>

        <Field id={`${FIELD_IDS.email}`} label="Email" error={errors.email}>
          <input
            id={`${FIELD_IDS.email}`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            className={`${fieldClassName} ${errors.email ? errorFieldClassName : ""}`}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${FIELD_IDS.email}-error` : undefined}
          />
        </Field>

        <Field
          id={`${FIELD_IDS.bio}`}
          label="Bio"
          hint={`${values.bio.length}/160`}
          error={errors.bio}
        >
          <textarea
            id={`${FIELD_IDS.bio}`}
            name="bio"
            rows={4}
            maxLength={180}
            value={values.bio}
            onChange={(event) => update("bio", event.target.value)}
            className={`${fieldClassName} resize-y ${errors.bio ? errorFieldClassName : ""}`}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={[
              `${FIELD_IDS.bio}-hint`,
              errors.bio ? `${FIELD_IDS.bio}-error` : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
            placeholder="A short introduction"
          />
        </Field>
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
            Preferences
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Choose how the app should look and which emails you want.
          </p>
        </div>

        <Field id={`${FIELD_IDS.theme}`} label="Theme">
          <select
            id={`${FIELD_IDS.theme}`}
            name="theme"
            value={values.theme}
            onChange={(event) =>
              update("theme", event.target.value as ThemePreference)
            }
            className={fieldClassName}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </Field>

        <Toggle
          id={FIELD_IDS.emailNotifications}
          label="Account emails"
          description="Password resets, security alerts, and important account notices."
          checked={values.emailNotifications}
          onChange={(checked) => update("emailNotifications", checked)}
        />

        <Toggle
          id={`${FIELD_IDS.productUpdates}`}
          label="Product updates"
          description="Occasional news about features and improvements."
          checked={values.productUpdates}
          onChange={(checked) => update("productUpdates", checked)}
        />
      </section>

      {status === "saved" ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          Settings saved.
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="h-11 rounded-full border border-black/[.08] px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-[#1a1a1a]"
        >
          Reset
        </button>
        <button
          type="submit"
          className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Save settings
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          {label}
        </label>
        {hint ? (
          <span id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-black/[.08] px-4 py-3 dark:border-white/[.12]">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
          {label}
        </label>
        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-zinc-950 dark:bg-zinc-50" : "bg-zinc-300 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform dark:bg-zinc-950 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
