"use client";

import { useMemo, useState } from "react";

type FilterMode = "dog" | "distort" | "none";

const MODES: FilterMode[] = ["dog", "distort", "none"];

function nowStamp() {
  const now = new Date();
  return now.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CameraMode() {
  const [mode, setMode] = useState<FilterMode>("dog");
  const [distortion, setDistortion] = useState(35);
  const [sent, setSent] = useState(false);

  const faceStyle = useMemo(() => {
    if (mode === "distort") {
      const tilt = (distortion - 50) / 3.8;
      const stretch = 1 + distortion / 180;
      return {
        transform: "rotate(" + tilt.toFixed(1) + "deg) scaleX(" + stretch.toFixed(2) + ")",
      };
    }

    return undefined;
  }, [distortion, mode]);

  const sendToStory = () => {
    window.dispatchEvent(new Event("tm2016-notify"));
    setSent(true);
    window.setTimeout(() => setSent(false), 1800);
  };

  const cycleMode = () => {
    const current = MODES.indexOf(mode);
    const nextIndex = (current + 1) % MODES.length;
    setMode(MODES[nextIndex]);
  };

  return (
    <section className="retro-panel p-4">
      <p className="font-pixel text-[10px] text-pink-100">SNAPCHAT 2016 CAMERA MODE</p>
      <h3 className="font-chaos mt-1 text-xl text-white">Ghost Lens</h3>

      <div className="camera-shell mt-3">
        <div className="camera-stage">
          <div className="camera-face" style={faceStyle}>
            <div className="eye left" />
            <div className="eye right" />
            <div className="nose" />
            <div className="mouth" />
          </div>

          {mode === "dog" ? (
            <>
              <div className="dog-ear left" />
              <div className="dog-ear right" />
              <div className="dog-nose" />
            </>
          ) : null}

          <div className="camera-timestamp">{nowStamp()}</div>
        </div>

        {sent ? <div className="story-toast">Sent to Story • 23 views in 5 min</div> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="retro-micro-btn" onClick={cycleMode}>
          Filter: {mode}
        </button>
        <button type="button" className="retro-micro-btn" onClick={sendToStory}>
          Send to Story
        </button>
      </div>

      <label className="mt-3 block text-xs text-cyan-50">
        Distortion
        <input
          type="range"
          min={0}
          max={100}
          value={distortion}
          onChange={(event) => setDistortion(Number(event.target.value))}
          className="mt-1 w-full"
        />
      </label>
    </section>
  );
}
