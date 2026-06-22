"use client";

import { useEffect, useState } from "react";

import AppShell from "@/layout/AppShell";
import AuthGuard from "@/components/common/AuthGuard";
import { AiOutlineLike } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";

import { getPlaylistApi } from "@/api/playlistApi";
import { downloadVideoById } from "@/api/videoApi";
import VideoContainer from "@/features/video/components/VideoContainer";
import { PlaylistItem, Video } from "@/types/entities";
import toast from "react-hot-toast";

const LikedVideoPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const { videos } = await getPlaylistApi("like");
        setVideos(videos.map((e: PlaylistItem) => e?.videoId));
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikedVideos();
  }, []);

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

  return (
    <AuthGuard>
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
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3">
              <div className="flex items-center gap-3">
                <AiOutlineLike className="text-4xl" />
                <h1 className="text-3xl sm:text-4xl font-bold">Liked Videos</h1>
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
                gap-6
              "
          />
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
};

export default LikedVideoPage;
