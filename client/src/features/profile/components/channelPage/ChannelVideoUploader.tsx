"use client";

import { BiUpload } from "react-icons/bi";

const ChannelVideoUploader = () => {
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    console.log(file);

    // TODO:
    // Upload API Route Here
  };

  return (
    <div
      className="
        mt-8
        rounded-2xl
        border
        border-dashed
        border-border
        bg-card/40
        p-4
        sm:p-6
        transition
        hover:border-border
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          gap-4
          py-10
          text-center
        "
      >
        {/* Icon */}
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-hover
          "
        >
          <BiUpload
            className="text-text"
            size={30}
          />
        </div>

        {/* Text */}
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-text
            "
          >
            Upload a video
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-secondaryText
            "
          >
            Drag and drop video files to upload
          </p>

          <p
            className="
              mt-1
              text-xs
              text-secondaryText
            "
          >
            MP4, WebM, MOV or AVI • Up to
            100MB
          </p>
        </div>

        {/* Upload Button */}
        <label
          className="
            mt-2
            inline-flex
            cursor-pointer
            items-center
            gap-2
            rounded-full
            bg-white
            px-5
            py-2.5
            text-sm
            font-medium
            text-black
            transition
            hover:scale-[1.02]
            hover:bg-hover
            active:scale-[0.98]
          "
        >
          <BiUpload size={18} />

          Select Video

          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default ChannelVideoUploader;