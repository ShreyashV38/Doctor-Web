"use client";

import "@livekit/components-styles";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ConsultationPage() {
  const params = useParams();
  const roomId = params.id as string;
  const router = useRouter();

  const [token, setToken] = useState("");
  const hasFetched = useRef(false); // prevents double API call in dev

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    (async () => {
      try {
        // 1️⃣ Get logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // 2️⃣ Fetch real name from DB
        const { data: profile } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .single();

        const username = profile?.name || "Doctor";

        // 3️⃣ Get LiveKit token from API
        const resp = await fetch(
          `/api/livekit?room=${roomId}&username=${encodeURIComponent(username)}`
        );

        if (!resp.ok) throw new Error("Token fetch failed");

        const data = await resp.json();
        setToken(data.token);
      } catch (err) {
        console.error("LiveKit connection failed:", err);
        router.push("/dashboard");
      }
    })();
  }, [roomId, router]);

  if (!token) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Securing connection...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      
      {/* Room Badge */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-700 text-white">
        Room: {roomId.slice(0, 8)}...
      </div>

      {/* End Call Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg"
        >
          End Call
        </button>
      </div>

      <LiveKitRoom
        video
        audio
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => router.push("/dashboard")} // ← from file 2
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} style={{ height: "calc(100% - var(--lk-control-bar-height))" }}>
      <ParticipantTile />
    </GridLayout>
  );
}
