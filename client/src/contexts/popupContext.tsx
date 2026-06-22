"use client";

import PopupBox from "@/components/ui/PopupBox";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

type PopupButton = {
  label: string;
  action: () => void;
  style?: string;
};

type PopupConfig = {
  popupStyle?: string;
  buttonsStyle?: string;
  header?: string;
  selfClose?: boolean;
  popupMsg?: string;
  body?: ReactNode;
  PopupIcon?: {
    Icon: IconType;
    IconStyle?: string;
  };
  footer?: string;
  onClose?: () => void;
  button1?: PopupButton;
  button2?: PopupButton;
};

type PopupContextType = {
  popup: PopupConfig | null;
  showPopup: (config: PopupConfig) => void;
  hidePopup: () => void;
};

const PopupContext = createContext<PopupContextType | null>(null);

export function PopupProvider({ children }: { children: ReactNode }) {
  const [popup, setPopup] = useState<PopupConfig | null>(null);

  const showPopup = (config: PopupConfig) => {
    setPopup(config);
  };

  const hidePopup = () => {
    setPopup(null);
  };

  return (
    <PopupContext.Provider
      value={{
        popup,
        showPopup,
        hidePopup,
      }}
    >
      {children}
      <PopupBox />
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopup must be used inside PopupProvider");
  }

  return context;
}
