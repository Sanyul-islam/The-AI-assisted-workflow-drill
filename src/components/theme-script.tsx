"use client";

import { useEffect } from "react";
import { loadSettings } from "@/lib/settings";

export function ThemeScript() {
  useEffect(() => {
    const root = document.documentElement;
    const settings = loadSettings();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      settings.theme === "dark" ||
      (settings.theme === "system" && prefersDark);

    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  }, []);

  return null;
}
