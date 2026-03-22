export type DropType = "text" | "reaction" | "voice_stub";

export type DropOption = {
  id: string;
  label: string;
};

export type DropDefinition = {
  id: string;
  type: DropType;
  prompt: string;
  durationSeconds: number;
  weight: number;
  mediaUrl?: string;
  mediaAlt?: string;
  options?: DropOption[];
  isGlobalCandidate?: boolean;
};

export type ActiveDrop = {
  id: string;
  type: DropType;
  prompt: string;
  durationSeconds: number;
  mediaUrl?: string;
  mediaAlt?: string;
  options?: DropOption[];
  isGlobal: boolean;
  issuedAt: string;
  expiresAt: string;
};

export type SessionState = {
  id: string;
  createdAt: string;
  lastDropAt?: string;
  cooldownUntil?: string;
  lastDropId?: string;
  activeDrop?: ActiveDrop;
};

export type StoredResponse = {
  sessionId: string;
  dropId: string;
  dropPrompt: string;
  dropType: DropType;
  responseText: string;
  submittedAt: string;
  responseTimeMs: number;
  completed: boolean;
  expired: boolean;
  isGlobal: boolean;
  label: "fast" | "hesitant" | "chaotic" | "too honest";
};

export type DropAggregate = {
  dropId: string;
  totalResponses: number;
  topReaction: string;
  latestParticipants: number;
};

export type DropOutcome = {
  status: "submitted" | "missed" | "locked" | "cooldown";
  message: string;
  cooldownUntil?: string;
  aggregate?: DropAggregate;
};
