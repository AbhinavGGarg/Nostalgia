"use client";

import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { ChaosMemoryCard } from "@/components/chaos-memory-card";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StoredResponse } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

type ChaosPeer = {
  text: string;
  submittedAt: string;
  label: string;
  dropId: string;
};

type ChaosResponse = {
  ok: boolean;
  mine: StoredResponse[];
  peers: ChaosPeer[];
};

export function ChaosExperience() {
  const [data, setData] = useState<ChaosResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await fetch("/api/chaos/today", { cache: "no-store" });
      const payload = (await response.json()) as ChaosResponse;
      setData(payload);
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-16">
      <AmbientBackdrop />
      <SiteHeader />

      <section className="relative z-10 mx-auto w-full max-w-6xl space-y-8 px-5 pt-8 sm:px-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-400">Today&apos;s Chaos</p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
            You had to be there.
          </h1>
          <p className="max-w-2xl text-zinc-300">
            This recap expires after 24 hours. No permanent profile. Just fragments from a day that happened live.
          </p>
        </div>

        {loading ? (
          <Card>Gathering your fragments...</Card>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">Your moments</h2>
              {data?.mine.length ? (
                data.mine.map((response) => <ChaosMemoryCard key={`${response.dropId}-${response.submittedAt}`} response={response} />)
              ) : (
                <Card className="text-zinc-300">No drop completed yet today.</Card>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-fuchsia-200">Others nearby</h2>
              <Card className="space-y-3">
                {data?.peers.length ? (
                  data.peers.map((peer, index) => (
                    <motion.article
                      key={`${peer.dropId}-${peer.submittedAt}-${index}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <p className="text-sm text-zinc-100">{peer.text}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">{peer.label}</p>
                    </motion.article>
                  ))
                ) : (
                  <p className="text-sm text-zinc-300">No ambient fragments yet. Keep listening.</p>
                )}
              </Card>
            </section>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link href="/drop">Enter DROP</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
