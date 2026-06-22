"use client";

import { useEffect, useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { getDownloadedVideos } from "@/api/videoApi";
import VideoContainer from "@/features/video/components/VideoContainer";
import AuthGuard from "@/components/common/AuthGuard";
import AppShell from "@/layout/AppShell";
import { Video } from "@/types/entities";

type DownloadItem = {
  _id: string;
  videoId: Video;
  createdAt: string;
};

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const data = await getDownloadedVideos();
        if (Array.isArray(data)) {
          setDownloads(data.map((d: DownloadItem) => d.videoId).filter(Boolean));
        } else if (data?.data) {
          setDownloads(data.data.map((d: DownloadItem) => d.videoId).filter(Boolean));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  return (
    <AuthGuard>
      <AppShell>
        <div className="mx-auto flex w-full max-w-[1800px] gap-10 px-4 py-6 lg:px-8">
          <div className="flex-1 min-w-0">
            {/* Heading */}
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center">
                <MdOutlineFileDownload className="text-2xl text-text" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Downloads</h1>
                <p className="text-sm text-secondaryText mt-0.5">
                  {loading ? "Loading..." : `${downloads.length} downloaded videos`}
                </p>
              </div>
            </div>

            {!loading && downloads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                  <MdOutlineFileDownload className="text-3xl text-secondaryText" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No downloads yet</h3>
                <p className="text-sm text-secondaryText max-w-sm">
                  Videos you download will appear here. Start downloading from any video&apos;s download button.
                </p>
              </div>
            ) : (
              <VideoContainer
                variant="playlist"
                videos={loading ? null : downloads}
                className="flex flex-col gap-4"
              />
            )}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
};

export default DownloadsPage;
