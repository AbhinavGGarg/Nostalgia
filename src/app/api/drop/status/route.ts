import { getOrCreateSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session } = await getOrCreateSession();

  return NextResponse.json({
    sessionId: session.id,
    cooldownUntil: session.cooldownUntil ?? null,
    activeDrop: session.activeDrop ?? null,
  });
}
