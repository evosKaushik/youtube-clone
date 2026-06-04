import AppShell from "@/layout/AppShell";
import VideoContainer from "@/components/VideoContainer";

const Loading = () => {
  return (
    <AppShell>
      <section className="p-6">
        <VideoContainer videos={null} />
      </section>
    </AppShell>
  );
};

export default Loading;
