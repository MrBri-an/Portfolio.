"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, CameraOff, Mic, MicOff, Phone, PhoneOff, Video } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";
import type { CallLogData } from "@/types/marketplace";

type CallControlsProps = {
  conversationId: string;
  otherUser: AuthUser;
  isBlocked: boolean;
  onCallLogged: (call: CallLogData) => void;
};

type CallType = "AUDIO" | "VIDEO";

export function CallControls({
  conversationId,
  otherUser,
  isBlocked,
  onCallLogged,
}: CallControlsProps) {
  const [activeCall, setActiveCall] = useState<CallLogData | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const videoRef = useRef<HTMLVideoElement>(null);
  const initials = otherUser.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function startCall(type: CallType) {
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "VIDEO",
      });
      setStream(mediaStream);
      setIsMuted(false);
      setIsCameraOff(false);

      startTransition(async () => {
        const response = await fetch(`/api/chat/conversations/${conversationId}/calls`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        });
        const data = (await response.json()) as { call?: CallLogData; message?: string };

        if (!response.ok || !data.call) {
          setError(data.message || "Unable to start call.");
          mediaStream.getTracks().forEach((track) => track.stop());
          setStream(null);
          return;
        }

        setActiveCall(data.call);
        onCallLogged(data.call);
      });
    } catch {
      setError("Microphone or camera permission was not granted.");
    }
  }

  function toggleMute() {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });
    setIsMuted((current) => !current);
  }

  function toggleCamera() {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff;
    });
    setIsCameraOff((current) => !current);
  }

  function endCall(status: "COMPLETED" | "DECLINED" = "COMPLETED") {
    const call = activeCall;
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setActiveCall(null);

    if (!call) {
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/chat/calls/${call.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json()) as { call?: CallLogData };

      if (data.call) {
        onCallLogged(data.call);
      }
    });
  }

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title="Audio call"
        disabled={isBlocked || isPending}
        onClick={() => startCall("AUDIO")}
      >
        <Phone className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title="Video call"
        disabled={isBlocked || isPending}
        onClick={() => startCall("VIDEO")}
      >
        <Video className="h-4 w-4" />
      </Button>
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}

      {activeCall ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-[16px] border border-white/10 bg-slate-950 p-5 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {otherUser.imageUrl ? (
                  <AvatarImage src={otherUser.imageUrl} alt={otherUser.fullName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{otherUser.fullName}</p>
                <p className="text-sm text-slate-300">
                  {activeCall.type === "VIDEO" ? "Video" : "Audio"} call in progress
                </p>
              </div>
            </div>

            <div
              className={cn(
                "mt-5 flex aspect-video items-center justify-center overflow-hidden rounded-[12px] bg-slate-900",
                activeCall.type === "AUDIO" && "aspect-[4/3]",
              )}
            >
              {activeCall.type === "VIDEO" && stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Phone className="mx-auto mb-3 h-10 w-10 text-primary" />
                  <p className="text-sm text-slate-300">
                    WebRTC signaling adapter ready. Local media is active.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Button type="button" size="icon" variant="secondary" onClick={toggleMute}>
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              {activeCall.type === "VIDEO" ? (
                <Button type="button" size="icon" variant="secondary" onClick={toggleCamera}>
                  {isCameraOff ? (
                    <CameraOff className="h-4 w-4" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              ) : null}
              <Button
                type="button"
                size="icon"
                className="bg-rose-600 hover:bg-rose-700"
                onClick={() => endCall("COMPLETED")}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
