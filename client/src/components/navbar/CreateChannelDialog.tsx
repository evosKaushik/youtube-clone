"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

export const validateChannel = ({
  channelName,
  channelHandle,
  channelDescription,
}: {
  channelName: string;
  channelHandle: string;
  channelDescription: string;
}) => {
  const errors = {
    name: "",
    handle: "",
    description: "",
  };

  // NAME
  if (!channelName.trim()) {
    errors.name = "Channel name is required";
  } else if (channelName.trim().length < 3) {
    errors.name = "Minimum 3 characters required";
  }

  // HANDLE
  if (!channelHandle.trim()) {
    errors.handle = "Handle is required";
  } else if (!/^[a-zA-Z0-9_]+$/.test(channelHandle)) {
    errors.handle =
      "Only letters numbers and underscore allowed";
  }

  // DESCRIPTION
  if (channelDescription.length > 200) {
    errors.description =
      "Description must be below 200 characters";
  }

  return errors;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateChannelDialog({
  open,
  onClose,
}: Props) {
  const [channelName, setChannelName] = useState("");
  const [channelHandle, setChannelHandle] = useState("");
  const [channelDescription, setChannelDescription] =
    useState("");

  const [errors, setErrors] = useState({
    name: "",
    handle: "",
    description: "",
  });

  if (!open) return null;

  const handleSubmit = () => {
    const validationErrors = validateChannel({
      channelName,
      channelHandle,
      channelDescription,
    });

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (value) => value !== ""
    );

    if (hasErrors) return;

    const channelData = {
      channelName,
      channelHandle,
      channelDescription,
    };

    console.log(channelData);

    /*
      TODO:
      Add API here
    */

    onClose();
  };

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999]
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-[520px]
          bg-[#181818]
          border
          border-[#343434]
          rounded-2xl
          shadow-2xl
          p-6
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-2xl font-semibold">
              Create your channel
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Setup your YouTube profile
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Channel Name
            </label>

            <input
              type="text"
              value={channelName}
              onChange={(e) =>
                setChannelName(e.target.value)
              }
              placeholder="John Doe"
              className="
                w-full
                h-12
                px-4
                rounded-xl
                bg-[#0f0f0f]
                border
                border-[#3a3a3a]
                outline-none
                text-white
              "
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-2">
                {errors.name}
              </p>
            )}
          </div>

          {/* HANDLE */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Handle
            </label>

            <div
              className="
                flex
                items-center
                bg-[#0f0f0f]
                border
                border-[#3a3a3a]
                rounded-xl
                overflow-hidden
              "
            >
              <span className="px-4 text-gray-400 text-sm">
                youtube.com/@
              </span>

              <input
                type="text"
                value={channelHandle}
                onChange={(e) =>
                  setChannelHandle(e.target.value)
                }
                placeholder="johndoe"
                className="
                  flex-1
                  h-12
                  bg-transparent
                  outline-none
                  text-white
                  px-2
                "
              />
            </div>

            {errors.handle && (
              <p className="text-red-500 text-xs mt-2">
                {errors.handle}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Description
            </label>

            <textarea
              rows={5}
              value={channelDescription}
              onChange={(e) =>
                setChannelDescription(e.target.value)
              }
              placeholder="Tell viewers about your channel..."
              className="
                w-full
                bg-[#0f0f0f]
                border
                border-[#3a3a3a]
                rounded-xl
                p-4
                outline-none
                text-white
                resize-none
              "
            />

            <div className="flex justify-between mt-2">
              {errors.description ? (
                <p className="text-red-500 text-xs">
                  {errors.description}
                </p>
              ) : (
                <div />
              )}

              <p className="text-gray-500 text-xs">
                {channelDescription.length}/200
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="
              h-10
              px-5
              rounded-full
              bg-[#2a2a2a]
              hover:bg-[#3a3a3a]
              text-white
              text-sm
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              h-10
              px-5
              rounded-full
              bg-white
              hover:bg-gray-200
              text-black
              text-sm
              font-medium
              transition
            "
          >
            Create channel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}