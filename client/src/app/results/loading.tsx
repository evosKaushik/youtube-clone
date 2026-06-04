import AppShell from "@/layout/AppShell";
import VideoContainer from "@/components/VideoContainer";

const Loading = () => {
  return (
    <AppShell>
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Results</h1>
        <VideoContainer videos={null} />
      </div>
    </AppShell>
  );
};

export default Loading;
