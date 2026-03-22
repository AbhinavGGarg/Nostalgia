import { markMissedDrop } from "@/lib/drop-service";
import { getOrCreateSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const { session } = await getOrCreateSession();
  const result = await markMissedDrop(session, "You missed it.");

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
