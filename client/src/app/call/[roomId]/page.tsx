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
  // Track whether we already created an offer to prevent duplicate offers per session
  const offeredRef = useRef(false);
  // Queue ICE candidates that arrive before remote description is set
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const existingUsersReceivedRef = useRef(false);
  // True when existing-users was empty — means we're the first peer in the room
  const isFirstPeerRef = useRef(false);

  const joinRoom = useCallback(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;
    socket.emit("join-room", { roomId });
  }, [roomId]);

  /** Flush any ICE candidates that arrived before remote description was set */
  const flushIceCandidates = useCallback(async (pc: RTCPeerConnection) => {
    const pending = pendingCandidatesRef.current;
    pendingCandidatesRef.current = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch {
        // stale candidates are harmless
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Reset per-session state
      offeredRef.current = false;
      existingUsersReceivedRef.current = false;
      isFirstPeerRef.current = false;
      pendingCandidatesRef.current = [];

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

        // ---------------------------------------------------------------
        // Guard: if cleanup ran while getUserMedia was pending, abort init
        // ---------------------------------------------------------------
        if (cancelled || !peerRef.current || peerRef.current.signalingState === "closed") {
          console.warn("Peer connection was closed during getUserMedia — stopping init");
          // Stop the tracks we just acquired so the camera/mic LED turns off
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          try {
            if (peer.signalingState !== "closed") {
              peer.addTrack(track, stream);
            }
          } catch (e) {
            console.warn("Failed to add track:", e);
          }
        });

        mediaReadyRef.current = true;
        console.log("Media ready. Senders:", peer.getSenders().length);

        // --- Connect socket ---
        connectSocket();

        // --- Setup socket event listeners ---

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
          existingUsersReceivedRef.current = true;

          if (users.length > 0 && peerRef.current && !offeredRef.current) {
            // We're the JOINING peer — create an offer to the first existing user
            offeredRef.current = true;
            try {
              const pc = peerRef.current;
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit("offer", { roomId, offer });
            } catch (err) {
              console.error("Error creating offer for existing users:", err);
            }
          } else if (users.length === 0) {
            // We're the FIRST peer in the room — no one to connect to yet.
            // When someone joins later (user-joined), we'll create an offer then.
            isFirstPeerRef.current = true;
          }
        });

        socket.off("user-joined").on("user-joined", async () => {
          console.log("User joined");
          if (!peerRef.current || offeredRef.current) return;

          if (isFirstPeerRef.current) {
            // We were the first peer in the room and someone just joined — create an offer
            console.log("First peer, creating offer to new joiner");
            offeredRef.current = true;
            try {
              const pc = peerRef.current;
              if (pc.signalingState !== "stable") {
                await pc.setLocalDescription({ type: "rollback" });
              }
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              socket.emit("offer", { roomId, offer });
            } catch (err) {
              console.error("Error creating offer:", err);
            }
          }
          // If we're NOT the first peer (we joined after someone else), 
          // the joining peer already created an offer via existing-users.
          // We just wait for that offer to arrive.
        });

        socket.off("offer").on("offer", async (offer) => {
          console.log("Offer received");
          if (!peerRef.current) return;

          try {
            const pc = peerRef.current;

            // Glare handling: if we have a pending local offer, roll it back
            // so we can process the incoming offer.
            if (pc.signalingState !== "stable") {
              console.warn("PC not stable, rolling back before setting remote");
              await pc.setLocalDescription({ type: "rollback" });
            }

            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            console.log("Answer created");
            await pc.setLocalDescription(answer);

            // Flush any ICE candidates that arrived before remote description
            await flushIceCandidates(pc);

            socket.emit("answer", { roomId, answer });
          } catch (err) {
            console.error("Error handling offer:", err);
          }
        });

        socket.off("answer").on("answer", async (answer) => {
          console.log("Answer received");
          if (!peerRef.current) return;

          const pc = peerRef.current;

          // Only process answer if we're actually expecting one
          if (pc.signalingState !== "have-local-offer") {
            console.warn(
              "Ignoring answer — not expecting one (state:",
              pc.signalingState,
              ")",
            );
            return;
          }

          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));

            // Flush any ICE candidates that arrived while waiting for the answer
            await flushIceCandidates(pc);
          } catch (err) {
            console.error("Error handling answer:", err);
          }
        });

        socket.off("ice-candidate").on("ice-candidate", async (candidate) => {
          if (!peerRef.current) return;

          const pc = peerRef.current;

          // If remote description isn't set yet, queue the candidate
          if (!pc.remoteDescription) {
            pendingCandidatesRef.current.push(candidate);
            return;
          }

          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
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
      cancelled = true;

      // Close the peer connection if it's still open
      if (peerRef.current && peerRef.current.signalingState !== "closed") {
        peerRef.current.close();
      }
      peerRef.current = null;

      // Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }

      // Reset flags so the component can re-init cleanly (Fast Refresh / Strict Mode)
      joinedRef.current = false;
      mediaReadyRef.current = false;
      offeredRef.current = false;
      existingUsersReceivedRef.current = false;
      isFirstPeerRef.current = false;
      pendingCandidatesRef.current = [];

      socket.off("connect");
      socket.off("existing-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      disconnectSocket();
    };
  }, [roomId, joinRoom, flushIceCandidates]);

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
