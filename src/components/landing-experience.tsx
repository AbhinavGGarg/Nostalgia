"use client";

import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { HowItWorks } from "@/components/how-it-works";
import { LivePresence } from "@/components/live-presence";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useDropSocket } from "@/hooks/use-drop-socket";
import { useDropStore } from "@/store/drop-store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

const PAINS = [
  "Feeds are too optimized to surprise you.",
  "Everything feels polished, nobody feels real.",
  "We stopped sharing moments and started managing performance.",
];

export function LandingExperience() {
  const setSessionId = useDropStore((state) => state.setSessionId);
  useDropSocket(true);

  useEffect(() => {
    const bootstrap = async () => {
      const response = await fetch("/api/session", { method: "GET", cache: "no-store" });
      const data = (await response.json()) as { sessionId?: string };
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
    };

    void bootstrap();
  }, [setSessionId]);

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-8">
      <AmbientBackdrop />
      <SiteHeader />

      <section className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 px-5 pt-10 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-8"
        >
          <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-cyan-100">
            Spontaneity Engine
          </p>
          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            The internet used to surprise you.
            <span className="block text-cyan-200">Now it happens again.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-zinc-300">
            You do not pick content. Content happens to you. One random Drop per session. A timer. No retries. No
            optimization.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="font-mono uppercase tracking-[0.12em]">
              <Link href="/drop?autostart=1">Receive Your Drop</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/manifesto">Why this exists</Link>
            </Button>
          </div>
          <LivePresence />
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.45 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl sm:p-7"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-400">Why DROP now</p>
          <ul className="mt-4 space-y-3">
            {PAINS.map((pain) => (
              <li key={pain} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-200">
                {pain}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 p-4 text-sm text-fuchsia-100">
            Less feed. More moment.
          </div>
        </motion.aside>
      </section>

      <HowItWorks />
    </main>
  );
}
