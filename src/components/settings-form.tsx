"use client";

import {
  FormEvent,
  useRef,
  useState,
} from "react";
import {
  loadSettings,
  saveSettings,
  validateSettings,
  type SettingsErrors,
  type UserSettings,
} from "@/lib/settings";

const inputBaseClass =
  "mt-1.5 w-full rounded-lg border border-black/[.08] bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950 dark:border-white/[.14] dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50";

const inputErrorClass =
  "border-red-500 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400";

export function SettingsForm() {
  const [values, setValues] = useState<UserSettings>(() => loadSettings());
  const [touched, setTouched] = useState<Record<"fullName" | "email", boolean>>({
    fullName: false,
    email: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const fullNameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const allErrors = validateSettings(values);

  const visibleErrors: SettingsErrors = {
    fullName:
      touched.fullName || isSubmitted ? allErrors.fullName : undefined,
    email:
      touched.email || isSubmitted ? allErrors.email : undefined,
  };

  function handleChange(field: "fullName" | "email", value: string) {
    setStatus("idle");
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleBlur(field: "fullName" | "email") {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitted(true);

    const validationErrors = validateSettings(values);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("idle");
      if (validationErrors.fullName) {
        fullNameInputRef.current?.focus();
      } else if (validationErrors.email) {
        emailInputRef.current?.focus();
      }
      return;
    }

    saveSettings(values);
    setStatus("success");
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-6"
    >
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
        >
          Settings saved successfully.
        </div>
      ) : null}

      <div className="flex flex-col">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-zinc-950 dark:text-zinc-50"
        >
          Full Name
        </label>
        <input
          ref={fullNameInputRef}
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onBlur={() => handleBlur("fullName")}
          aria-invalid={Boolean(visibleErrors.fullName)}
          aria-describedby={
            visibleErrors.fullName ? "fullName-error" : undefined
          }
          className={`${inputBaseClass} ${
            visibleErrors.fullName ? inputErrorClass : ""
          }`}
          placeholder="Jane Doe"
        />
        {visibleErrors.fullName ? (
          <p
            id="fullName-error"
            role="alert"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {visibleErrors.fullName}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-950 dark:text-zinc-50"
        >
          Email
        </label>
        <input
          ref={emailInputRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          aria-invalid={Boolean(visibleErrors.email)}
          aria-describedby={visibleErrors.email ? "email-error" : undefined}
          className={`${inputBaseClass} ${
            visibleErrors.email ? inputErrorClass : ""
          }`}
          placeholder="jane@example.com"
        />
        {visibleErrors.email ? (
          <p
            id="email-error"
            role="alert"
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
          >
            {visibleErrors.email}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:hover:bg-[#ccc] dark:focus-visible:ring-zinc-100"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
}
