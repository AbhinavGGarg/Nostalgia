"use client";

import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { CountdownTimer } from "@/components/countdown-timer";
import { DropCard } from "@/components/drop-card";
import { FloatingResponses } from "@/components/floating-responses";
import { LivePresence } from "@/components/live-presence";
import { ResultState } from "@/components/result-state";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCountdown } from "@/hooks/use-countdown";
import { useDropSocket } from "@/hooks/use-drop-socket";
import { DropOutcome, ActiveDrop } from "@/lib/types";
import { useDropStore } from "@/store/drop-store";
import { motion } from "framer-motion";
import { RefreshCw, Timer } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Screen = "loading" | "ready" | "cooldown" | "active" | "result" | "error";

export function DropExperience() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [drop, setDrop] = useState<ActiveDrop | null>(null);
  const [outcome, setOutcome] = useState<DropOutcome | null>(null);
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setSessionId = useDropStore((state) => state.setSessionId);
  const incomingGlobalDrop = useDropStore((state) => state.incomingGlobalDrop);
  const clearAmbientResponses = useDropStore((state) => state.clearAmbientResponses);

  const timeoutTriggered = useRef(false);
  const searchParams = useSearchParams();
  const { emitDropSubmitted } = useDropSocket(true);

  const initialize = useCallback(async () => {
    setErrorMessage(null);
    const sessionResponse = await fetch("/api/session", { cache: "no-store" });
    const sessionData = (await sessionResponse.json()) as { sessionId?: string };
    if (sessionData.sessionId) {
      setSessionId(sessionData.sessionId);
    }

    const statusResponse = await fetch("/api/drop/status", { cache: "no-store" });
    const statusData = (await statusResponse.json()) as {
      cooldownUntil?: string | null;
      activeDrop?: ActiveDrop | null;
    };

    if (statusData.activeDrop && new Date(statusData.activeDrop.expiresAt).getTime() > Date.now()) {
      setDrop(statusData.activeDrop);
      setScreen("active");
      return;
    }

    if (statusData.cooldownUntil && new Date(statusData.cooldownUntil).getTime() > Date.now()) {
      setCooldownUntil(statusData.cooldownUntil);
      setScreen("cooldown");
      return;
    }

    setScreen("ready");
  }, [setSessionId]);

  useEffect(() => {
    void initialize().catch(() => {
      setScreen("error");
      setErrorMessage("Connection fractured. Try again.");
    });
  }, [initialize]);

  const requestDrop = useCallback(async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    setOutcome(null);

    try {
      const response = await fetch("/api/drop/next", { method: "POST", cache: "no-store" });
      const data = (await response.json()) as
        | { ok: true; status: "issued" | "active"; drop: ActiveDrop }
        | { ok: false; status: "cooldown"; cooldownUntil: string };

      if (!data.ok) {
        setCooldownUntil(data.cooldownUntil);
        setScreen("cooldown");
        return;
      }

      timeoutTriggered.current = false;
      clearAmbientResponses();
      setDraft("");
      setDrop(data.drop);
      setScreen("active");
    } catch {
      setErrorMessage("The Drop glitched. Try again.");
      setScreen("error");
    } finally {
      setIsSubmitting(false);
    }
  }, [clearAmbientResponses]);

  const onDropExpired = useCallback(async () => {
    if (timeoutTriggered.current || screen !== "active") {
      return;
    }

    timeoutTriggered.current = true;
    const response = await fetch("/api/drop/timeout", { method: "POST" });
    const data = (await response.json()) as DropOutcome;
    setOutcome(data);
    setCooldownUntil(data.cooldownUntil ?? null);
    setScreen("result");
  }, [screen]);

  const activeCountdown = useCountdown({
    expiresAt: drop?.expiresAt,
    active: screen === "active",
    onExpire: onDropExpired,
  });

  const cooldownCountdown = useCountdown({
    expiresAt: cooldownUntil ?? undefined,
    active: screen === "cooldown",
    onExpire: () => {
      setCooldownUntil(null);
      setScreen("ready");
    },
  });

  const isDanger = activeCountdown.remainingSeconds <= 5;

  const submitDrop = useCallback(async () => {
    if (!drop || !draft.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/drop/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseText: draft }),
      });

      const data = (await response.json()) as DropOutcome;
      setOutcome(data);
      setCooldownUntil(data.cooldownUntil ?? null);
      setScreen("result");

      if (data.status === "submitted") {
        emitDropSubmitted({
          text: draft.trim(),
          submittedAt: new Date().toISOString(),
          dropId: drop.id,
          isGlobal: drop.isGlobal,
        });
      }
    } catch {
      setErrorMessage("Submission failed. The timer keeps moving.");
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, drop, emitDropSubmitted, isSubmitting]);

  useEffect(() => {
    if (screen !== "ready") {
      return;
    }

    if (searchParams.get("autostart") === "1") {
      void requestDrop();
    }
  }, [requestDrop, screen, searchParams]);

  const showGlobalCallout = useMemo(
    () => screen === "ready" && incomingGlobalDrop && new Date(incomingGlobalDrop.expiresAt).getTime() > Date.now(),
    [incomingGlobalDrop, screen],
  );
  const globalCalloutPrompt = showGlobalCallout && incomingGlobalDrop ? incomingGlobalDrop.prompt : null;

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-10">
      <AmbientBackdrop intense={Boolean(drop?.isGlobal)} />
      <SiteHeader />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-5 py-8 sm:px-8">
        <LivePresence />

        {screen === "loading" ? (
          <Card className="flex items-center justify-between">
            <p className="text-zinc-200">Warming up your moment...</p>
            <RefreshCw className="size-5 animate-spin text-cyan-200" />
          </Card>
        ) : null}

        {screen === "ready" ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="space-y-5">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-400">Drop Gate</p>
              <h1 className="text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
                You don&apos;t find the Drop.
                <span className="block text-cyan-200">The Drop finds you.</span>
              </h1>
              <p className="max-w-2xl text-zinc-300">
                Press once. Timer starts immediately. No retries. No alternate choices.
              </p>
              <Button size="lg" onClick={() => void requestDrop()} disabled={isSubmitting}>
                Receive Your Drop
              </Button>
            </Card>

            {showGlobalCallout ? (
              <Card className="border-fuchsia-300/30 bg-[radial-gradient(circle_at_15%_20%,rgba(232,121,249,0.25),transparent_55%),rgba(7,6,13,0.8)]">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-200">Global Drop live now</p>
                <h2 className="mt-2 text-2xl text-fuchsia-50">{globalCalloutPrompt}</h2>
                <Button className="mt-4" onClick={() => void requestDrop()}>
                  Enter Global Drop
                </Button>
              </Card>
            ) : null}
          </motion.div>
        ) : null}

        {screen === "cooldown" ? (
          <Card className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-400">Cooldown</p>
            <CountdownTimer label="Next Drop in" value={cooldownCountdown.formatted} />
            <p className="text-zinc-300">That moment is gone. A new one appears when the timer clears.</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" asChild>
                <Link href="/chaos">See Today&apos;s Chaos</Link>
              </Button>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </div>
          </Card>
        ) : null}

        {screen === "active" && drop ? (
          <div className="space-y-5">
            <Card className={drop.isGlobal ? "border-fuchsia-300/40" : ""}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300">
                  <Timer className="size-3.5" />
                  Timer is live
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {drop.isGlobal ? "Shared moment" : "Solo moment"}
                </p>
              </div>
              <div className="mt-5">
                <CountdownTimer label="Time Remaining" value={activeCountdown.formatted} danger={isDanger} />
              </div>
            </Card>

            <DropCard
              drop={drop}
              value={draft}
              setValue={setDraft}
              onSubmit={() => void submitDrop()}
              disabled={isSubmitting || activeCountdown.isExpired}
              isSubmitting={isSubmitting}
            />

            <FloatingResponses />
          </div>
        ) : null}

        {screen === "result" && outcome ? (
          <ResultState
            outcome={outcome}
            onWait={() => {
              if (cooldownUntil && new Date(cooldownUntil).getTime() > Date.now()) {
                setScreen("cooldown");
                return;
              }
              setScreen("ready");
            }}
          />
        ) : null}

        {screen === "error" ? (
          <Card className="space-y-4">
            <p className="text-2xl text-rose-200">Signal interrupted.</p>
            <p className="text-zinc-300">{errorMessage ?? "Try again in a second."}</p>
            <Button onClick={() => void initialize()}>Retry</Button>
          </Card>
        ) : null}

        {errorMessage ? <p className="text-sm text-rose-200">{errorMessage}</p> : null}
      </section>
    </main>
  );
}
