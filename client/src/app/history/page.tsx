import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";
import {
  RiHistoryLine,
  RiSearchLine,
  RiDeleteBin6Line,
  RiSettings3Line,
} from "react-icons/ri";

import { Metadata } from 'next';
import AppShell from "@/layout/AppShell";

export const metadata: Metadata = {
  title: 'Youtube | History',
  description: 'Watch your YouTube watch history, manage it, and clear it if you want. See all the videos you have watched on YouTube in one place.',
};


const HistoryPage = () => {


  return (
    <AppShell>
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1800px]
          gap-10
          px-4
          py-6
          lg:px-8
        "
      >
        {/* LEFT SIDE */}
        <div className="flex-1">
          {/* Heading */}
          <div className="mb-8 flex items-center gap-3">
            <RiHistoryLine className="text-4xl" />

            <h1 className="text-4xl font-bold">Watch history</h1>
          </div>

          {/* TODAY */}
          <div>
            <h2 className="mb-5 text-xl font-semibold">Today</h2>

            <PlaylistVideoContainer
              className="
                flex
                flex-col
                gap-6
              "
              cardClassName="
                flex
                flex-row
                gap-4
              "
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <aside
          className="
            sticky
            top-20
            hidden
            h-fit
            w-[340px]
            shrink-0
            lg:block
          "
        >
          {/* Search */}
          <div
            className="
              mb-8
              flex
              items-center
              gap-3
              border-b
              border-zinc-700
              pb-3
            "
          >
            <RiSearchLine className="text-xl text-zinc-400" />

            <input
              type="text"
              placeholder="Search watch history"
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-zinc-400
              "
            />
          </div>

          {/* OPTIONS */}
          <div className="flex flex-col gap-6">
            <button
              className="
                flex
                items-center
                gap-4
                text-sm
                font-medium
                transition-colors
                hover:text-zinc-300
              "
            >
              <RiDeleteBin6Line className="text-xl" />
              Clear all watch history
            </button>

            <button
              className="
                flex
                items-center
                gap-4
                text-sm
                font-medium
                transition-colors
                hover:text-zinc-300
              "
            >
              <RiHistoryLine className="text-xl" />
              Pause watch history
            </button>

            <button
              className="
                flex
                items-center
                gap-4
                text-sm
                font-medium
                transition-colors
                hover:text-zinc-300
              "
            >
              <RiSettings3Line className="text-xl" />
              Manage all history
            </button>

            {/* EXTRA LINKS */}
            <div className="mt-3 flex flex-col gap-4 pl-9 text-sm text-zinc-400">
              <p className="cursor-pointer hover:text-white">Comments</p>

              <p className="cursor-pointer hover:text-white">Posts</p>

              <p className="cursor-pointer hover:text-white">Live chat</p>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default HistoryPage;