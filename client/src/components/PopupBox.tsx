"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { usePopup } from "@/contexts/popupContext";

const PopupBox = () => {
  const [isVisible, setIsVisible] = useState(false);

  const { popup: PopupData, hidePopup } = usePopup();

  useEffect(() => {
    if (PopupData) {
      setIsVisible(false);

      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [PopupData]);

  if (!PopupData) return null;

  const root = document.getElementById("root");
  if (!root) return null;

  const PopupIcon = PopupData.PopupIcon;

  const closePopup = () => {
    PopupData.onClose?.();
    hidePopup();
  };

  return createPortal(
    <div
      onClick={closePopup}
      className="
                fixed
                inset-0
                z-[9999]
                bg-black/70
                backdrop-blur-sm
                flex
                items-center
                justify-center
                px-4
            "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
                    w-full
                    max-w-[520px]
                    bg-[#181818]
                    border
                    border-[#343434]
                    rounded-2xl
                    shadow-2xl
                    p-6
                    text-white
                    transition-all
                    duration-300
                    ${
                      isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }
                    ${PopupData.popupStyle || ""}
                `}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            {PopupData.header && (
              <h2 className="text-2xl font-semibold">{PopupData.header}</h2>
            )}

            <p className="text-sm text-gray-400 mt-1">
              Please confirm this action
            </p>
          </div>

          {PopupData.selfClose && (
            <button
              onClick={closePopup}
              className="
                                text-gray-400
                                hover:text-white
                                text-2xl
                                transition
                            "
            >
              <IoMdClose />
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className="text-center py-2">
          {PopupIcon?.Icon && (
            <PopupIcon.Icon
              className={`
                                mx-auto
                                mb-4
                                size-14
                                ${PopupIcon.IconStyle || "text-red-500"}
                            `}
            />
          )}

          {PopupData.body
            ? PopupData.body
            : PopupData.popupMsg && (
                <p className="text-lg text-gray-200 leading-relaxed">
                  {PopupData.popupMsg}
                </p>
              )}
        </div>

     
        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-8">
          {PopupData.button1 && (
            <button
              onClick={() => {
                PopupData.button1?.action();
              }}
              className={`
        h-10
        px-5
        rounded-full
        bg-[#2a2a2a]
        hover:bg-[#3a3a3a]
        text-white
        text-sm
        transition
        ${PopupData.button1.style || ""}
      `}
            >
              {PopupData.button1.label}
            </button>
          )}

          {PopupData.button2 && (
            <button
              onClick={() => {
                PopupData.button2?.action();
              }}
              className={`
        h-10
        px-5
        rounded-full
        bg-white
        hover:bg-gray-200
        text-black
        text-sm
        font-medium
        transition
        ${PopupData.button2.style || ""}
      `}
            >
              {PopupData.button2.label}
            </button>
          )}
        </div>

        {/* OPTIONAL FOOTER TEXT */}
        {PopupData.footer && (
          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400">{PopupData.footer}</p>
          </div>
        )}
      </div>
    </div>,
    root,
  );
};

export default PopupBox;
