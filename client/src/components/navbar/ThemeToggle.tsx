"use client";

import { useTheme } from "next-themes";
import {
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      className="icon-btn"
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
    >
      {theme === "dark" ? (
        <MdLightMode />
      ) : (
        <MdDarkMode />
      )}
    </button>
  );
}