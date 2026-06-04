"use client";

import dynamic from "next/dynamic";

const Plyr = dynamic(
  () => import("plyr-react").then((mod) => mod.Plyr),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black animate-pulse" />
    ),
  },
);

type Props = {
  videoUrl: string;
};

const VideoStreamingContainer = ({ videoUrl }: Props) => {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black" />
    );
  }

  return (
    <div className="video-player-wrapper w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <Plyr
        source={{
          type: "video",
          sources: [
            {
              src: videoUrl,
              type: "video/mp4",
            },
          ],
        }}
        options={{
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "fullscreen",
          ],
          settings: ["speed", "quality"],
          keyboard: { focused: true, global: true },
        }}
        className="plyr-react  plyr w-full h-full"
      />
    </div>
  );
};

export default VideoStreamingContainer;
