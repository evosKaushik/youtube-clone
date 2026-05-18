"use client";

import useMedia from "@/hooks/useMedia";
import { useSidebarStore } from "@/store/useSidebarStore";
import { FaBars } from "react-icons/fa";

const SidebarButton = () => {
  const isLgScreen = useMedia("lg");
  const toggleSidebar = useSidebarStore((s) => s.toggleSidebar);

  const openOverlay = useSidebarStore((s) => s.openOverlay);

  const closeOverlay = useSidebarStore((s) => s.closeOverlay);

  const isOverlay = useSidebarStore((s) => s.isOverlay);

  const handleSidebar = () => {
   
    if (!isLgScreen) {
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
        transition hover:bg-white/10
        cursor-pointer
      "
      onClick={handleSidebar}
    >
      <FaBars className="text-lg text-white" size={24} />
    </button>
  );
};

export default SidebarButton;
