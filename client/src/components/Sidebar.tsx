"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { TiHome } from "react-icons/ti";
import { SiYoutubeshorts } from "react-icons/si";

import {
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdOutlineFileDownload,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

import { RiHistoryLine, RiPlayList2Line } from "react-icons/ri";

import { AiOutlineLike } from "react-icons/ai";

import { IoPersonOutline } from "react-icons/io5";

import { useSidebarStore } from "@/store/useSidebarStore";
import { usePathname } from "next/navigation";

const subscriptions: { name: string; avatar: string; href: string }[] = [];

const youSection = [
  {
    name: "Your channel",
    icon: <IoPersonOutline size={24} />,
  },
  {
    name: "History",
    icon: <RiHistoryLine size={24} />,
    href: "/history",
  },
  {
    name: "Playlists",
    icon: <RiPlayList2Line size={24} />,
  },
  {
    name: "Watch later",
    icon: <MdOutlineWatchLater size={24} />,
    href: "/watch-later",
  },
  {
    name: "Liked videos",
    icon: <AiOutlineLike size={24} />,
    href: "/liked-video",
  },
  {
    name: "Your videos",
    icon: <MdOutlineVideoLibrary size={24} />,
  },
  {
    name: "Downloads",
    icon: <MdOutlineFileDownload size={24} />,
  },
];

const Sidebar = () => {
  const isOpen = useSidebarStore((s) => s.isOpen);
  const isOverlay = useSidebarStore((s) => s.isOverlay);
  const closeOverlay = useSidebarStore((s) => s.closeOverlay);
  const pathname = usePathname();
  const isWatchPage = pathname === "/watch";

  const showText = isOpen || isOverlay;
  

  return (
    <>
      {/* Mobile Overlay */}
      {isOverlay && (
        <div
          onClick={closeOverlay}
          className="
            fixed inset-0 z-40
            bg-black/50
          "
        />
      )}

      <aside
        className={clsx(
          `
            thin-scrollbar
            fixed top-14 left-0 z-50
            h-[calc(100vh-56px)]
            overflow-y-auto
            bg-background
            text-text
            transition-all duration-300
          `,
          {
            "w-60 px-3": isOpen && !isOverlay,
            "w-20 px-2 overflow-x-hidden": !isOpen && !isOverlay,
            "w-60 px-3 translate-x-0": isOverlay,
            "-translate-x-full": !isOverlay,
            "lg:translate-x-0": !isWatchPage,
          },
        )}
      >
        {/* Top Menu */}
        <ul className="space-y-1 border-b border-border pb-4">
          <li>
            <Link
              href="/"
              className={clsx(
                `
                  flex rounded-xl py-3
                  transition hover:bg-hover
                `,
                {
                  "items-center gap-6 px-3": showText,
                  "justify-center": !showText,
                },
              )}
            >
              <TiHome size={28} />

              {showText && (
                <span className="text-[15px] font-medium whitespace-nowrap">
                  Home
                </span>
              )}
            </Link>
          </li>

          <li>
            <Link
              href="/shorts"
              className={clsx(
                `
                  flex rounded-xl py-3
                  transition hover:bg-hover
                `,
                {
                  "items-center gap-6 px-3": showText,
                  "justify-center": !showText,
                },
              )}
            >
              <SiYoutubeshorts size={24} />

              {showText && (
                <span className="text-[15px] font-medium whitespace-nowrap">
                  Shorts
                </span>
              )}
            </Link>
          </li>
        </ul>

        {/* Subscriptions */}
        {showText && (
          <div className="border-b border-border py-4">
            <div className="mb-3 flex items-center gap-1 px-3">
              <h2 className="text-lg font-semibold">Subscriptions</h2>

              <MdOutlineKeyboardArrowRight size={22} />
            </div>

            <ul className="space-y-1">
              {subscriptions.map((channel, index) => (
                <li key={index}>
                  <Link
                    href={channel.href}
                    className="
                        flex items-center gap-4
                        rounded-xl px-3 py-2.5
                        transition hover:bg-hover
                      "
                  >
                    <Image
                      src={channel.avatar}
                      alt={channel.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />

                    <span className="truncate text-[15px]">{channel.name}</span>

                    <div
                      className="
                          ml-auto h-2 w-2
                          rounded-full bg-blue-500
                        "
                    />
                  </Link>
                </li>
              ))}

              {subscriptions.length === 0 && (
                <li className="px-3 py-2.5 text-sm text-secondaryText">
                  No subscriptions yet
                </li>
              )}
            </ul>
          </div>
        )}

        {/* You Section */}
        <div className="py-4">
          {showText && (
            <div className="mb-3 flex items-center gap-1 px-3">
              <h2 className="text-lg font-semibold">You</h2>

              <MdOutlineKeyboardArrowRight size={22} />
            </div>
          )}

          <ul className="space-y-1">
            {youSection.map((item, index) => (
              <li key={index}>
                <Link
                  href={item?.href || "/"}
                  className={clsx(
                    `
                      flex rounded-xl py-3
                      transition hover:bg-hover
                    `,
                    {
                      "items-center gap-6 px-3": showText,
                      "justify-center": !showText,
                    },
                  )}
                >
                  {item.icon}

                  {showText && (
                    <span className="text-[15px] whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
