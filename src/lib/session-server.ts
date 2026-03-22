import { SESSION_COOKIE } from "@/lib/constants";
import { store } from "@/lib/ephemeral-store";
import { toISO } from "@/lib/time";
import { SessionState } from "@/lib/types";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const makeSession = (): SessionState => ({
  id: uuid(),
  createdAt: toISO(new Date()),
});

export const getOrCreateSession = async () => {
  const cookieStore = await cookies();
  const existingId = cookieStore.get(SESSION_COOKIE)?.value;

  if (existingId) {
    const existingSession = await store.getSession(existingId);
    if (existingSession) {
      return { session: existingSession, isNew: false };
    }
  }

  const session = makeSession();
  await store.saveSession(session);

  return { session, isNew: true };
};

export const readSessionId = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
};
