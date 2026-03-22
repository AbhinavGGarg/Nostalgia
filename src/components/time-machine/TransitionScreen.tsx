"use client";

import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "./types";

type TransitionScreenProps = {
  profile: UserProfile;
  onComplete: () => void;
};

const STATUS_LINES = [
  "Stabilizing VHS timeline...",
  "Injecting dog filters into memory stack...",
  "Recovering low-resolution selfies...",
  "Rebuilding your old homepage...",
  "Dialing up to 2016 internet...",
];

export function TransitionScreen({ profile, onComplete }: TransitionScreenProps) {
  const [progress, setProgress] = useState(0);

  const line = useMemo(() => {
    const index = Math.min(STATUS_LINES.length - 1, Math.floor(progress / 21));
    return STATUS_LINES[index];
  }, [progress]);

  useEffect(() => {
    window.dispatchEvent(new Event("tm2016-glitch"));

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const nextValue = Math.min(100, current + 9 + Math.floor(Math.random() * 16));
        if (nextValue >= 100) {
          window.clearInterval(interval);
          window.setTimeout(onComplete, 650);
        }
        return nextValue;
      });
    }, 210);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,103,193,0.38),transparent_34%),radial-gradient(circle_at_84%_64%,rgba(50,225,255,0.24),transparent_44%),#020010]" />
      <div className="vhs-noise vhs-flicker pointer-events-none absolute inset-0 opacity-85" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-55" />

      <section className="glitch-panel relative z-10 w-full max-w-2xl rounded-[1.6rem] border-2 border-white/70 bg-black/45 p-6 text-white shadow-[0_0_80px_rgba(140,97,255,0.55)] backdrop-blur-sm sm:p-8">
        <p className="font-pixel text-xs text-pink-200">TIME MACHINE SEQUENCE // USER AGE: {profile.ageIn2016}</p>
        <h2 className="font-chaos mt-3 text-4xl text-white sm:text-5xl">Entering 2016...</h2>
        <p className="mt-2 text-sm text-cyan-100">{line}</p>

        <div className="mt-8 h-4 overflow-hidden rounded-full border border-white/60 bg-black/70">
          <div
            className="h-full bg-[linear-gradient(90deg,#44f7ff_0%,#ff6fb6_45%,#a966ff_100%)] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
          <div className="rounded-xl border border-white/45 bg-white/10 p-3">Favorite apps synced: {profile.favoriteApps.join(", ")}</div>
          <div className="rounded-xl border border-white/45 bg-white/10 p-3">Vibe signature: {profile.vibe}</div>
        </div>
      </section>
    </main>
  );
}
