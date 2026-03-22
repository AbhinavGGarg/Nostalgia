import { isValidDropResponse, submitDropForSession } from "@/lib/drop-service";
import { getOrCreateSession } from "@/lib/session-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type SubmitPayload = {
  responseText?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as SubmitPayload;
  const responseText = (payload.responseText ?? "").toString();

  if (!isValidDropResponse(responseText)) {
    return NextResponse.json(
      {
        ok: false,
        status: "invalid",
        message: "A response is required before the timer hits zero.",
      },
      { status: 400 },
    );
  }

  const { session } = await getOrCreateSession();
  const outcome = await submitDropForSession(session, responseText);

  return NextResponse.json({
    ok: true,
    ...outcome,
  });
}
