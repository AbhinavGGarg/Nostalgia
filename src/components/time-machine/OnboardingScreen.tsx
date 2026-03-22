"use client";

import { useEffect, useMemo, useState } from "react";
import type { FavoriteApp, PersonalityVibe, UserProfile } from "./types";

type OnboardingScreenProps = {
  onComplete: (profile: UserProfile) => void;
};

const APPS: FavoriteApp[] = ["Instagram", "Snapchat", "Musical.ly", "Vine", "YouTube"];
const VIBES: PersonalityVibe[] = [
  "funny",
  "aesthetic",
  "chaotic",
  "introverted",
  "edgy",
  "soft",
  "main-character",
  "daydreamer",
  "gamer",
  "romantic",
  "hype",
];
const LOADING_STEPS = [
  "Rewinding time...",
  "Restoring your 2016...",
  "Connecting to 2016 servers...",
  "Buffering ancient memes...",
  "Recovering blurry concert photos...",
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [ageIn2016Input, setAgeIn2016Input] = useState("");
  const [favoriteApps, setFavoriteApps] = useState<FavoriteApp[]>(["Instagram", "Snapchat"]);
  const [favoriteContent, setFavoriteContent] = useState("memes, pop music, bottle flipping");
  const [vibe, setVibe] = useState<PersonalityVibe>("chaotic");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const parsedAgeIn2016 = Number.parseInt(ageIn2016Input, 10);
  const hasValidAge = Number.isFinite(parsedAgeIn2016) && parsedAgeIn2016 >= 1 && parsedAgeIn2016 <= 120;

  const loadingLabel = useMemo(
    () => LOADING_STEPS[Math.min(LOADING_STEPS.length - 1, Math.floor(progress / 22))],
    [progress],
  );

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const nextValue = Math.min(100, current + 7 + Math.floor(Math.random() * 13));
        if (nextValue >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            onComplete({
              ageIn2016: hasValidAge ? parsedAgeIn2016 : 16,
              favoriteApps,
              favoriteContent,
              vibe,
            });
          }, 420);
        }
        return nextValue;
      });
    }, 290);

    return () => window.clearInterval(interval);
  }, [favoriteApps, favoriteContent, hasValidAge, isLoading, onComplete, parsedAgeIn2016, vibe]);

  const toggleApp = (app: FavoriteApp) => {
    setFavoriteApps((current) => {
      if (current.includes(app)) {
        const next = current.filter((value) => value !== app);
        return next.length > 0 ? next : current;
      }
      return [...current, app];
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasValidAge) {
      return;
    }
    setProgress(0);
    setIsLoading(true);
  };

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="vhs-noise pointer-events-none absolute inset-0 opacity-55" />
      <div className="pointer-events-none absolute -top-24 left-8 h-56 w-56 rounded-full bg-pink-400/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-8 h-72 w-72 rounded-full bg-cyan-400/35 blur-3xl" />

      <section className="relative rounded-[2rem] border-4 border-pink-200/80 bg-[linear-gradient(135deg,rgba(255,166,200,0.32),rgba(82,201,255,0.24)_40%,rgba(164,109,255,0.38))] p-4 shadow-[0_0_0_4px_rgba(255,255,255,0.15),0_28px_80px_rgba(20,9,47,0.55)] sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-white/90 sm:text-xs">
          <span className="rounded-full border border-white/55 bg-black/25 px-3 py-1">Memory calibration wizard</span>
          <span className="rounded-full border border-pink-100/80 bg-pink-400/40 px-3 py-1">NOSTALGIA BETA</span>
        </div>

        <h1 className="font-chaos text-4xl leading-[0.98] text-white drop-shadow-[3px_3px_0_rgba(32,10,70,0.65)] sm:text-6xl">
          NOSTALGIA
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Build your personalized digital time machine and drop back into the weird, loud, emotional internet era.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="retro-input-wrap sm:col-span-1">
            <span className="retro-label">Age in 2016</span>
            <input
              type="number"
              min={1}
              max={120}
              value={ageIn2016Input}
              placeholder="Type your age (e.g. 7)"
              disabled={isLoading}
              onChange={(event) => setAgeIn2016Input(event.target.value)}
              className="retro-input"
            />
          </label>

          <label className="retro-input-wrap sm:col-span-1">
            <span className="retro-label">Personality vibe</span>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setVibe(entry)}
                  className={`retro-pill ${vibe === entry ? "retro-pill-active" : ""}`}
                >
                  {entry}
                </button>
              ))}
            </div>
          </label>

          <fieldset className="retro-input-wrap sm:col-span-2">
            <legend className="retro-label">Favorite apps</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {APPS.map((app) => (
                <button
                  key={app}
                  type="button"
                  disabled={isLoading}
                  onClick={() => toggleApp(app)}
                  className={`retro-pill ${favoriteApps.includes(app) ? "retro-pill-active" : ""}`}
                >
                  {app}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="retro-input-wrap sm:col-span-2">
            <span className="retro-label">Favorite content (comma separated)</span>
            <textarea
              rows={3}
              value={favoriteContent}
              disabled={isLoading}
              onKeyDown={() => window.dispatchEvent(new Event("tm2016-type"))}
              onChange={(event) => setFavoriteContent(event.target.value)}
              className="retro-input min-h-24 resize-y"
            />
          </label>

          <div className="sm:col-span-2">
            <button type="submit" disabled={isLoading || !hasValidAge} className="retro-submit">
              {isLoading ? "Initializing Time Machine..." : "Start My 2016"}
            </button>
          </div>

          {isLoading ? (
            <div className="sm:col-span-2">
              <p className="font-pixel text-xs text-cyan-100">{loadingLabel}</p>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full border border-white/60 bg-black/35">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#33ffd5,#a55dff,#ff7db6)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}
