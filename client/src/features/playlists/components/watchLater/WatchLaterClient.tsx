"use client";

import { getPlaylistApi } from "@/api/playlistApi";
import { downloadVideoById } from "@/api/videoApi";
import { useEffect, useState } from "react";
import { MdOutlineWatchLater } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import { PlaylistItem, Video } from "@/types/entities";
import VideoContainer from "@/features/video/components/VideoContainer";
import toast from "react-hot-toast";

const WatchLaterClient = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [downloading, setDownloading] = useState(false);
  

  const fetchPlaylistVideo = async () => {
    try {
      const { videos } = await getPlaylistApi("watchLater");
      setVideos(videos.map((e: PlaylistItem) => e?.videoId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadAll = async () => {
    if (videos.length === 0) {
      toast.error("No videos to download");
      return;
    }
    setDownloading(true);
    toast.success(`Downloading ${videos.length} videos...`);
    for (const video of videos) {
      try {
        await downloadVideoById(video._id);
      } catch (error) {
        console.error(`Failed to download ${video.name}:`, error);
      }
    }
    setDownloading(false);
    toast.success("Download complete!");
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3">
          <div className="flex items-center gap-3">
            <MdOutlineWatchLater className="text-4xl" />
            <h1 className="text-3xl sm:text-4xl font-bold">Watch Later</h1>
          </div>

          {videos.length > 0 && (
            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-hover border border-border transition text-sm font-medium w-fit disabled:opacity-50"
            >
              <FaDownload className={downloading ? "animate-pulse" : ""} />
              {downloading ? "Downloading..." : `Download All (${videos.length})`}
            </button>
          )}
        </div>
        <VideoContainer
          variant="playlist"
          videos={videos}
          className="
              flex
              flex-col
              gap-4
            "
        />
        
      </div>
    </div>
  );
};
export default WatchLaterClient;
