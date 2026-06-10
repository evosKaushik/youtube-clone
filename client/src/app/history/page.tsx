"use client";

import { useEffect, useState } from "react";
import { getHistoryVideos } from "@/api/videoApi";
import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";

import {
  RiHistoryLine,
  RiSearchLine,
  RiDeleteBin6Line,
  RiSettings3Line,
} from "react-icons/ri";
import VideoContainer from "@/components/VideoContainer";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log("Fetching history...");

      const data = await getHistoryVideos();

      console.log("API Response:", data);

      setHistory(data || []);
    };

    fetchHistory();
  }, []);

  return (
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
      <div className="flex-1">
        <div className="mb-8 flex items-center gap-3">
          <RiHistoryLine className="text-4xl" />
          <h1 className="text-4xl font-bold">Watch history</h1>
        </div>

        <div>
          <h2 className="mb-5 text-xl font-semibold">Today</h2>

          <pre className="mb-5">
            {JSON.stringify(history, null, 2)}
            {/* <VideoContainer variant="playlist" videos={history}/>   */}
          </pre>

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

        <div className="flex flex-col gap-6">
          <button className="flex items-center gap-4 text-sm font-medium">
            <RiDeleteBin6Line className="text-xl" />
            Clear all watch history
          </button>

          <button className="flex items-center gap-4 text-sm font-medium">
            <RiHistoryLine className="text-xl" />
            Pause watch history
          </button>

          <button className="flex items-center gap-4 text-sm font-medium">
            <RiSettings3Line className="text-xl" />
            Manage all history
          </button>
        </div>
      </aside>
    </div>
  );
}