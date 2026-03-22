"use client";

import { SOCKET_URL } from "@/lib/constants";
import { ClientToServerEvents, ServerToClientEvents } from "@/lib/socket-events";
import { useDropStore } from "@/store/drop-store";
import { useEffect, useMemo, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useDropSocket = (enabled: boolean) => {
  const sessionId = useDropStore((state) => state.sessionId);
  const setActiveUsers = useDropStore((state) => state.setActiveUsers);
  const setIncomingGlobalDrop = useDropStore((state) => state.setIncomingGlobalDrop);
  const pushAmbientResponse = useDropStore((state) => state.pushAmbientResponse);

  const socketRef = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionDelayMax: 4000,
    });

    socketRef.current = socket;

    socket.on("presence:update", ({ activeUsers }) => {
      setActiveUsers(activeUsers);
    });

    socket.on("drop:global", ({ drop }) => {
      setIncomingGlobalDrop(drop);
    });

    socket.on("ambient:response", (response) => {
      pushAmbientResponse(response);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, pushAmbientResponse, setActiveUsers, setIncomingGlobalDrop]);

  useEffect(() => {
    if (!sessionId || !socketRef.current) {
      return;
    }

    socketRef.current.emit("session:join", { sessionId });
  }, [sessionId]);

  return useMemo(
    () => ({
      emitDropSubmitted: (payload: {
        text: string;
        submittedAt: string;
        dropId: string;
        isGlobal: boolean;
      }) => {
        socketRef.current?.emit("drop:submitted", payload);
      },
    }),
    [],
  );
};
