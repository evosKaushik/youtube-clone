"use client";

import { socket } from "@/libs/socket";
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const stopScreenShare = async () => {
    const sender = peerRef.current
      ?.getSenders()
      .find((sender) => sender.track?.kind === "video");

    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];

    if (!sender || !cameraTrack) return;

    await sender.replaceTrack(cameraTrack);

    screenStreamRef.current?.getTracks().forEach((track) => track.stop());

    screenStreamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setScreenSharing(false);
  };

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());

    screenStreamRef.current?.getTracks().forEach((track) => track.stop());

    peerRef.current?.close();

    peerRef.current = null;

    socket.disconnect();

    router.push("/");
  };

  const startRecording = () => {
    const currentStream = localVideoRef.current?.srcObject as MediaStream;

    if (!currentStream) {
      console.log("No stream found");
      return;
    }

    recordedChunksRef.current = [];

    const recorder = new MediaRecorder(currentStream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current = recorder;

    recorder.onstart = () => {
      console.log("Recording started");
    };

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    recorder.onerror = (error) => {
      console.error("Recording error:", error);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, {
        type: "video/webm",
      });

      console.log("Blob size:", blob.size);

      if (blob.size === 0) {
        console.log("Recording is empty");
        return;
      }

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `call-${Date.now()}.webm`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      console.log("Recording downloaded");
    };

    recorder.start(1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="h-[calc(100vh-120px)] sm:h-[calc(100vh-56px)] bg-zinc-950 flex flex-col">
      {/* Remote Video */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover bg-black"
        />

        {/* Local Video */}
        <div className="absolute bottom-6 right-6 w-72 h-44 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl bg-zinc-900">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between text-white text-sm">
            <span>You</span>

            <div className="flex gap-2">
              {micOn ? <FiMic /> : <FiMicOff />}
              {cameraOn ? <FiVideo /> : <FiVideoOff />}
            </div>
          </div>
        </div>

        {/* Call Status */}
        <div className="absolute top-4 left-4 bg-text/10 text-white px-4 py-2 rounded-full text-sm flex gap-2 justify-center items-center">
          {screenSharing ? "Screen Sharing" : "Connected"}
          <div className="size-2 rounded-full bg-green-500 animate" />
        </div>
        <div
          onClick={() => {
            if (isRecording) {
              stopRecording();
              setIsRecording(false);
            } else {
              startRecording();
              setIsRecording(true);
            }
          }}
          className={`absolute top-4 right-4 ${isRecording ? "bg-red-950" : "bg-green-950"} text-text px-4 py-2 rounded-full text-sm flex gap-2 cursor-pointer`}
        >
          <RiRecordCircleLine
            className={`text-lg ${isRecording ? "text-red-400" : "text-green-400"}`}
          />
          <span className={isRecording ? "text-red-400" : "text-green-400"}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="h-24 border-t border-zinc-800 bg-zinc-900 flex items-center justify-center gap-4">
        {/* Mic */}
        <button
          onClick={() => {
            const audioTrack = localStreamRef.current?.getAudioTracks()[0];

            if (audioTrack) {
              audioTrack.enabled = !audioTrack.enabled;

              setMicOn(audioTrack.enabled);
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition
          ${micOn ? "bg-zinc-700 text-white" : "bg-red-600 text-white"}`}
        >
          {micOn ? <FiMic /> : <FiMicOff />}
        </button>

        {/* Camera */}
        <button
          onClick={() => {
            const videoTrack = localStreamRef.current?.getVideoTracks()[0];

            if (videoTrack) {
              videoTrack.enabled = !videoTrack.enabled;

              setCameraOn(videoTrack.enabled);
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition
          ${cameraOn ? "bg-zinc-700 text-white" : "bg-red-600 text-white"}`}
        >
          {cameraOn ? <FiVideo /> : <FiVideoOff />}
        </button>

        {/* Screen Share */}
        <button
          onClick={async () => {
            try {
              // OFF
              if (screenSharing) {
                await stopScreenShare();
                return;
              }

              // ON
              const screenStream = await navigator.mediaDevices.getDisplayMedia(
                {
                  video: true,
                },
              );

              screenStreamRef.current = screenStream;

              const screenTrack = screenStream.getVideoTracks()[0];

              const sender = peerRef.current
                ?.getSenders()
                .find((sender) => sender.track?.kind === "video");

              if (!sender) return;

              await sender.replaceTrack(screenTrack);

              if (localVideoRef.current) {
                localVideoRef.current.srcObject = screenStream;
              }

              setScreenSharing(true);

              screenTrack.onended = () => {
                stopScreenShare();
              };
            } catch (error) {
              console.error(error);
            }
          }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition ${screenSharing ? "bg-blue-600 text-white" : "bg-zinc-700 text-white"}`}
        >
          <FiMonitor />
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center text-xl hover:bg-red-700 transition"
        >
          <FiPhoneOff />
        </button>
      </div>
    </div>
  );
}
