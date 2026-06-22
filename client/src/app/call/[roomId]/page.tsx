"use client";

import { useEffect, useRef, useCallback } from "react";
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
  const joinedRef = useRef(false);

  const joinRoom = useCallback(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;
    socket.emit("join-room", { roomId });
  }, [roomId]);

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

        // Connect socket
        connectSocket();

        // --- Setup socket event listeners ---
        // Use .off().on() to avoid accumulating duplicate listeners

        socket.off("connect").on("connect", () => {
          console.log("Socket connected, joining room:", roomId);
          joinRoom();
        });

        // If socket is already connected, join the room immediately
        if (socket.connected) {
          console.log("Socket already connected, joining room immediately:", roomId);
          joinRoom();
        }

        socket.off("existing-users").on("existing-users", async ({ users }) => {
          console.log("Existing users in room:", users);
          // If there are existing users, create an offer for the first one
          if (users.length > 0 && peerRef.current) {
            try {
              const offer = await peerRef.current.createOffer();
              await peerRef.current.setLocalDescription(offer);
              socket.emit("offer", { roomId, offer });
            } catch (err) {
              console.error("Error creating offer for existing users:", err);
            }
          }
        });

        socket.off("user-joined").on("user-joined", async () => {
          console.log("User joined, creating offer");
          if (!peerRef.current) return;

          try {
            // Check peer connection state before creating offer
            const pc = peerRef.current;
            if (pc.signalingState !== "stable") {
              console.warn("PC not stable, rolling back before creating offer");
              await pc.setLocalDescription({ type: "rollback" });
            }
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
          } catch (err) {
            console.error("Error creating offer:", err);
          }
        });

        socket.off("offer").on("offer", async (offer) => {
          console.log("Offer received");
          if (!peerRef.current) return;

          try {
            const pc = peerRef.current;
            // Check if we need to rollback first
            if (pc.signalingState !== "stable") {
              console.warn("PC not stable, rolling back before setting remote");
              await pc.setLocalDescription({ type: "rollback" });
            }
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            console.log("Answer created");
            await pc.setLocalDescription(answer);
            socket.emit("answer", { roomId, answer });
          } catch (err) {
            console.error("Error handling offer:", err);
          }
        });

        socket.off("answer").on("answer", async (answer) => {
          console.log("Answer received");
          if (!peerRef.current) return;

          try {
            await peerRef.current.setRemoteDescription(
              new RTCSessionDescription(answer),
            );
          } catch (err) {
            console.error("Error handling answer:", err);
          }
        });

        socket.off("ice-candidate").on("ice-candidate", async (candidate) => {
          console.log("ICE received");
          if (!peerRef.current) return;

          try {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            // ICE candidates may arrive before remote description is set — safe to ignore
            console.warn("Failed to add ICE candidate (likely harmless):", err);
          }
        });
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    init();

    return () => {
      console.log("Cleaning up call page");
      peerRef.current?.close();
      peerRef.current = null;
      joinedRef.current = false;
      socket.off("connect");
      socket.off("existing-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      disconnectSocket();
    };
  }, [roomId, joinRoom]);

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
