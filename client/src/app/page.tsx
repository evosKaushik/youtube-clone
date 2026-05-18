"use client";

import VideoContainer from "@/components/home/VideoContainer";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { useSidebarStore } from "@/store/useSidebarStore";
import clsx from "clsx";

export default function Home() {
  const isOpen = useSidebarStore((s) => s.isOpen);

  return (
    <>
      <Navbar />

      <main className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          className={clsx(
            `
              w-full
              transition-all duration-300
              pt-2
            `,
            {
              "ml-0 lg:ml-20": !isOpen,
              "ml-0 lg:ml-60": isOpen,
            },
          )}
        >
          <div className="p-6">
            <VideoContainer />
          </div>
        </div>
      </main>
    </>
  );
}
