"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { sendWatchHeartbeatApi, stopWatchApi } from "@/api/videoApi";

type Props = {
  videoUrl: string;
  videoId: string;
};

export default function VideoPlayer({ videoUrl, videoId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);

  const startHeartbeat = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      if (!isPlayingRef.current) return;

      const res = await sendWatchHeartbeatApi(videoId);

      if (!res) {
        window.location.reload();
      }
    }, 10000);
  };

  const stopHeartbeat = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await stopWatchApi(videoId);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");

      containerRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        preload: "auto",
        autoplay: false,
        sources: [
          {
            src: videoUrl,
            type: "video/mp4",
          },
        ],
      });

      playerRef.current = player;

      player.on("play", () => {
        console.log("PLAY");
        isPlayingRef.current = true;
        startHeartbeat();
      });

      player.on("pause", () => {
        console.log("PAUSE");
        isPlayingRef.current = false;
      });

      player.on("ended", async () => {
        console.log("ENDED");
        isPlayingRef.current = false;
        await stopHeartbeat();
      });

      player.ready(() => {
        console.log("Player Ready");
      });

      player.on("error", () => {
        console.log("Player Error:", player.error());
      });
    }

    return () => {
      stopHeartbeat();

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, videoId]);

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
      <div ref={containerRef} />
    </div>
  );
}