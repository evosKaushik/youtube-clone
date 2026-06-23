"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import { sendWatchHeartbeatApi, stopWatchApi } from "@/api/videoApi";

type Props = {
  videoUrl: string;
  videoId: string;
  onEnded?: () => void;
  onNextVideo?: () => void;
  onOpenComments?: () => void;
  onUnauthenticated?: () => void;
};

export default function VideoPlayer({ videoUrl, videoId, onEnded, onNextVideo, onOpenComments, onUnauthenticated }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const tapCountRef = useRef(0);
  const tapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPlayingRef = useRef(false);

  const startHeartbeat = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      if (!isPlayingRef.current) return;

      const res = await sendWatchHeartbeatApi(videoId);

      if (!res) {
        // Heartbeat failed — check if the user is still logged in.
        // If localStorage has no "user" entry, they logged out, so
        // redirect to signup (only authenticated users can watch).
        const localUser =
          typeof window !== "undefined" && localStorage.getItem("user");

        if (!localUser) {
          onUnauthenticated?.();
          return;
        }

        // User is still logged in but heartbeat failed for another reason
        // (e.g. watch limit, network issue) — silently ignore.
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

  const executeGesture = (zone: "left" | "center" | "right", taps: number) => {
    const player = playerRef.current;

    if (!player) return;

    // Single tap center = Play / Pause
    if (zone === "center" && taps === 1) {
      if (player.paused()) {
        player.play();
      } else {
        player.pause();
      }
    }

    // Double tap left = Rewind 10 sec
    if (zone === "left" && taps === 2) {
      player.currentTime(Math.max(0, player.currentTime() - 10));
    }

    // Double tap right = Forward 10 sec
    if (zone === "right" && taps === 2) {
      player.currentTime(player.currentTime() + 10);
    }

    // Triple tap center = Next video
    if (zone === "center" && taps === 3) {
      onNextVideo?.();
    }

    // Triple tap left = Open comments
    if (zone === "left" && taps === 3) {
      onOpenComments?.();
    }

    // Triple tap right = Close website
    if (zone === "right" && taps === 3) {
      window.close();
    }
  };

  const handleTap = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;

    const x = e.clientX;
    const width = window.innerWidth;

    let zone: "left" | "center" | "right";

    if (x < width * 0.33) {
      zone = "left";
    } else if (x < width * 0.66) {
      zone = "center";
    } else {
      zone = "right";
    }

    tapCountRef.current++;

    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      executeGesture(zone, tapCountRef.current);
      tapCountRef.current = 0;
    }, 300);
  };

  useEffect(() => {
    if (!containerRef.current) return;

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
      isPlayingRef.current = true;
      startHeartbeat();
    });

    player.on("pause", () => {
      isPlayingRef.current = false;
    });

    player.on("ended", async () => {
      isPlayingRef.current = false;
      await stopHeartbeat();
      onEnded?.();
    });

    player.on("error", () => {
      console.log("Player Error:", player.error());
    });

    return () => {
      stopHeartbeat();

      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, videoId]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
      {" "}
      <div ref={containerRef} />
      <div onPointerUp={handleTap} className="absolute inset-0 z-10" />
    </div>
  );
}
