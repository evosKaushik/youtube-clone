"use client";

import { getPlaylistApi } from "@/api/playlistApi";
import { useEffect, useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import VideoContainer from "../VideoContainer";
import CardSkeleton from "../CardSkeleton";

type Playlist = {
  _id: string;
  videoId: string;
  userId: string;
  type: "like" | "watchLater";
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const WatchLaterClient = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const fetchPlaylistVideo = async () => {
    try {
      const { videos } = await getPlaylistApi("watchLater");
      setVideos(videos.map((e: Playlist) => e?.videoId));
    } catch (error) {
      console.log(error);
    }finally{
        setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchPlaylistVideo();
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
          <MdOutlineWatchLater className="text-4xl" />

          <h1 className="text-4xl font-bold">Watch Later</h1>
        </div>
    {
        isLoading &&<CardSkeleton variant="playlist" />
    }
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
  );
};
export default WatchLaterClient;
