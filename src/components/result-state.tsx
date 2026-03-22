"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropOutcome } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

type ResultStateProps = {
  outcome: DropOutcome;
  onWait: () => void;
};

export function ResultState({ outcome, onWait }: ResultStateProps) {
  const tone =
    outcome.status === "submitted"
      ? "You were there."
      : outcome.status === "missed"
        ? "Too late. It already happened."
        : "That moment is gone.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="space-y-5 border-cyan-300/30">
        <h2 className="text-4xl font-semibold tracking-tight text-cyan-100">{tone}</h2>
        <p className="max-w-xl text-zinc-300">{outcome.message}</p>

        {outcome.aggregate ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Participants</p>
              <p className="mt-1 text-3xl text-zinc-100">{outcome.aggregate.totalResponses}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Common Pulse</p>
              <p className="mt-1 text-2xl text-zinc-100">{outcome.aggregate.topReaction}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Last Minute</p>
              <p className="mt-1 text-3xl text-zinc-100">{outcome.aggregate.latestParticipants}</p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="ghost" onClick={onWait}>
            Wait for next Drop
          </Button>
          <Button asChild variant="ghost">
            <Link href="/chaos">See Today&apos;s Chaos</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
