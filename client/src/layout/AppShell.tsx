"use client";

import { ReactNode, useEffect, useState } from "react";
import { clsx } from "clsx";
import { useSidebarStore } from "@/store/useSidebarStore";
import { getThemeByLocationAndTime } from "@/libs/utils";

type Props = {
  children: ReactNode;
};

const AppShell = ({ children }: Props) => {
  const isOpen = useSidebarStore((s) => s.isOpen);

  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const currentTheme = getThemeByLocationAndTime();

    setTheme(currentTheme);

    document.documentElement.classList.remove("light", "dark");

    document.documentElement.classList.add(currentTheme);
  }, []);

  return (
    <main
      className={clsx(
        `
        min-h-[calc(100vh-56px)]
        bg-background
        text-text
        transition-all
        duration-300
      `,
        {
          "ml-0 lg:ml-20": !isOpen,
          "ml-0 lg:ml-60": isOpen,
        },
      )}
    >
      {children}
    </main>
  );
};

export default AppShell;
