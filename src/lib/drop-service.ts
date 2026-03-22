import { LOCAL_DROP_POOL } from "@/data/drops";
import { SESSION_COOLDOWN_SECONDS } from "@/lib/constants";
import { store } from "@/lib/ephemeral-store";
import {
  dayKeyForNow,
  getActiveGlobalDrop,
  labelResponseSpeed,
  normalizeSnippet,
  pickLocalDrop,
  toActiveDrop,
} from "@/lib/drop-engine";
import { toISO } from "@/lib/time";
import { ActiveDrop, DropAggregate, DropOutcome, SessionState, StoredResponse } from "@/lib/types";

const cooldownFromNow = () => toISO(Date.now() + SESSION_COOLDOWN_SECONDS * 1000);

const localDropIds = new Set(LOCAL_DROP_POOL.map((drop) => drop.id));

const canRecoverActiveDrop = (session: SessionState) => {
  if (!session.activeDrop) {
    return false;
  }

  return new Date(session.activeDrop.expiresAt).getTime() > Date.now();
};

const lockSessionWithCooldown = async (
  session: SessionState,
  options: {
    clearActive?: boolean;
  } = {},
) => {
  const nextSession: SessionState = {
    ...session,
    cooldownUntil: cooldownFromNow(),
  };

  if (options.clearActive ?? true) {
    nextSession.activeDrop = undefined;
  }

  await store.saveSession(nextSession);
  return nextSession;
};

export const issueDropForSession = async (session: SessionState) => {
  const now = Date.now();

  if (session.cooldownUntil && new Date(session.cooldownUntil).getTime() > now) {
    return {
      kind: "cooldown" as const,
      cooldownUntil: session.cooldownUntil,
      session,
    };
  }

  if (canRecoverActiveDrop(session)) {
    return {
      kind: "active" as const,
      drop: session.activeDrop!,
      session,
    };
  }

  if (session.activeDrop && !canRecoverActiveDrop(session)) {
    const missed = await markMissedDrop(session, "You missed it.");
    const refreshedSession = (await store.getSession(session.id)) ?? session;
    return {
      kind: "cooldown" as const,
      cooldownUntil: missed.cooldownUntil ?? cooldownFromNow(),
      session: refreshedSession,
    };
  }

  const globalDrop = getActiveGlobalDrop();
  const drop = globalDrop
    ? globalDrop
    : toActiveDrop(pickLocalDrop(session.lastDropId), new Date(), false);

  const nextSession: SessionState = {
    ...session,
    activeDrop: drop,
    lastDropAt: toISO(now),
    lastDropId: drop.id,
  };

  await store.saveSession(nextSession);

  return {
    kind: "issued" as const,
    drop,
    session: nextSession,
  };
};

const buildAggregate = async (drop: ActiveDrop): Promise<DropAggregate> =>
  store.getDropAggregate(drop.id, dayKeyForNow());

export const submitDropForSession = async (
  session: SessionState,
  responseText: string,
): Promise<DropOutcome> => {
  const active = session.activeDrop;

  if (!active) {
    return {
      status: "locked",
      message: "That moment is gone.",
    };
  }

  const now = Date.now();
  const issuedAtMs = new Date(active.issuedAt).getTime();
  const expiresAtMs = new Date(active.expiresAt).getTime();

  if (now > expiresAtMs) {
    const missed = await markMissedDrop(session, "You missed it.");
    return {
      status: "missed",
      message: "Too late. It already happened.",
      cooldownUntil: missed.cooldownUntil ?? cooldownFromNow(),
      aggregate: await buildAggregate(active),
    };
  }

  const clean = normalizeSnippet(responseText, 220);
  const responseTimeMs = Math.max(0, now - issuedAtMs);

  const record: StoredResponse = {
    sessionId: session.id,
    dropId: active.id,
    dropPrompt: active.prompt,
    dropType: active.type,
    responseText: clean,
    submittedAt: toISO(now),
    responseTimeMs,
    completed: true,
    expired: false,
    isGlobal: active.isGlobal,
    label: labelResponseSpeed(responseTimeMs),
  };

  await store.appendResponse(record);

  const updatedSession = await lockSessionWithCooldown(
    {
      ...session,
      lastDropId: active.id,
    },
    { clearActive: true },
  );

  return {
    status: "submitted",
    message: "That was real.",
    cooldownUntil: updatedSession.cooldownUntil,
    aggregate: await buildAggregate(active),
  };
};

export const markMissedDrop = async (session: SessionState, message = "That moment is gone.") => {
  const active = session.activeDrop;
  if (!active) {
    return {
      status: "locked" as const,
      message,
      cooldownUntil: session.cooldownUntil,
    };
  }

  const now = Date.now();
  const responseTimeMs = Math.max(0, now - new Date(active.issuedAt).getTime());

  const missedResponse: StoredResponse = {
    sessionId: session.id,
    dropId: active.id,
    dropPrompt: active.prompt,
    dropType: active.type,
    responseText: "[missed]",
    submittedAt: toISO(now),
    responseTimeMs,
    completed: false,
    expired: true,
    isGlobal: active.isGlobal,
    label: "hesitant",
  };

  await store.appendResponse(missedResponse);

  const updatedSession = await lockSessionWithCooldown(
    {
      ...session,
      lastDropId: active.id,
    },
    { clearActive: true },
  );

  return {
    status: "missed" as const,
    message,
    cooldownUntil: updatedSession.cooldownUntil,
    aggregate: await buildAggregate(active),
  };
};

export const getSessionChaos = async (sessionId: string) => {
  const dayKey = dayKeyForNow();
  const mine = await store.getSessionResponses(sessionId, dayKey);
  const allRecent = await store.getRecentResponses(dayKey, 80);

  const peers = allRecent
    .filter((entry) => entry.sessionId !== sessionId && entry.completed)
    .slice(0, 12)
    .map((entry) => ({
      text: entry.responseText,
      submittedAt: entry.submittedAt,
      label: entry.label,
      dropId: entry.dropId,
    }));

  return {
    mine,
    peers,
  };
};

export const getDropById = (id: string) => LOCAL_DROP_POOL.find((drop) => drop.id === id);

export const isSessionInCooldown = (session: SessionState) =>
  Boolean(session.cooldownUntil && new Date(session.cooldownUntil).getTime() > Date.now());

export const isValidDropResponse = (value: string) => normalizeSnippet(value, 220).length > 0;

export const isGlobalDropId = (dropId: string) => !localDropIds.has(dropId);
