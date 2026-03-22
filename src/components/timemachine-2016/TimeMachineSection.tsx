"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { generateNostalgiaResults } from "./data";
import { ModalViewer } from "./ModalViewer";
import { NostalgiaSearchBar } from "./NostalgiaSearchBar";
import { PopupSystem } from "./PopupSystem";
import { ResultsFeed } from "./ResultsFeed";
import { SoundController } from "./SoundController";
import { TimeMachineInput } from "./TimeMachineInput";
import { TransitionOverlay } from "./TransitionOverlay";
import type { MemoryInput, NostalgiaResult } from "./types";

type Phase = "input" | "transition" | "world";

export function TimeMachineSection() {
  const [phase, setPhase] = useState<Phase>("input");
  const [memory, setMemory] = useState<MemoryInput | null>(null);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<NostalgiaResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<NostalgiaResult | null>(null);
  const [flicker, setFlicker] = useState(false);

  const performSearch = useCallback(
    (nextQuery: string) => {
      if (!memory) {
        return;
      }

      setQuery(nextQuery);
      setSearching(true);

      window.setTimeout(() => {
        setResults(generateNostalgiaResults(memory, nextQuery));
        setSearching(false);
      }, 900 + Math.floor(Math.random() * 850));
    },
    [memory],
  );

  useEffect(() => {
    if (phase !== "world") {
      return;
    }

    const timer = window.setInterval(() => {
      setFlicker(Math.random() > 0.78);
    }, 1200);

    return () => window.clearInterval(timer);
  }, [phase]);

  const memorySummary = useMemo(() => {
    if (!memory) {
      return "";
    }
    return `${memory.interests} • ${memory.dayFeel}`;
  }, [memory]);

  if (phase === "input") {
    return (
      <TimeMachineInput
        onSubmit={(input) => {
          setMemory(input);
          setQuery(input.interests);
          setPhase("transition");
        }}
      />
    );
  }

  if (phase === "transition") {
    return (
      <TransitionOverlay
        onComplete={() => {
          setPhase("world");
          if (memory) {
            performSearch(memory.interests);
          }
        }}
      />
    );
  }

  if (!memory) {
    return null;
  }

  return (
    <main className={`tmx-world ${flicker ? "tmx-world-flicker" : ""}`}>
      <div className="tmx-noise" />
      <div className="tmx-scanlines" />
      <PopupSystem memory={memory} enabled />

      <header className="tmx-world-header">
        <div>
          <p className="tmx-pill">2016 TIME MACHINE — LIVE</p>
          <h1>Search-Powered Nostalgia Web</h1>
          <p>{memorySummary}</p>
        </div>
        <SoundController autoStart={false} />
      </header>

      <NostalgiaSearchBar initialQuery={query || memory.interests} searching={searching} onSearch={performSearch} />

      <ResultsFeed
        results={results}
        searching={searching}
        onOpenResult={(result) => {
          setSelectedResult(result);
        }}
      />

      <ModalViewer result={selectedResult} onClose={() => setSelectedResult(null)} />
    </main>
  );
}
