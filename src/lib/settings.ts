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

export function validateSettings(values: {
  fullName: string;
  email: string;
}): SettingsErrors {
  const errors: SettingsErrors = {};

  const trimmedFullName = values.fullName.trim();
  const trimmedEmail = values.email.trim();

  if (!trimmedFullName) {
    errors.fullName = "Full name is required.";
  }

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
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

  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      theme: values.theme ?? "system",
    }),
  );
}
