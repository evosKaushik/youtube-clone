// components/navbar/Navbar.tsx

import {
  FaBars,
  FaYoutube,
  FaBell,
  FaMicrophone,
  FaSearch,
} from "react-icons/fa";

import { IoCreateOutline } from "react-icons/io5";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-[56px] bg-[#0f0f0f] border-b border-[#272727]">
      <div className="h-full flex items-center justify-between px-4">
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-fit">
          <button className="w-10 h-10 rounded-full hover:bg-[#272727] flex items-center justify-center transition">
            <FaBars className="text-white text-lg" />
          </button>

          <div className="flex items-center cursor-pointer select-none">
            <FaYoutube className="text-[#ff0000] text-[32px]" />

            <div className="flex items-start ml-1">
              <span className="text-white font-medium text-[22px] tracking-[-1px] leading-none">
                YouTube
              </span>

              <span className="text-[#aaa] text-[10px] ml-1 mt-[2px]">
                IN
              </span>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="hidden md:flex flex-1 justify-center px-10">
          <div className="flex items-center w-full max-w-[720px]">
            {/* SEARCH BOX */}
            <div className="flex flex-1 h-[40px]">
              <input
                type="text"
                placeholder="Search"
                className="
                  flex-1
                  bg-[#121212]
                  border
                  border-[#303030]
                  rounded-l-full
                  px-4
                  text-white
                  text-[16px]
                  outline-none
                  focus:border-blue-500
                "
              />

              <button
                className="
                  w-[64px]
                  bg-[#222222]
                  border
                  border-l-0
                  border-[#303030]
                  rounded-r-full
                  flex
                  items-center
                  justify-center
                  hover:bg-[#2f2f2f]
                  transition
                "
              >
                <FaSearch className="text-white text-lg" />
              </button>
            </div>

            {/* MIC */}
            <button
              className="
                ml-4
                min-w-[40px]
                h-[40px]
                rounded-full
                bg-[#181818]
                hover:bg-[#2a2a2a]
                flex
                items-center
                justify-center
                transition
              "
            >
              <FaMicrophone className="text-white text-sm" />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 min-w-fit">
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

            <span className="text-white text-sm font-medium">
              Create
            </span>
          </button>

          <button className="w-10 h-10 rounded-full hover:bg-[#272727] flex items-center justify-center transition">
            <FaBell className="text-white text-lg" />
          </button>

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="
              w-8
              h-8
              rounded-full
              object-cover
              cursor-pointer
            "
          />
        </div>
      </div>
    </header>
  );
}