import PlaylistVideoContainer from "@/components/PlaylistVideoContainer";
import VideoContainer from "@/components/VideoContainer";
import AppShell from "@/layout/AppShell";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{
    search_query?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Youtube | Results",
  description: "Search results for your favorite YouTube videos.",
};
const ResultsPage = async ({ searchParams }: Props) => {
  const { search_query } = await searchParams;

  return (
    <AppShell>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Results</h1>

        <p className="text-gray-400 mt-2">
          Search Query:{" "}
          <span className="text-white font-medium">{search_query}</span>
        </p>

        <div className="hidden md:flex">
          <PlaylistVideoContainer className="gap-2" />
        </div>
        <VideoContainer className="grid  grid-cols-1 sm:grid-cols-2 md:hidden gap-4" />
      </div>
    </AppShell>
  );
};

export default ResultsPage;
