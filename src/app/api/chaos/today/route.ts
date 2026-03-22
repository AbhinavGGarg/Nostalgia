import { getSessionChaos } from "@/lib/drop-service";
import { getOrCreateSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session } = await getOrCreateSession();
  const data = await getSessionChaos(session.id);

  return NextResponse.json({
    ok: true,
    sessionId: session.id,
    mine: data.mine,
    peers: data.peers,
    resetsInHours: 24,
  });
}
