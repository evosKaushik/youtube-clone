"use client";

import Image from "next/image";

import { MdOutlineVideoCall } from "react-icons/md";
import { BiHistory } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

type Props = {
  open: boolean;
  onCreateChannel: () => void;
};

export default function ProfileDropdown({
  open,
  onCreateChannel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        absolute
        top-12
        right-0
        w-[260px]
        bg-[#212121]
        border
        border-[#3a3a3a]
        rounded-xl
        shadow-2xl
        overflow-hidden
      "
    >
      <div className="flex gap-3 p-4 border-b border-[#303030]">
        <Image
          src="https://i.pravatar.cc/100"
          alt="profile"
          width={50}
          height={50}
          className="rounded-full"
        />

        <div>
          <h3 className="text-white text-sm font-semibold">
            John Doe
          </h3>

          <p className="text-gray-400 text-xs">@johndoe</p>
        </div>
      </div>

      <div className="py-2">
        <button
          onClick={onCreateChannel}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            hover:bg-[#343434]
            transition
            text-sm
            text-white
          "
        >
          <MdOutlineVideoCall className="text-lg" />
          Create channel
        </button>

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            hover:bg-[#343434]
            transition
            text-sm
            text-white
          "
        >
          <BiHistory className="text-lg" />
          History
        </button>

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            hover:bg-[#343434]
            transition
            text-sm
            text-white
          "
        >
          <AiOutlineClockCircle className="text-lg" />
          Watch later
        </button>

        <button
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            hover:bg-[#343434]
            transition
            text-sm
            text-red-400
          "
        >
          <FiLogOut className="text-lg" />
          Sign out
        </button>
      </div>
    </div>
  );
}