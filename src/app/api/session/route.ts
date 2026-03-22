import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/constants";
import { getOrCreateSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session } = await getOrCreateSession();

  const response = NextResponse.json({
    sessionId: session.id,
    cooldownUntil: session.cooldownUntil ?? null,
    hasActiveDrop: Boolean(session.activeDrop),
  });

  response.cookies.set({
    name: SESSION_COOKIE,
    value: session.id,
    maxAge: SESSION_TTL_SECONDS,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
