// components/navbar/Navbar.tsx

import {
  FaBars,
  FaYoutube,
  FaBell,
  FaMicrophone,
  FaSearch,
} from "react-icons/fa";

import { IoCreateOutline } from "react-icons/io5";
import YoutubeLogo from "./YoutubeLogo";
import SearchBar from "./SearchBar";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-14 ">
      <div className="h-full flex items-center justify-between px-4">
        {/* LEFT */}
        <div className="flex items-center gap-4 ">
          <button className="w-11 h-11 rounded-full hover:bg-text/10 flex items-center justify-center transition cursor-pointer">
            <FaBars className="text-white text-lg" size={24} />
          </button>

          <YoutubeLogo />
        </div>

        {/* CENTER */}
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
        bg-[#181818]
        hover:bg-[#2a2a2a]
        flex
        items-center
        justify-center
        transition
        shrink-0
      "
    >
      <FaMicrophone className="text-white text-sm" />
    </button>
  </div>
</div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 ">
          <button
            className="
              hidden
              sm:flex
              items-center
              gap-2
              h-[36px]
              px-4
              rounded-full
              bg-[#272727]
              hover:bg-[#3a3a3a]
              transition
            "
          >
            <IoCreateOutline className="text-white text-xl" />

            <span className="text-white text-sm font-medium">Create</span>
          </button>
 
          <button className="w-10 h-10 rounded-full hover:bg-[#272727] flex items-center justify-center transition">
            <FaBell className="text-white text-lg" />
          </button>

          <Image
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="
              w-8
              h-8
              rounded-full
              object-cover
              cursor-pointer
            "
            width={100}
            height={100}
          />
        </div>
      </div>
    </header>
  );
}
