"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { FaBell, FaMicrophone } from "react-icons/fa";
import { IoCall, IoCreateOutline } from "react-icons/io5";
import { FiSun, FiMoon } from "react-icons/fi";

import YoutubeLogo from "./YoutubeLogo";
import SearchBar from "./SearchBar";
import SidebarButton from "./SidebarButton";
import ProfileDropdown from "./ProfileDropdown";
import CreateChannelDialog from "./CreateChannelDialog";

import { useUser } from "@/libs/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import useMedia from "@/hooks/useMedia";
import BottomNavigation from "./BottomNavigation";
import { usePopup } from "@/contexts/popupContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useUser();
  const { theme, toggleTheme } = useTheme();
  const isSmallerDevice = useMedia("sm");

  const { showPopup, hidePopup } = usePopup();

  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);

  const [channelDialogOpen, setChannelDialogOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCallBtn = () => {
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
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Custom Room ID"
                className="
      w-full
      rounded-xl
      border
      border-border
      bg-background
      px-4
      py-3
      text-text
    "
              />
            ),

            selfClose: true,

            button1: {
              label: "Cancel",
              action: hidePopup,
            },

            button2: {
              label: "Join",

              action: () => {
                if (!roomId) return;
                router.push(`/call/${roomId}`);

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
                  id="create-room-id"
                  placeholder="Custom Room ID"
                  className="
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-900
                px-4
                py-3
                text-white
              "
                />
              </div>
            ),

            selfClose: true,

            button1: {
              label: "Cancel",
              action: hidePopup,
            },

            button2: {
              label: "Create",

              action: async () => {
                const input = document.getElementById(
                  "create-room-id",
                ) as HTMLInputElement;

                const roomId = input?.value.trim();

                if (!roomId) return;

                const link = `${window.location.origin}/call/${roomId}`;

                showPopup({
                  header: "Room Created",

                  body: (
                    <div className="flex flex-col gap-3">
                      <input
                        readOnly
                        value={link}
                        className="
                      w-full
                      rounded-xl
                      border
                      border-zinc-700
                      bg-zinc-900
                      px-4
                      py-3
                      text-white
                    "
                      />
                    </div>
                  ),

                  selfClose: true,

                  button1: {
                    label: "Copy Link",

                    action: async () => {
                      await navigator.clipboard.writeText(link);
                    },
                  },

                  button2: {
                    label: "Enter Room",

                    action: () => {
                      // const link = `${window.location.origin}/call/${roomId}`;
                      router.push(`/call/${roomId}`);
                      // window.location.href = link
                      
                      hidePopup();

                    },
                  },
                });
              },
            },
          });
        },
      },
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-14 bg-background border-b border-border">
        <div className="h-full flex items-center justify-between px-4">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <SidebarButton />

            <Link href="/">
              <YoutubeLogo />
            </Link>
          </div>

          {/* CENTER */}
          <div className="flex flex-1 justify-center px-2 md:px-10 min-w-0">
            <div className="flex items-center w-full max-w-[720px] min-w-0">
              <SearchBar />

              {/* <button
                className="
                  ml-2 md:ml-4
                  min-w-10
                  w-10
                  h-10
                  rounded-full
                  bg-card
                  hover:bg-hover
                  hidden
                  sm:flex
                  items-center
                  justify-center
                  transition
                  shrink-0
                "
              >
                <FaMicrophone className="text-text text-sm " />
              </button> */}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 relative" ref={profileRef}>
            <Link
              href="/upload"
              className="
                hidden
                sm:flex
                items-center
                gap-2
                h-[36px]
                px-4
                rounded-full
                bg-card
                hover:bg-hover
                transition
              "
            >
              <IoCreateOutline className="text-text text-xl" />

              <span className="text-text text-sm font-medium">Create</span>
            </Link>

            <button
              onClick={handleCallBtn}
              className="
                hidden
                sm:flex
                items-center
                gap-2
                h-9
                px-4
                rounded-full
                bg-card
                hover:bg-hover
                transition
              "
            >
              <IoCall className="text-text text-xl" />
              <span className="text-text text-sm font-medium">Call</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="
                hidden
                sm:flex
                items-center
                justify-center
                h-9
                w-9
                rounded-full
                bg-card
                hover:bg-hover
                transition
              "
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <FiSun className="text-text text-lg" />
              ) : (
                <FiMoon className="text-text text-lg" />
              )}
            </button>

            <div className="hidden sm:block">
              {loading ? (
                <div
                  className="
                    w-20
                    h-9
                    rounded-full
                    bg-card
                    animate-pulse
                  "
                />
              ) : user ? (
                <>
                  <button
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="rounded-full overflow-hidden"
                  >
                    <Image
                      src={
                        user.profilePicture || "https://github.com/shadcn.png"
                      }
                      alt={user.name}
                      width={100}
                      height={100}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                  <ProfileDropdown
                    open={profileOpen}
                    onCreateChannel={() => {
                      setChannelDialogOpen(true);
                      setProfileOpen(false);
                    }}
                  />
                </>
              ) : (
                <Link
                  href="/signup"
                  className="
                    px-4
                
                    py-2
                    rounded-full
                    border
                    border-border
                    text-blue-500
                    hover:bg-hover
                    transition
                    text-sm
                    font-medium
                  "
                >
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {!isSmallerDevice && (
        <CreateChannelDialog
          open={channelDialogOpen}
          onClose={() => setChannelDialogOpen(false)}
        />
      )}

      {isSmallerDevice && <BottomNavigation />}
    </>
  );
}
