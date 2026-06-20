"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaSearch } from "react-icons/fa";

const tabs = [
  "Home",
  "Videos",
  "Shorts",
  "Playlists",
  "Posts",
  "Community",
];

type Props = {
  username: string;
};

const CategoriesTabs = ({ username }: Props) => {
  const pathname = usePathname();

  const currentTab =
    pathname.split("/")[2] || "home";

  return (
    <div
      className="
        mt-8
        flex
        items-center
        gap-8
        overflow-x-auto
        border-b
        border-zinc-800
        scrollbar-hide
      "
    >
      {tabs.map((item) => {
        const lowerTab = item.toLowerCase();

        const isActive =
          currentTab === lowerTab;

        return (
          <Link
            href={
              lowerTab === "home"
                ? `/@${username}`
                : `/@${username}/${lowerTab}`
            }
            key={item}
            className={`
              group
              relative
              whitespace-nowrap
              pb-4
              text-sm
              font-medium
              transition-colors
              duration-300
              ${
                isActive
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }
            `}
          >
            {item}

            {/* Animated Underline */}
            <div
              className={`
                absolute
                bottom-0
                left-0
                h-[2px]
                w-full
                bg-white
                transition-all
                duration-500
                ease-[cubic-bezier(0.34,1.56,0.64,1)]
                origin-center
                ${
                  isActive
                    ? "scale-x-100 opacity-100"
                    : "scale-x-0 opacity-0"
                }
              `}
            />
          </Link>
        );
      })}
    </div>
  );
};

export default CategoriesTabs;