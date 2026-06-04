"use client";

import Link from "next/link";
import { MdOutlineVideoCall } from "react-icons/md";
import { BiHistory } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useUser } from "@/libs/AuthContext";

type Props = {
  open: boolean;
  onCreateChannel: () => void;
};

export default function ProfileDropdown({ open, onCreateChannel }: Props) {
  const { logout, user } = useUser();

  if (!open) return null;

  const plan = user?.subscription?.plan ?? "free";
  const isPremium = plan.toLowerCase() === "premium";

  const expiresAt = user?.subscription?.expiresAt
    ? new Date(user.subscription.expiresAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null === user?.subscription?.expiresAt ? "lifetime" : null;

  return (
    <div className="absolute top-12 right-0 w-[260px] bg-[#212121] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden">

      {/* USER STATUS */}
      <div className="px-4 py-3 border-b border-[#333]">
        <p className="text-xs text-gray-400">Account Status</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-white">
            {isPremium ? "Premium User" : "Free User"}
          </span>

          <span
            className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${isPremium ? "bg-yellow-500 text-black" : "bg-gray-700 text-gray-200"}
            `}
          >
            {plan.toUpperCase()}
          </span>
        </div>

        {/* EXPIRY SECTION */}
        {isPremium && expiresAt && (
          <p className="text-[11px] text-gray-400 mt-2">
            Expires on <span className="text-white">{expiresAt}</span>
          </p>
        )}

        {!isPremium && (
          <p className="text-[11px] text-gray-400 mt-2">
            Upgrade to unlock premium features
          </p>
        )}
      </div>

      <div className="py-2">

        <button
          onClick={onCreateChannel}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#343434] transition text-sm text-white"
        >
          <MdOutlineVideoCall className="text-lg" />
          Create channel
        </button>

        <Link
          href="/history"
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#343434] transition text-sm text-white"
        >
          <BiHistory className="text-lg" />
          History
        </Link>

        <Link
          href="/watch-later"
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#343434] transition text-sm text-white"
        >
          <AiOutlineClockCircle className="text-lg" />
          Watch later
        </Link>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#343434] transition text-sm text-red-400"
          onClick={logout}
        >
          <FiLogOut className="text-lg" />
          Sign out
        </button>
      </div>
    </div>
  );
}