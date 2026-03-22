import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/constants";
import { issueDropForSession } from "@/lib/drop-service";
import { getOrCreateSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const { session } = await getOrCreateSession();
  const result = await issueDropForSession(session);

  const response = NextResponse.json(
    result.kind === "cooldown"
      ? {
          ok: false,
          status: "cooldown",
          cooldownUntil: result.cooldownUntil,
          message: "One moment. No second take.",
        }
      : {
          ok: true,
          status: result.kind,
          drop: result.drop,
        },
  );

  response.cookies.set({
    name: SESSION_COOKIE,
    value: result.session.id,
    maxAge: SESSION_TTL_SECONDS,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
