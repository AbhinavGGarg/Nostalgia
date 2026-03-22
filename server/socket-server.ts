import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { getActiveGlobalDrop, normalizeSnippet } from "../src/lib/drop-engine";
import { SOCKET_PORT } from "../src/lib/constants";
import { AmbientResponse, ClientToServerEvents, ServerToClientEvents } from "../src/lib/socket-events";

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  },
});

let activeUsers = 0;
let lastBroadcastGlobalKey: string | null = null;

const broadcastPresence = () => {
  io.emit("presence:update", { activeUsers });
};

const normalizeAmbient = (payload: AmbientResponse): AmbientResponse => ({
  ...payload,
  text: normalizeSnippet(payload.text, 80),
});

io.on("connection", (socket) => {
  activeUsers += 1;
  broadcastPresence();

  socket.on("session:join", () => {
    const globalDrop = getActiveGlobalDrop();
    socket.emit("drop:global", { drop: globalDrop });
  });

  socket.on("drop:submitted", (payload) => {
    io.emit("ambient:response", normalizeAmbient(payload));
  });

  socket.on("disconnect", () => {
    activeUsers = Math.max(0, activeUsers - 1);
    broadcastPresence();
  });
});

setInterval(() => {
  const activeDrop = getActiveGlobalDrop();
  const key = activeDrop ? `${activeDrop.id}:${activeDrop.expiresAt}` : "none";

  if (key === lastBroadcastGlobalKey) {
    return;
  }

  lastBroadcastGlobalKey = key;
  io.emit("drop:global", { drop: activeDrop });
}, 1200);

app.get("/health", (_req, res) => {
  res.json({ ok: true, activeUsers, globalDrop: getActiveGlobalDrop() });
});

httpServer.listen(SOCKET_PORT, () => {
  console.log(`DROP socket server listening on :${SOCKET_PORT}`);
});
