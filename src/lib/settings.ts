export const SETTINGS_STORAGE_KEY = "user-settings";

export type ThemePreference = "system" | "light" | "dark";

export type UserSettings = {
  fullName: string;
  email: string;
  theme?: ThemePreference;
};

export const defaultSettings: UserSettings = {
  fullName: "",
  email: "",
  theme: "system",
};

export type SettingsErrors = Partial<Record<"fullName" | "email", string>>;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function trimSettings<T extends { fullName: string; email: string }>(
  values: T,
): T {
  return {
    ...values,
    fullName: values.fullName.trim(),
    email: values.email.trim(),
  };
}

export function validateSettings(values: {
  fullName: string;
  email: string;
}): SettingsErrors {
  const errors: SettingsErrors = {};
  const trimmed = trimSettings(values);

  if (!trimmed.fullName) {
    errors.fullName = "Full name is required.";
  }

  if (!trimmed.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(trimmed.email)) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}

export function loadSettings(): UserSettings {
  if (typeof window === "undefined" || !window.localStorage) {
    return defaultSettings;
  }

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }

    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      fullName:
        typeof parsed.fullName === "string"
          ? parsed.fullName
          : defaultSettings.fullName,
      email:
        typeof parsed.email === "string"
          ? parsed.email
          : defaultSettings.email,
      theme: parsed.theme ?? defaultSettings.theme,
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(values: UserSettings): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  const trimmed = trimSettings(values);

  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      fullName: trimmed.fullName,
      email: trimmed.email,
      theme: trimmed.theme ?? "system",
    }),
  );
}
