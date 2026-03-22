# DROP MVP

DROP is a spontaneity-first social web app:

- one random Drop per session
- timer starts immediately
- no retries, no feed, no scrolling logic
- post-drop memory is ephemeral and resets after 24h
- global shared Drops and ambient live responses over Socket.io

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + Framer Motion
- Zustand for lightweight client state
- Socket.io (`server/socket-server.ts`)
- Redis-backed ephemeral storage with in-memory fallback

## Run locally

1. Install:

```bash
npm install
```

2. Optional Redis:

```bash
export REDIS_URL=redis://localhost:6379
```

3. Start web + socket servers together:

```bash
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Socket server: `http://localhost:4001`

If your frontend runs on a custom origin, set:

```bash
export NEXT_PUBLIC_APP_ORIGIN=http://localhost:3000
```

For the Nostalgia search engine (`/`), add either:

- `SERPSTACK_API_KEY` (recommended now, broad web + easy setup)
- `TAVILY_API_KEY` (broad web alternative)
- `SEARCH_API_KEY` for Bing
- `YOUTUBE_API_KEY` for YouTube fallback

```bash
cp .env.example .env.local
```

## Product flow

1. Landing (`/`) with hero, ambient visuals, and “Receive Your Drop”
2. Drop screen (`/drop`) with strict one-moment timer loop
3. Global Drops occasionally override local random selection
4. Result state with aggregate participation pulse
5. Today’s Chaos (`/chaos`) poetic recap for the current day only
6. Manifesto (`/manifesto`) anti-algorithm positioning

## Project structure

```text
src/
  app/
    api/                 # session + drop + chaos endpoints
    drop/ chaos/ manifesto/
  components/            # reusable UI and page experience modules
  data/drops.ts          # seeded 25+ drop prompts
  hooks/                 # timer + socket hooks
  lib/                   # engine, storage, session, types
  store/drop-store.ts    # Zustand client state
server/
  socket-server.ts       # realtime presence + global drop broadcast
public/drops/            # cursed visual assets for reaction drops
```

## Notes

- `REDIS_URL` is optional; app falls back to in-memory ephemeral storage automatically.
- No auth is required for MVP; users are tracked via anonymous session cookies.
