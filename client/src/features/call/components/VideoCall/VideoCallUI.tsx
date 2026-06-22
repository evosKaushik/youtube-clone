"use client";

import { socket } from "@/libs/socket";
import { useUser } from "@/libs/AuthContext";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiPhoneOff,
} from "react-icons/fi";
import { RiRecordCircleLine } from "react-icons/ri";

type Props = {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  localStreamRef: React.RefObject<MediaStream | null>;
  screenStreamRef: React.RefObject<MediaStream | null>;
  peerRef: React.RefObject<RTCPeerConnection | null>;
};

export default function VideoCallUI({
  localVideoRef,
  remoteVideoRef,
  localStreamRef,
  screenStreamRef,
  peerRef,
}: Props) {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const userInitial = (user?.name || user?.email || "U")[0].toUpperCase();

  const stopScreenShare = async () => {
    const sender = peerRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!sender || !cameraTrack) return;
    await sender.replaceTrack(cameraTrack);
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setScreenSharing(false);
  };

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();
    peerRef.current = null;
    socket.disconnect();
    router.push("/");
  };

  const startRecording = () => {
    const currentStream = localVideoRef.current?.srcObject as MediaStream;
    if (!currentStream) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(currentStream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      if (blob.size === 0) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `call-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    recorder.start(1000);
  };

  const stopRecording = () => mediaRecorderRef.current?.stop();

  return (
    <div className="h-[calc(100vh-56px)] bg-black flex flex-col select-none">

      {/* ── Main area ─────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-black">

        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* ── Local video PiP ──────────────────────────────────── */}
        <div className="absolute bottom-6 right-6 w-64 h-40 sm:w-72 sm:h-44 rounded-2xl overflow-hidden border border-border shadow-2xl bg-black">
          {/* Avatar shown when camera is OFF */}
          <div
            className={`absolute inset-0 bg-background flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${cameraOn ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            {user?.profilePicture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-600"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center text-2xl font-bold text-white">
                {userInitial}
              </div>
            )}
            <span className="text-secondaryText text-xs">{user?.name || "You"}</span>
          </div>

          {/* Actual local video */}
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${cameraOn ? "opacity-100" : "opacity-0"}`}
          />

          {/* Status bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1.5 flex items-center justify-between text-white text-xs">
            <span className="font-medium">{user?.name?.split(" ")[0] || "You"}</span>
            <div className="flex gap-1.5 items-center">
              <span className={micOn ? "text-secondaryText" : "text-red-400"}>
                {micOn ? <FiMic size={11} /> : <FiMicOff size={11} />}
              </span>
              <span className={cameraOn ? "text-secondaryText" : "text-red-400"}>
                {cameraOn ? <FiVideo size={11} /> : <FiVideoOff size={11} />}
              </span>
            </div>
          </div>
        </div>

        {/* ── Status badge ──────────────────────────────────────── */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-border">
          <span className={`w-1.5 h-1.5 rounded-full ${screenSharing ? "bg-blue-400" : "bg-green-400"} animate-pulse`} />
          {screenSharing ? "Sharing screen" : "Connected"}
        </div>

        {/* ── Record button ─────────────────────────────────────── */}
        <button
          onClick={() => {
            if (isRecording) {
              stopRecording();
              setIsRecording(false);
            } else {
              startRecording();
              setIsRecording(true);
            }
          }}
          className={`absolute top-4 right-4 ${isRecording ? "bg-red-950 border-red-800" : "bg-black/50 border-border"} text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border transition-all`}
        >
          <RiRecordCircleLine className={`text-sm ${isRecording ? "text-red-400" : "text-secondaryText"}`} />
          <span className={isRecording ? "text-red-300" : "text-text"}>
            {isRecording ? "Stop" : "Record"}
          </span>
        </button>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────── */}
      <div className="h-24 border-t border-border bg-background flex items-center justify-center gap-3 px-4">

        {/* Mic */}
        <button
          onClick={() => {
            const track = localStreamRef.current?.getAudioTracks()[0];
            if (track) {
              track.enabled = !track.enabled;
              setMicOn(track.enabled);
            }
          }}
          title={micOn ? "Mute" : "Unmute"}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 active:scale-95 ${micOn ? "bg-card hover:bg-hover text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
        >
          {micOn ? <FiMic /> : <FiMicOff />}
        </button>

        {/* Camera */}
        <button
          onClick={() => {
            const track = localStreamRef.current?.getVideoTracks()[0];
            if (track) {
              track.enabled = !track.enabled;
              setCameraOn(track.enabled);
            }
          }}
          title={cameraOn ? "Turn off camera" : "Turn on camera"}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 active:scale-95 ${cameraOn ? "bg-card hover:bg-hover text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}
        >
          {cameraOn ? <FiVideo /> : <FiVideoOff />}
        </button>

        {/* Screen share */}
        <button
          onClick={async () => {
            try {
              if (screenSharing) {
                await stopScreenShare();
                return;
              }
              const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
              screenStreamRef.current = screenStream;
              const screenTrack = screenStream.getVideoTracks()[0];
              const sender = peerRef.current?.getSenders().find((s) => s.track?.kind === "video");
              if (!sender) return;
              await sender.replaceTrack(screenTrack);
              if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
              setScreenSharing(true);
              screenTrack.onended = () => stopScreenShare();
            } catch (e) {
              console.error(e);
            }
          }}
          title={screenSharing ? "Stop sharing" : "Share screen"}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg transition-all hover:scale-105 active:scale-95 ${screenSharing ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-card hover:bg-hover text-white"}`}
        >
          <FiMonitor />
        </button>

        {/* End call */}
        <button
          onClick={endCall}
          title="End call"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-lg transition-all hover:scale-105 active:scale-95"
        >
          <FiPhoneOff />
        </button>
      </div>
    </div>
  );
}
