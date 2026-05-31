import {
  fetchAllVideos,
  fetchVideoByIdApi,
} from "@/api/videoApi";

import { getCommentsApi } from "@/api/commentApi";
import WatchClient from "@/components/watch/WatchClient";

type Props = {
  searchParams: Promise<{
    v?: string;
  }>;
};

const WatchPage = async ({
  searchParams,
}: Props) => {
  const { v } = await searchParams;

  if (!v) {
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
        fetchVideoByIdApi(v),
        getCommentsApi(v, "Video"),
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

export default WatchPage;