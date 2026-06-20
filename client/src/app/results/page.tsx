import { getVideosBySearchApi } from "@/api/videoApi";
import VideoContainer from "@/features/video/components/VideoContainer";
import AppShell from "@/layout/AppShell";
import { Metadata } from "next";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    search_query?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Youtube | Results",
  description: "Search results for your favorite YouTube videos.",
};

const ResultsVideos = async ({ searchQuery }: { searchQuery?: string }) => {
  if (!searchQuery) {
    return <VideoContainer videos={[]} className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4" />;
  }

  const { data } = await getVideosBySearchApi(searchQuery);
  const videos = data ?? [];

  return (
    <>
      <div className="hidden md:flex">
        <VideoContainer
          variant="playlist"
          videos={videos}
          cardClassName="mt-4"
          className="gap-2 w-full"
        />
      </div>
      <VideoContainer
        videos={videos}
        className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4"
      />
    </>
  );
};

const ResultsPage = async ({ searchParams }: Props) => {
  const { search_query } = await searchParams;

  return (
    <AppShell>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Results</h1>

        <p className="text-gray-400 my-2">
          Search Query:{" "}
          <span className="text-white font-medium">{search_query}</span>
        </p>
        <Suspense fallback={<VideoContainer videos={null} />}>
          <ResultsVideos searchQuery={search_query} />
        </Suspense>
      </div>
    </AppShell>
  );
};

export default ResultsPage;
