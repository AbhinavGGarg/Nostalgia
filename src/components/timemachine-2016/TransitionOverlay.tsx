"use client";

import { useEffect, useMemo, useState } from "react";

type TransitionOverlayProps = {
  onComplete: () => void;
};

const LINES = ["Rewinding timeline...", "Loading 2016...", "Restoring memories..."];

export function TransitionOverlay({ onComplete }: TransitionOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new Event("tmx-rewind"));

    const first = window.setTimeout(() => setProgress(1), 900);
    const second = window.setTimeout(() => setProgress(2), 1750);
    const done = window.setTimeout(onComplete, 2850);

    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  const line = useMemo(() => LINES[progress] ?? LINES[LINES.length - 1], [progress]);

  return (
    <section className="tmx-transition">
      <div className="tmx-noise" />
      <div className="tmx-scanlines" />
      <div className="tmx-glitch-layer" />

      <div className="tmx-transition-card">
        <p className="tmx-transition-line">{line}</p>
        <div className="tmx-transition-bar-wrap">
          <div className="tmx-transition-bar" style={{ width: `${30 + progress * 30}%` }} />
        </div>
      </div>
    </section>
  );
}
