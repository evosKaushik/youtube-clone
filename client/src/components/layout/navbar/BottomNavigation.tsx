import {
  GoHistory,
  GoHome,
  GoPlus,
} from "react-icons/go";
import { IoCall } from "react-icons/io5";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/libs/AuthContext";
import { usePopup } from "@/contexts/popupContext";
import { useRouter } from "next/navigation";

type NavItem =
  | { title: string; icon: React.ReactNode; link: string; isButton: false }
  | { title: string; icon: React.ReactNode; isButton: true; onClick: () => void };

const BottomNavigation = () => {
  const { user } = useUser();
  const { showPopup, hidePopup } = usePopup();
  const router = useRouter();
  const pathName = usePathname();

  const handleCallBtn = () => {
    let callRoomId = "";
    showPopup({
      header: "Video Call",
      popupMsg: "Create a new room or join an existing room",
      selfClose: true,
      button1: {
        label: "Join Call",
        action: () => {
          showPopup({
            header: "Join Call",
            body: (
              <input
                id="bottom-join-room-id"
                defaultValue=""
                onChange={(e) => { callRoomId = e.target.value; }}
                placeholder="Custom Room ID"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-text"
              />
            ),
            selfClose: true,
            button1: { label: "Cancel", action: hidePopup },
            button2: {
              label: "Join",
              action: () => {
                if (!callRoomId) return;
                router.push(`/call/${callRoomId}`);
                hidePopup();
              },
            },
          });
        },
      },
      button2: {
        label: "Create Call",
        action: () => {
          showPopup({
            header: "Create Room",
            body: (
              <div className="flex flex-col gap-3">
                <input
                  id="bottom-call-room-id"
                  placeholder="Custom Room ID"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                />
              </div>
            ),
            selfClose: true,
            button1: { label: "Cancel", action: hidePopup },
            button2: {
              label: "Create",
              action: async () => {
                const input = document.getElementById("bottom-call-room-id") as HTMLInputElement;
                const roomId = input?.value.trim();
                if (!roomId) return;
                const link = `${window.location.origin}/call/${roomId}`;
                showPopup({
                  header: "Room Created",
                  body: (
                    <div className="flex flex-col gap-3">
                      <input readOnly value={link} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white" />
                    </div>
                  ),
                  selfClose: true,
                  button1: {
                    label: "Copy Link",
                    action: async () => { await navigator.clipboard.writeText(link); },
                  },
                  button2: {
                    label: "Enter Room",
                    action: () => { router.push(`/call/${roomId}`); hidePopup(); },
                  },
                });
              },
            },
          });
        },
      },
    });
  };

  const navList: NavItem[] = [
    {
      title: "Home",
      icon: <GoHome size={24} />,
      link: "/",
      isButton: false,
    },
    {
      title: "Call",
      icon: <IoCall size={24} />,
      isButton: true,
      onClick: handleCallBtn,
    },
    {
      title: "Create",
      icon: <GoPlus size={24} />,
      link: "/upload",
      isButton: false,
    },
    {
      title: "History",
      icon: <GoHistory size={24} />,
      link: "/history",
      isButton: false,
    },
    {
      title: user ? "Profile" : "Sign in",
      icon: user ? (
        <Image
          src={user?.profilePicture || "https://github.com/shadcn.png"}
          alt={user?.name || "avatar"}
          width={40}
          height={40}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full border-2 border-secondaryText flex items-center justify-center">
          <span className="text-secondaryText text-lg font-semibold">?</span>
        </div>
      ),
      link: user ? "/profile" : "/signin",
      isButton: false,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-t border-border shadow-xl">
      <ul className="flex items-center justify-between h-full px-3 relative">
        {navList.map((navItem, index) => {
          // For button-type items (Call), render a button
          if (navItem.isButton) {
            return (
              <li key={index} className="flex-1">
                <button
                  onClick={navItem.onClick}
                  className="relative flex flex-col items-center justify-center h-full w-full group"
                >
                  <div className="text-secondaryText group-hover:text-text group-hover:scale-105 transition-all duration-200 ease-out">
                    {navItem.icon}
                  </div>
                  {navItem.title && (
                    <span className="text-[11px] mt-1 text-secondaryText transition-all duration-200">
                      {navItem.title}
                    </span>
                  )}
                </button>
              </li>
            );
          }

          // For link-type items
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