"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const stored = localStorage.getItem("app_theme");
    if (stored === "light" || stored === "dark") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(stored);
      return;
    }
    // Fall back to system preference
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const theme = prefersLight ? "light" : "dark";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, []);

  return null;
}
