import { GLOBAL_DROP_POOL, LOCAL_DROP_POOL } from "@/data/drops";
import {
  GLOBAL_CLOCK_EPOCH,
  GLOBAL_DROP_INTERVAL_MS,
  GLOBAL_DROP_WINDOW_MS,
} from "@/lib/constants";
import { getDayKey, toISO } from "@/lib/time";
import { ActiveDrop, DropDefinition, StoredResponse } from "@/lib/types";

const FALLBACK_DROP = LOCAL_DROP_POOL[0];

const weightedPick = (pool: DropDefinition[]) => {
  const total = pool.reduce((sum, drop) => sum + drop.weight, 0);
  const threshold = Math.random() * total;

  let current = 0;
  for (const drop of pool) {
    current += drop.weight;
    if (current >= threshold) {
      return drop;
    }
  }

  return pool[pool.length - 1] ?? FALLBACK_DROP;
};

export const getActiveGlobalDrop = (now: Date = new Date()): ActiveDrop | null => {
  if (!GLOBAL_DROP_POOL.length) {
    return null;
  }

  const elapsed = now.getTime() - GLOBAL_CLOCK_EPOCH;
  if (elapsed < 0) {
    return null;
  }

  const cycle = Math.floor(elapsed / GLOBAL_DROP_INTERVAL_MS);
  const chosen = GLOBAL_DROP_POOL[cycle % GLOBAL_DROP_POOL.length];
  const phase = elapsed % GLOBAL_DROP_INTERVAL_MS;
  const activeWindow = Math.min(GLOBAL_DROP_WINDOW_MS, chosen.durationSeconds * 1000);
  if (phase > activeWindow) {
    return null;
  }

  const activeFrom = now.getTime() - phase;
  const expiresAt = activeFrom + chosen.durationSeconds * 1000;

  return {
    id: chosen.id,
    type: chosen.type,
    prompt: chosen.prompt,
    durationSeconds: chosen.durationSeconds,
    mediaUrl: chosen.mediaUrl,
    mediaAlt: chosen.mediaAlt,
    options: chosen.options,
    isGlobal: true,
    issuedAt: toISO(activeFrom),
    expiresAt: toISO(expiresAt),
  };
};

export const pickLocalDrop = (lastDropId?: string): DropDefinition => {
  const pool = LOCAL_DROP_POOL.filter((drop) => drop.id !== lastDropId);
  if (!pool.length) {
    return FALLBACK_DROP;
  }

  return weightedPick(pool);
};

export const toActiveDrop = (
  drop: DropDefinition,
  now: Date = new Date(),
  forceGlobal = false,
): ActiveDrop => {
  const issuedAt = now.getTime();
  const expiresAt = issuedAt + drop.durationSeconds * 1000;
  return {
    id: drop.id,
    type: drop.type,
    prompt: drop.prompt,
    durationSeconds: drop.durationSeconds,
    mediaUrl: drop.mediaUrl,
    mediaAlt: drop.mediaAlt,
    options: drop.options,
    isGlobal: forceGlobal,
    issuedAt: toISO(issuedAt),
    expiresAt: toISO(expiresAt),
  };
};

export const labelResponseSpeed = (ms: number): StoredResponse["label"] => {
  if (ms <= 3000) {
    return "fast";
  }
  if (ms <= 7000) {
    return "chaotic";
  }
  if (ms <= 12000) {
    return "hesitant";
  }
  return "too honest";
};

export const normalizeSnippet = (value: string, maxLength = 44) => {
  const clean = value.replace(/\s+/g, " ").trim();
  if (!clean) {
    return "silence";
  }

  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength - 1)}...`;
};

export const dayKeyForNow = () => getDayKey(new Date());
