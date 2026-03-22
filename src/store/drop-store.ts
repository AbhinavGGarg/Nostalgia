"use client";

import { AmbientResponse } from "@/lib/socket-events";
import { ActiveDrop } from "@/lib/types";
import { create } from "zustand";

type DropClientState = {
  sessionId: string | null;
  activeUsers: number;
  incomingGlobalDrop: ActiveDrop | null;
  ambientResponses: AmbientResponse[];
  setSessionId: (sessionId: string) => void;
  setActiveUsers: (count: number) => void;
  setIncomingGlobalDrop: (drop: ActiveDrop | null) => void;
  pushAmbientResponse: (response: AmbientResponse) => void;
  clearAmbientResponses: () => void;
};

export const useDropStore = create<DropClientState>((set) => ({
  sessionId: null,
  activeUsers: 0,
  incomingGlobalDrop: null,
  ambientResponses: [],
  setSessionId: (sessionId) => set({ sessionId }),
  setActiveUsers: (activeUsers) => set({ activeUsers }),
  setIncomingGlobalDrop: (incomingGlobalDrop) => set({ incomingGlobalDrop }),
  pushAmbientResponse: (response) =>
    set((state) => ({
      ambientResponses: [response, ...state.ambientResponses].slice(0, 18),
    })),
  clearAmbientResponses: () => set({ ambientResponses: [] }),
}));
