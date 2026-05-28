"use client";

import { useEffect, useState } from "react";

import AppShell from "@/layout/AppShell";

import { AiOutlineLike } from "react-icons/ai";

import { getPlaylistApi } from "@/api/playlistApi";
import VideoContainer from "@/components/VideoContainer";
import { Video } from "@/components/VideoCard";

type Playlist = {
  _id: string;
  videoId: Video;
  userId: string;
  type: "like" | "watchLater";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const LikedVideoPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const { videos } = await getPlaylistApi("like");
        setVideos(videos.map((e: Playlist) => e?.videoId));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikedVideos();
  }, []);

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
        <div className="flex-1">
          {/* Heading */}
          <div className="mb-8 flex items-center gap-3">
            <AiOutlineLike className="text-4xl" />

            <h1 className="text-4xl font-bold">Liked Videos</h1>
          </div>

        <VideoContainer
          variant="playlist"
          videos={videos}
          className="
              flex
              flex-col
              gap-6
            "
        />
        </div>
      </div>
    </AppShell>
  );
};

export default LikedVideoPage;
