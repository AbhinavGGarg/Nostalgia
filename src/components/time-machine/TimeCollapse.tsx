"use client";

import { useEffect, useMemo, useState } from "react";
import type { CollapseStage } from "./types";

type TimeCollapseProps = {
  startedAt: number;
  onStageChange: (stage: CollapseStage) => void;
};

function computeStage(elapsedSeconds: number): CollapseStage {
  if (elapsedSeconds >= 105) {
    return 3;
  }
  if (elapsedSeconds >= 70) {
    return 2;
  }
  if (elapsedSeconds >= 38) {
    return 1;
  }
  return 0;
}

export function TimeCollapse({ startedAt, onStageChange }: TimeCollapseProps) {
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState<CollapseStage>(0);
  const [finalPanelDismissed, setFinalPanelDismissed] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(seconds);
      setStage((current) => {
        const next = computeStage(seconds);
        if (current !== next) {
          onStageChange(next);
          window.dispatchEvent(new Event("tm2016-glitch"));
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [onStageChange, startedAt]);

  const label = useMemo(() => {
    if (stage === 0) {
      return "timeline stable";
    }
    if (stage === 1) {
      return "time drift detected";
    }
    if (stage === 2) {
      return "algorithmic layer bleeding in";
    }
    return "2016/2026 collapse underway";
  }, [stage]);

  const showFinalPanel = stage === 3 && !finalPanelDismissed;

  useEffect(() => {
    if (!showFinalPanel) {
      return;
    }

    const autoDismissTimer = window.setTimeout(() => {
      setFinalPanelDismissed(true);
    }, 12000);

    return () => window.clearTimeout(autoDismissTimer);
  }, [showFinalPanel]);

  if (stage === 0) {
    return null;
  }

  return (
    <>
      <aside className="collapse-pill pointer-events-none fixed bottom-3 left-3 z-30 sm:bottom-6 sm:left-6">
        <p className="font-pixel text-[10px] text-cyan-100">TIME COLLAPSE MODE</p>
        <p className="mt-1 text-xs text-white">{label} • {elapsed}s in session</p>
      </aside>

      {stage >= 2 ? (
        <>
          <div className="pointer-events-none fixed inset-0 z-20 bg-[linear-gradient(120deg,rgba(8,1,32,0.08),rgba(215,238,255,0.1))] mix-blend-screen" />
          <aside className="fixed right-3 top-20 z-30 w-[min(90vw,280px)] rounded-2xl border border-slate-300/80 bg-white/88 p-3 text-slate-900 shadow-[0_10px_26px_rgba(22,22,35,0.3)] backdrop-blur-sm sm:right-6">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Modern Layer</p>
            <p className="mt-1 text-sm font-semibold">Suggested for you</p>
            <p className="mt-1 text-xs text-slate-700">3 algorithmic reels and 1 boosted post are entering your timeline.</p>
          </aside>
        </>
      ) : null}

      {showFinalPanel ? (
        <section className="collapse-final pointer-events-none fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="pointer-events-auto w-full max-w-3xl rounded-3xl border-2 border-white/55 bg-[linear-gradient(145deg,rgba(12,8,42,0.9),rgba(203,217,248,0.18))] p-5 shadow-[0_18px_70px_rgba(9,8,33,0.6)] backdrop-blur-md sm:p-8">
            <h3 className="font-chaos text-3xl text-white sm:text-4xl">2016 vs 2026</h3>
            <p className="mt-2 text-sm text-cyan-50">
              Raw, messy, human timelines are colliding with polished, optimized feeds.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-pink-200/50 bg-pink-300/15 p-3">
                <p className="font-pixel text-[10px] text-pink-100">2016 FEELING</p>
                <p className="mt-1 text-sm text-white">chaotic friendship, weird memes, accidental authenticity</p>
              </div>
              <div className="rounded-2xl border border-cyan-200/55 bg-cyan-200/20 p-3 text-slate-900">
                <p className="font-pixel text-[10px] text-slate-700">2026 FEELING</p>
                <p className="mt-1 text-sm font-semibold">optimized visibility, algorithm pressure, polished identity loops</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" className="retro-micro-btn" onClick={() => setFinalPanelDismissed(true)}>
                Keep Exploring
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
