import { DAILY_CHAOS_RETENTION_SECONDS, SESSION_TTL_SECONDS } from "@/lib/constants";
import { getRedis } from "@/lib/redis";
import { getDayKey } from "@/lib/time";
import { DropAggregate, SessionState, StoredResponse } from "@/lib/types";

type MemoryStoreShape = {
  sessions: Map<string, SessionState>;
  responsesByDay: Map<string, StoredResponse[]>;
  responsesByDayAndSession: Map<string, StoredResponse[]>;
};

const memoryStore: MemoryStoreShape = {
  sessions: new Map<string, SessionState>(),
  responsesByDay: new Map<string, StoredResponse[]>(),
  responsesByDayAndSession: new Map<string, StoredResponse[]>(),
};

const parseList = <T>(list: string[]): T[] =>
  list
    .map((entry) => {
      try {
        return JSON.parse(entry) as T;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is T => entry !== null);

const serialize = <T>(value: T) => JSON.stringify(value);

const dayResponseKey = (dayKey: string) => `drop:responses:${dayKey}`;
const sessionResponseKey = (dayKey: string, sessionId: string) =>
  `drop:responses:${dayKey}:session:${sessionId}`;
const sessionKey = (sessionId: string) => `drop:session:${sessionId}`;

const normalizeResponse = (response: StoredResponse) => ({
  ...response,
  responseText: response.responseText.slice(0, 220),
});

export const store = {
  async getSession(sessionId: string): Promise<SessionState | null> {
    const redis = getRedis();

    if (redis) {
      try {
        const raw = await redis.get(sessionKey(sessionId));
        if (!raw) {
          return null;
        }
        return JSON.parse(raw) as SessionState;
      } catch {
        // continue to in-memory fallback
      }
    }

    return memoryStore.sessions.get(sessionId) ?? null;
  },

  async saveSession(session: SessionState): Promise<void> {
    const redis = getRedis();

    if (redis) {
      try {
        await redis.set(sessionKey(session.id), serialize(session), "EX", SESSION_TTL_SECONDS);
        return;
      } catch {
        // continue to in-memory fallback
      }
    }

    memoryStore.sessions.set(session.id, session);
  },

  async appendResponse(response: StoredResponse): Promise<void> {
    const normalized = normalizeResponse(response);
    const dayKey = getDayKey(new Date(response.submittedAt));

    const redis = getRedis();
    if (redis) {
      try {
        const serialized = serialize(normalized);
        await redis
          .multi()
          .lpush(dayResponseKey(dayKey), serialized)
          .ltrim(dayResponseKey(dayKey), 0, 399)
          .expire(dayResponseKey(dayKey), DAILY_CHAOS_RETENTION_SECONDS)
          .lpush(sessionResponseKey(dayKey, response.sessionId), serialized)
          .ltrim(sessionResponseKey(dayKey, response.sessionId), 0, 59)
          .expire(sessionResponseKey(dayKey, response.sessionId), DAILY_CHAOS_RETENTION_SECONDS)
          .exec();
        return;
      } catch {
        // continue to in-memory fallback
      }
    }

    const dayResponses = memoryStore.responsesByDay.get(dayKey) ?? [];
    dayResponses.unshift(normalized);
    memoryStore.responsesByDay.set(dayKey, dayResponses.slice(0, 400));

    const daySessionKey = `${dayKey}:${response.sessionId}`;
    const sessionResponses = memoryStore.responsesByDayAndSession.get(daySessionKey) ?? [];
    sessionResponses.unshift(normalized);
    memoryStore.responsesByDayAndSession.set(daySessionKey, sessionResponses.slice(0, 60));
  },

  async getSessionResponses(sessionId: string, dayKey: string): Promise<StoredResponse[]> {
    const redis = getRedis();
    if (redis) {
      try {
        const data = await redis.lrange(sessionResponseKey(dayKey, sessionId), 0, 40);
        return parseList<StoredResponse>(data);
      } catch {
        // continue to in-memory fallback
      }
    }

    return memoryStore.responsesByDayAndSession.get(`${dayKey}:${sessionId}`) ?? [];
  },

  async getRecentResponses(dayKey: string, take = 120): Promise<StoredResponse[]> {
    const redis = getRedis();
    if (redis) {
      try {
        const data = await redis.lrange(dayResponseKey(dayKey), 0, Math.max(0, take - 1));
        return parseList<StoredResponse>(data);
      } catch {
        // continue to in-memory fallback
      }
    }

    return (memoryStore.responsesByDay.get(dayKey) ?? []).slice(0, take);
  },

  async getDropAggregate(dropId: string, dayKey: string): Promise<DropAggregate> {
    const all = await this.getRecentResponses(dayKey, 300);
    const matching = all.filter((entry) => entry.dropId === dropId && entry.completed);

    const reactionCount = matching.reduce<Map<string, number>>((acc, response) => {
      const key = response.responseText.toLowerCase();
      acc.set(key, (acc.get(key) ?? 0) + 1);
      return acc;
    }, new Map());

    const topReaction = [...reactionCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unpredictable";

    const minuteAgo = Date.now() - 60 * 1000;
    const latestParticipants = matching.filter((entry) => new Date(entry.submittedAt).getTime() >= minuteAgo)
      .length;

    return {
      dropId,
      totalResponses: matching.length,
      topReaction,
      latestParticipants,
    };
  },
};
