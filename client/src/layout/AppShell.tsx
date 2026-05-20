"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";
import { useSidebarStore } from "@/store/useSidebarStore";

type Props = {
  children: ReactNode;
};

const AppShell = ({ children }: Props) => {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <section
      className={clsx(
        `
          min-h-screen
          bg-black
          text-white
          transition-all
          duration-300
          pt-2
        `,
        {
          "ml-0 lg:ml-20": !isOpen,
          "ml-0 lg:ml-60": isOpen,
        },
      )}
    >
      {children}
    </section>
  );
};

export default AppShell;