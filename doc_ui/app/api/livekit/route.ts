import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // 1. Parse Query Parameters (e.g. ?room=123&username=Dr.Smith)
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");

  if (!room || !username) {
    return NextResponse.json(
      { error: 'Missing "room" or "username"' },
      { status: 400 }
    );
  }

  // 2. Load Keys from .env.local
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  // 3. Create a Token
  // This tells LiveKit: "This user is allowed to join THIS specific room"
  const at = new AccessToken(apiKey, apiSecret, { identity: username });

  // Grant permissions (can publish video, hear audio, join room)
  at.addGrant({
    roomJoin: true,
    room: room,
    canPublish: true,   // Allow sending video/audio
    canSubscribe: true, // Allow seeing others
    canPublishData: true // Allow chat/data messages
  });
  
  // 4. Return the Token to the Client
  return NextResponse.json({ token: await at.toJwt() });
}