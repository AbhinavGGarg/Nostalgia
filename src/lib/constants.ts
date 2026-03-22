export const SESSION_COOKIE = "drop_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24;
export const DAILY_CHAOS_RETENTION_SECONDS = 60 * 60 * 24;
export const SESSION_COOLDOWN_SECONDS = 60 * 3;

export const GLOBAL_DROP_INTERVAL_MS = 1000 * 60 * 3;
export const GLOBAL_DROP_WINDOW_MS = 1000 * 40;
export const GLOBAL_CLOCK_EPOCH = Date.UTC(2026, 0, 1, 0, 0, 0);

export const SOCKET_PORT = Number(process.env.PORT ?? process.env.SOCKET_PORT ?? 4001);
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? `http://localhost:${SOCKET_PORT}`;
