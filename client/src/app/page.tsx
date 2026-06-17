import { fetchAllVideos } from "@/api/videoApi";
import VideoContainer from "@/components/VideoContainer";
import { Suspense } from "react";



import AppShell from "@/layout/AppShell";

export const dynamic = "force-dynamic";

const HomeVideos = async () => {
  const videos = await fetchAllVideos();

  return (
    <VideoContainer
      videos={videos}
      className="        
              grid 
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-5
              thin-scrollbar
            
              "
    />
  );
};

export default async function Home() {
  return (
     

    <AppShell>
      <section className="p-6">
        <Suspense fallback={<VideoContainer videos={null} />}>
          <HomeVideos />
        </Suspense>
      </section>
    </AppShell>
   
  );
}
