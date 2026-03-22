import { ActiveDrop } from "@/lib/types";

export type AmbientResponse = {
  text: string;
  submittedAt: string;
  dropId: string;
  isGlobal: boolean;
};

export type ClientToServerEvents = {
  "session:join": (payload: { sessionId: string }) => void;
  "drop:submitted": (payload: AmbientResponse) => void;
};

export type ServerToClientEvents = {
  "presence:update": (payload: { activeUsers: number }) => void;
  "drop:global": (payload: { drop: ActiveDrop | null }) => void;
  "ambient:response": (payload: AmbientResponse) => void;
};
