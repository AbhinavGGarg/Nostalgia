"use client";

import { useState } from "react";
import { CameraMode } from "./CameraMode";
import { MiniGames } from "./MiniGames";
import { TumblrMode } from "./TumblrMode";

type DeckTab = "camera" | "games" | "diary" | "about";

const TABS: Array<{ id: DeckTab; label: string }> = [
  { id: "camera", label: "Camera" },
  { id: "games", label: "Games" },
  { id: "diary", label: "Diary" },
  { id: "about", label: "About" },
];

export function ControlDeck() {
  const [tab, setTab] = useState<DeckTab>("camera");

  return (
    <section className="space-y-3">
      <section className="retro-panel p-3">
        <p className="font-pixel text-[10px] text-violet-100/90">QUICK CONTROLS</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {TABS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`retro-micro-btn w-full ${tab === entry.id ? "search2016-tab-active" : ""}`}
              onClick={() => setTab(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </section>

      {tab === "camera" ? <CameraMode /> : null}
      {tab === "games" ? <MiniGames /> : null}
      {tab === "diary" ? <TumblrMode /> : null}
      {tab === "about" ? (
        <section className="retro-panel p-4">
          <p className="font-pixel text-[10px] text-violet-100/90">FOR HACKATHON JUDGES</p>
          <h3 className="font-chaos mt-1 text-lg text-white">Why this matters</h3>
          <p className="mt-2 text-sm text-white/85">
            Modern social platforms can feel optimized, performative, and overwhelming. This prototype recreates a
            less-perfect social era to highlight what we lost: spontaneity, weirdness, and emotional honesty.
          </p>
        </section>
      ) : null}
    </section>
  );
}
