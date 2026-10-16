export const SETTINGS_STORAGE_KEY = "user-settings";

export type ThemePreference = "system" | "light" | "dark";

export type UserSettings = {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  theme: ThemePreference;
  emailNotifications: boolean;
  productUpdates: boolean;
};

export const defaultSettings: UserSettings = {
  displayName: "",
  username: "",
  email: "",
  bio: "",
  theme: "system",
  emailNotifications: true,
  productUpdates: false,
};

export type SettingsErrors = Partial<
  Record<"displayName" | "username" | "email" | "bio", string>
>;

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSettings(values: UserSettings): SettingsErrors {
  const errors: SettingsErrors = {};

  if (!values.displayName.trim()) {
    errors.displayName = "Display name is required.";
  } else if (values.displayName.trim().length < 2) {
    errors.displayName = "Display name must be at least 2 characters.";
  }

  if (!values.username.trim()) {
    errors.username = "Username is required.";
  } else if (!USERNAME_PATTERN.test(values.username.trim())) {
    errors.username =
      "Use 3–20 letters, numbers, or underscores, with no spaces.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (values.bio.length > 160) {
    errors.bio = "Bio must be 160 characters or fewer.";
  }

  return errors;
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return defaultSettings;
    }

    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      theme: parsed.theme ?? defaultSettings.theme,
      emailNotifications:
        parsed.emailNotifications ?? defaultSettings.emailNotifications,
      productUpdates: parsed.productUpdates ?? defaultSettings.productUpdates,
    };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(values: UserSettings) {
  localStorage.setItem(
    SETTINGS_STORAGE_KEY,
    JSON.stringify({
      ...values,
      displayName: values.displayName.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      bio: values.bio.trim(),
    }),
  );
}
