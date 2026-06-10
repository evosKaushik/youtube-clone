import {
  fetchAllVideos,
  fetchVideoByIdApi,
} from "@/api/videoApi";

import { getCommentsApi } from "@/api/commentApi";
import WatchClient from "@/components/watch/WatchClient";
import WatchSkeleton from "@/components/watch/WatchSkeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    v?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { v } = await searchParams;

  if (!v) {
    return {
      title: "Watch | YouTube Clone",
      description: "Watch videos on YouTube Clone",
    };
  }

  const video = await fetchVideoByIdApi(v).catch(() => null);

  if (!video) {
    return {
      title: "Video not found | YouTube Clone",
      description: "This video could not be found",
    };
  }

  return {
    title: `${video.name} | YouTube Clone`,
    description: video.description || `Watch ${video.name}`,
  };
}

const WatchContent = async ({ videoId }: { videoId?: string }) => {
  if (!videoId) {
    return (
      <div className="h-screen flex items-center justify-center">
        Video not found
      </div>
    );
  }

  try {
    const [videos, currentVideo, comments] =
      await Promise.all([
        fetchAllVideos(),
        fetchVideoByIdApi(videoId).catch(() => null),
        getCommentsApi(videoId, "Video"),
      ]);

    return (
      <WatchClient
        initialVideos={videos || []}
        initialVideo={currentVideo || null}
        initialComments={comments || []}
      />
    );
  } catch (error) {
    console.log(error);

    return (
      <div className="h-screen flex items-center justify-center">
        Something went wrong
      </div>
    );
  }
};

const WatchPage = async ({
  searchParams,
}: Props) => {
  const { v } = await searchParams;

  return (
    <Suspense fallback={<WatchSkeleton />}>
      <WatchContent videoId={v} />
    </Suspense>
  );
};

export default WatchPage;