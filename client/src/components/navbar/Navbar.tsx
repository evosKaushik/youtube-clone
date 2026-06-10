"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { FaBell, FaMicrophone } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";

import YoutubeLogo from "./YoutubeLogo";
import SearchBar from "./SearchBar";
import SidebarButton from "./SidebarButton";
import ProfileDropdown from "./ProfileDropdown";
import CreateChannelDialog from "./CreateChannelDialog";

import { useUser } from "@/libs/AuthContext";
import useMedia from "@/hooks/useMedia";
import BottomNavigation from "./BottomNavigation";

export default function Navbar() {
  const { user, loading, loginWithGoogle } = useUser();
  const isSmallerDevice = useMedia("sm");


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

              <button
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
              </button>
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
              className="
                w-10
                h-10
                rounded-full
                hover:bg-hover
                flex
                items-center
                justify-center
                transition
              "
            >
              <FaBell className="text-text text-lg" />
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
                <button
                  onClick={loginWithGoogle}
                  className="
                    px-4
                    h-9
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
                  Sign In
                </button>
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
