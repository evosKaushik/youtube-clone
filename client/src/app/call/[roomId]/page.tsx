"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import VideoCallUI from "@/features/call/components/VideoCall/VideoCallUI";
import AuthGuard from "@/components/common/AuthGuard";

import { socket } from "@/libs/socket";
import { connectSocket, disconnectSocket } from "@/libs/socketManager";

export default function CallPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const { roomId } = useParams<{ roomId: string }>();
  const mediaReadyRef = useRef(false);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const init = async () => {
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"],
          },
        ],
      });

      peerRef.current = peer;

      peer.ontrack = (event) => {
        console.log("Remote stream received");

        const [stream] = event.streams;

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      };

      peer.onicecandidate = (event) => {
        if (!event.candidate) return;

        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          peer.addTrack(track, stream);
        });

        mediaReadyRef.current = true;
        console.log("Media ready. Senders:", peer.getSenders().length);

        // Connect to socket and setup listeners AFTER media is ready
        connectSocket();

        socket.on("connect", () => {
          socket.emit("join-room", {
            roomId,
          });
        });

        socket.on("user-joined", async () => {
          if (!peerRef.current) return;

          const offer = await peerRef.current.createOffer();
          await peerRef.current.setLocalDescription(offer);

          socket.emit("offer", {
            roomId,
            offer,
          });
        });

        socket.on("offer", async (offer) => {
          console.log("Offer received");

          if (!peerRef.current) return;

          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(offer),
          );

          const answer = await peerRef.current.createAnswer();
          console.log("Answer created");

          await peerRef.current.setLocalDescription(answer);

          socket.emit("answer", {
            roomId,
            answer,
          });
        });

        socket.on("answer", async (answer) => {
          console.log("Answer received");

          if (!peerRef.current) return;

          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(answer),
          );
        });

        socket.on("ice-candidate", async (candidate) => {
          console.log("ICE received");

          if (!peerRef.current) return;

          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    init();

    return () => {
      peerRef.current?.close();
      socket.off("connect");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      disconnectSocket();
    };
  }, [roomId]);

  return (
    <AuthGuard>
      <section>
        <VideoCallUI
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          localStreamRef={localStreamRef}
          screenStreamRef={screenStreamRef}
          peerRef={peerRef}
        />
      </section>
    </AuthGuard>
  );
}
