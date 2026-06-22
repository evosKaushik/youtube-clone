"use client";

import { createChannelApi } from "@/api/userApi";
import { useState } from "react";
import { createPortal } from "react-dom";

export const validateChannel = ({
  channelName,
  channelUsername,
  channelDescription,
}: {
  channelName: string;
  channelUsername: string;
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
  if (!channelUsername.trim()) {
    errors.handle = "Handle is required";
  } else if (!/^[a-zA-Z0-9_]+$/.test(channelUsername)) {
    errors.handle = "Only letters numbers and underscore allowed";
  }

  // DESCRIPTION
  if (channelDescription.length > 200) {
    errors.description = "Description must be below 200 characters";
  }

  return errors;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateChannelDialog({ open, onClose }: Props) {
  const [channelName, setChannelName] = useState("");
  const [channelUsername, setChannelUsername] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    handle: "",
    description: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    const validationErrors = validateChannel({
      channelName,
      channelUsername,
      channelDescription,
    });

    setErrors(validationErrors);
    setSubmitError("");

    const hasErrors = Object.values(validationErrors).some(
      (value) => value !== "",
    );

    if (hasErrors) return;

    const payload = {
      channelName,
      channelUsername,
      channelDescription,
    };

    try {
      setLoading(true);

      const data = await createChannelApi(payload);

      if (!data || data.success === false) {
        const message = data?.error || "Failed to create channel";

        if (message.toLowerCase().includes("taken")) {
          setErrors((prev) => ({
            ...prev,
            handle: message,
          }));
        } else {
          setSubmitError(message);
        }
        return;
      }

      onClose();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          bg-card
          border
          border-border
          rounded-2xl
          shadow-2xl
          p-6
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-text text-2xl font-semibold">
              Create your channel
            </h2>

            <p className="text-secondaryText text-sm mt-1">
              Setup your YouTube profile
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-secondaryText hover:text-text text-xl"
          >
            ✕
          </button>
        </div>

        {submitError && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {submitError}
          </p>
        )}

        {/* FORM */}
        <div className="space-y-5">
          {/* NAME */}
          <div>
            <label className="text-sm text-text mb-2 block">
              Channel Name
            </label>

            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="John Doe"
              className="
                w-full
                h-12
                px-4
                rounded-xl
                bg-background
                border
                border-border
                outline-none
                text-text
              "
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-2">{errors.name}</p>
            )}
          </div>

          {/* HANDLE */}
          <div>
            <label className="text-sm text-text mb-2 block">Handle</label>

            <div
              className="
                flex
                items-center
                bg-background
                border
                border-border
                rounded-xl
                overflow-hidden
              "
            >
              <span className="px-4 text-secondaryText text-sm">youtube.com/@</span>

              <input
                type="text"
                value={channelUsername}
                onChange={(e) => setChannelUsername(e.target.value)}
                placeholder="johndoe"
                className="
                  flex-1
                  h-12
                  bg-transparent
                  outline-none
                  text-text
                  px-2
                "
              />
            </div>

            {errors.handle && (
              <p className="text-red-500 text-xs mt-2">{errors.handle}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm text-text mb-2 block">
              Description
            </label>

            <textarea
              rows={5}
              value={channelDescription}
              onChange={(e) => setChannelDescription(e.target.value)}
              placeholder="Tell viewers about your channel..."
              className="
                w-full
                bg-background
                border
                border-border
                rounded-xl
                p-4
                outline-none
                text-text
                resize-none
              "
            />

            <div className="flex justify-between mt-2">
              {errors.description ? (
                <p className="text-red-500 text-xs">{errors.description}</p>
              ) : (
                <div />
              )}

              <p className="text-secondaryText text-xs">
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
        bg-hover
        hover:bg-border
        text-text
              text-sm
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              h-10
              px-5
              rounded-full
              bg-text
              hover:opacity-90
              text-background
              text-sm
              font-medium
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? "Creating..." : "Create channel"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
