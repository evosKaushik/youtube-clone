"use client";

import useMedia from "@/hooks/useMedia";
import { useSidebarStore } from "@/store/useSidebarStore";

import { FaBars } from "react-icons/fa";
import { usePathname } from "next/navigation";

const SidebarButton = () => {
  const isBelowLg = useMedia("lg");
  const pathname = usePathname();
  const isWatchPage = pathname === "/watch";

  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);

  const openOverlay = useSidebarStore((s) => s.openOverlay);
  const closeOverlay = useSidebarStore((s) => s.closeOverlay);

  const isOverlay = useSidebarStore((s) => s.isOverlay);

const handleSidebar = () => {
  // On mobile (< lg) OR watch page, use overlay
  // On desktop (>= lg), toggle sidebar width
  if (isBelowLg || isWatchPage) {
    if (isOverlay) {
      closeOverlay();
    } else {
      openOverlay();
    }
    return;
  }

  toggleSidebar();
};

  return (
    <button
      className="
        flex h-11 w-11 items-center
        justify-center rounded-full
        transition hover:bg-hover
        cursor-pointer
      "
      onClick={handleSidebar}
    >
      <FaBars className="text-lg text-text" size={24} />
    </button>
  );
};

export default SidebarButton;