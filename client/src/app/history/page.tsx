"use client";

import { useEffect, useState } from "react";
import { getHistoryVideos } from "@/api/videoApi";
import PlaylistVideoContainer from "@/features/playlists/components/PlaylistVideoContainer";
import AuthGuard from "@/components/common/AuthGuard";
import { Video } from "@/types/entities";

import {
  RiHistoryLine,
  RiSearchLine,
  RiDeleteBin6Line,
  RiSettings3Line,
} from "react-icons/ri";

export default function HistoryPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getHistoryVideos();

      if (data && Array.isArray(data)) {
        // Extract the populated videoId from each history record
        const mapped = data
          .map((item: any) => item?.videoId)
          .filter(Boolean);
        setVideos(mapped);
      }
    };

    fetchHistory();
  }, []);

  return (
    <AuthGuard>
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
        <div className="flex-1 min-w-0">
          <div className="mb-8 flex items-center gap-3">
            <RiHistoryLine className="text-4xl shrink-0" />
            <h1 className="text-2xl sm:text-4xl font-bold">Watch history</h1>
          </div>

          <div>
            <h2 className="mb-5 text-xl font-semibold">Today</h2>

            <PlaylistVideoContainer
              videos={videos}
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
              border-border
              pb-3
            "
          >
            <RiSearchLine className="text-xl text-secondaryText" />

            <input
              type="text"
              placeholder="Search watch history"
              className="
                w-full
                bg-transparent
                text-sm
                outline-none
                placeholder:text-secondaryText text-text
              "
            />
          </div>

          <div className="flex flex-col gap-6">
            <button className="flex items-center gap-4 text-sm font-medium text-text">
              <RiDeleteBin6Line className="text-xl" />
              Clear all watch history
            </button>

            <button className="flex items-center gap-4 text-sm font-medium text-text">
              <RiHistoryLine className="text-xl" />
              Pause watch history
            </button>

            <button className="flex items-center gap-4 text-sm font-medium text-text">
              <RiSettings3Line className="text-xl" />
              Manage all history
            </button>
          </div>
        </aside>
      </div>
    </AuthGuard>
  );
}