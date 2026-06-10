import {
  GoHistory,
  GoHome,
  GoPlus,
} from "react-icons/go";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/libs/AuthContext";

const BottomNavigation = () => {
  const { user } = useUser();
  const pathName = usePathname();

  const navList = [
    {
      title: "Home",
      icon: <GoHome size={24} />,
      link: "/",
    },
    {
      title: "Create",
      icon: <GoPlus size={24} />,
      link: "/upload",
    },
    {
      title: "History",
      icon: <GoHistory size={24} />,
      link: "/history",
    },
    {
      title: "Profile",
      icon: (
        <Image
          src={user?.profilePicture || "https://github.com/shadcn.png"}
          alt={user?.name || "avatar"}
          width={40}
          height={40}
          className="w-8 h-8 rounded-full object-cover"
        />
      ),
      link: "/profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-t border-border shadow-xl">
      <ul className="flex items-center justify-between h-full px-3 relative">
        {navList.map((navItem, index) => {
          const isActive =
            navItem.link === "/"
              ? pathName === "/"
              : pathName.startsWith(navItem.link);

          return (
            <li key={index} className="flex-1">
              <Link
                href={navItem.link}
                className="relative flex flex-col items-center justify-center h-full group"
              >
                {/* ICON */}
                <div
                  className={`transition-all duration-200 ease-out transform ${
                    isActive
                      ? "text-text scale-110 -translate-y-0.5"
                      : "text-secondaryText group-hover:text-text group-hover:scale-105"
                  }`}
                >
                  {navItem.icon}
                </div>

                {/* LABEL */}
                {navItem.title && (
                  <span
                    className={`text-[11px] mt-1 transition-all duration-200 ${
                      isActive ? "text-text" : "text-secondaryText"
                    }`}
                  >
                    {navItem.title}
                  </span>
                )}

                {/* ACTIVE INDICATOR */}
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-text rounded-full animate-pulse" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavigation;