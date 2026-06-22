"use client";

import Link from "next/link";
import { MdOutlineVideoCall } from "react-icons/md";
import { BiHistory, BiUser } from "react-icons/bi";
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
  const isPremium = plan.toLowerCase() !== "free";

  const expiresAt = user?.subscription?.expiresAt
    ? new Date(user.subscription.expiresAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null === user?.subscription?.expiresAt ? "lifetime" : null;

  return (
    <div className="absolute top-12 right-0 w-[260px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden">

      {/* USER STATUS */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-secondaryText">Account Status</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-text">
            {isPremium ? "Premium User" : "Free User"}
          </span>

          <span
            className={`
              text-xs px-2 py-1 rounded-full font-medium
              ${isPremium ? "bg-yellow-500 text-black" : "bg-card text-secondaryText"}
            `}
          >
            {plan.toUpperCase()}
          </span>
        </div>

        {/* EXPIRY SECTION */}
        {isPremium && expiresAt && (
          <p className="text-[11px] text-secondaryText mt-2">
            Expires on <span className="text-text">{expiresAt}</span>
          </p>
        )}

        {!isPremium && (
          <p className="text-[11px] text-secondaryText mt-2">
            Upgrade to unlock premium features
          </p>
        )}
      </div>

      <div className="py-2">
        <Link href="/profile" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition text-sm text-text">
        <BiUser />
        <span>Profile</span>
        </Link>

        <button
          onClick={onCreateChannel}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition text-sm text-text"
        >
          <MdOutlineVideoCall className="text-lg" />
          Create channel
        </button>

        <Link
          href="/history"
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition text-sm text-text"
        >
          <BiHistory className="text-lg" />
          History
        </Link>

        <Link
          href="/watch-later"
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition text-sm text-text"
        >
          <AiOutlineClockCircle className="text-lg" />
          Watch later
        </Link>

        <button
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-hover transition text-sm text-red-400"
          onClick={logout}
        >
          <FiLogOut className="text-lg" />
          Sign out
        </button>
      </div>
    </div>
  );
}