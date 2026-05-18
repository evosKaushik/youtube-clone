import { create } from "zustand";

type SidebarStore = {
  isOpen: boolean;
  isOverlay: boolean;

  toggleSidebar: () => void;

  openOverlay: () => void;
  closeOverlay: () => void;
};

export const useSidebarStore =
  create<SidebarStore>((set) => ({
    isOpen: true,
    isOverlay: false,

    toggleSidebar: () =>
      set((state) => ({
        isOpen: !state.isOpen,
      })),

    openOverlay: () =>
      set({
        isOverlay: true,
      }),

    closeOverlay: () =>
      set({
        isOverlay: false,
      }),
  }));