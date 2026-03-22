"use client";

import { useMemo, useState } from "react";

type Backdrop = "sunset" | "galaxy" | "neon";

type Thought = {
  id: string;
  text: string;
  background: Backdrop;
  time: string;
};

const SEED_THOUGHTS: Thought[] = [
  {
    id: "seed-1",
    text: "i miss when everyone was online at 1am and nobody cared about aesthetics",
    background: "galaxy",
    time: "yesterday",
  },
  {
    id: "seed-2",
    text: "if we all disappear, at least let it be with a playlist screenshot",
    background: "sunset",
    time: "4h ago",
  },
  {
    id: "seed-3",
    text: "someone said touch grass but this dashboard is my emotional support",
    background: "neon",
    time: "38m ago",
  },
];

const BACKDROPS: Backdrop[] = ["sunset", "galaxy", "neon"];
const BACKDROP_DETAILS: Record<Backdrop, string> = {
  sunset: "sunset = warm nostalgic diary vibe",
  galaxy: "galaxy = late-night deep-thought vibe",
  neon: "neon = chaotic internet-energy vibe",
};

export function TumblrMode() {
  const [background, setBackground] = useState<Backdrop>("sunset");
  const [draft, setDraft] = useState("being online felt simpler when everything was messy");
  const [thoughts, setThoughts] = useState<Thought[]>(SEED_THOUGHTS);

  const canPost = useMemo(() => draft.trim().length > 0, [draft]);

  const postThought = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    const thought: Thought = {
      id: "user-" + Date.now(),
      text,
      background,
      time: "just now",
    };

    setThoughts((current) => [thought, ...current].slice(0, 8));
    setDraft("");
    window.dispatchEvent(new Event("tm2016-notify"));
  };

  return (
    <section className="retro-panel p-4">
      <p className="font-pixel text-[10px] text-pink-100">TUMBLR THOUGHT MODE</p>
      <h3 className="font-chaos mt-1 text-xl text-white">Anonymous Diary Wall</h3>

      <label className="mt-3 block text-xs text-cyan-50">
        Write anonymous thought
        <textarea
          value={draft}
          rows={3}
          onKeyDown={() => window.dispatchEvent(new Event("tm2016-type"))}
          onChange={(event) => setDraft(event.target.value)}
          className="retro-input mt-1 min-h-20"
          placeholder="drop your 2am thoughts..."
        />
      </label>

      <div className="mt-2 flex flex-wrap gap-2">
        {BACKDROPS.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setBackground(entry)}
            className={`retro-pill ${background === entry ? "retro-pill-active" : ""}`}
          >
            {entry}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-cyan-100">{BACKDROP_DETAILS[background]}</p>

      <button type="button" disabled={!canPost} onClick={postThought} className="retro-micro-btn mt-3">
        Post Anonymously
      </button>

      <div className="mt-4 space-y-2">
        {thoughts.map((thought) => (
          <article key={thought.id} className={`thought-card thought-${thought.background}`}>
            <p className="text-sm text-white">{thought.text}</p>
            <p className="mt-1 text-[11px] text-cyan-100">anonymous • {thought.time}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
