import { fetchAllVideos } from "@/api/videoApi";
import CardSkeleton from "@/components/CardSkeleton";
import VideoContainer from "@/components/VideoContainer";

import AppShell from "@/layout/AppShell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const videos = await fetchAllVideos();
  // console.log(videos)
  return (
    <AppShell>
      <section className="p-6">
        <VideoContainer
          videos={videos}
          className="        
              grid 
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-5
              thin-scrollbar
              "
        />
      </section>
    </AppShell>
  );
}
