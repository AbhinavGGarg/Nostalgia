"use client";

import { useState } from "react";
import type { MemoryInput } from "./types";

type TimeMachineInputProps = {
  onSubmit: (input: MemoryInput) => void;
};

const APP_OPTIONS = ["Instagram", "Snapchat", "Vine", "YouTube", "Spotify"];
const QUICK_STARTS = [
  "music, memes, youtube commentary",
  "school stress, gaming after homework",
  "summer boredom, playlist screenshots, vine loops",
];

export function TimeMachineInput({ onSubmit }: TimeMachineInputProps) {
  const [interests, setInterests] = useState("");
  const [dayFeel, setDayFeel] = useState("");
  const [favoriteApps, setFavoriteApps] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleApp = (app: string) => {
    setFavoriteApps((current) => {
      if (current.includes(app)) {
        return current.filter((entry) => entry !== app);
      }
      return [...current, app];
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!interests.trim()) {
      setError("Tell us what you were into first.");
      return;
    }

    if (!dayFeel.trim()) {
      setError("Tell us what your days felt like.");
      return;
    }

    setError(null);
    onSubmit({
      interests: interests.trim(),
      dayFeel: dayFeel.trim(),
      favoriteApps,
    });
  };

  return (
    <main className="tmx-shell tmx-center">
      <div className="tmx-noise" />
      <section className="tmx-input-card">
        <p className="tmx-pill">2016 TIME MACHINE</p>
        <h1 className="tmx-title">Nostalgia Web Experience</h1>
        <p className="tmx-subtitle">
          Type what you remember and we will rebuild your messy 2016 internet timeline.
        </p>
        <div className="tmx-chip-row tmx-quick-row" aria-label="Quick start memory examples">
          {QUICK_STARTS.map((entry) => (
            <button
              key={entry}
              type="button"
              className="tmx-chip"
              onClick={() => {
                setInterests(entry);
                setError(null);
              }}
            >
              use: {entry}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="tmx-form-grid">
          <label className="tmx-field" htmlFor="tmx-interests">
            <span>What were you into in 2016?</span>
            <textarea
              id="tmx-interests"
              value={interests}
              onChange={(event) => {
                setInterests(event.target.value);
                setError(null);
              }}
              onKeyDown={() => window.dispatchEvent(new Event("tmx-type"))}
              placeholder="listening to music, playing games, watching YouTube..."
              rows={3}
            />
          </label>

          <label className="tmx-field" htmlFor="tmx-dayfeel">
            <span>What did your days feel like?</span>
            <textarea
              id="tmx-dayfeel"
              value={dayFeel}
              onChange={(event) => {
                setDayFeel(event.target.value);
                setError(null);
              }}
              onKeyDown={() => window.dispatchEvent(new Event("tmx-type"))}
              placeholder="school mornings, summer boredom, late-night scrolling..."
              rows={3}
            />
          </label>

          <fieldset className="tmx-field">
            <legend>Favorite apps (optional)</legend>
            <div className="tmx-chip-row">
              {APP_OPTIONS.map((app) => (
                <button
                  key={app}
                  type="button"
                  className={`tmx-chip ${favoriteApps.includes(app) ? "tmx-chip-active" : ""}`}
                  onClick={() => toggleApp(app)}
                >
                  {app}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="tmx-cta">
            Go Back to 2016
          </button>

          {error ? (
            <p className="tmx-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
