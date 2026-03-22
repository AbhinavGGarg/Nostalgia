"use client";

import { useEffect, useMemo, useState } from "react";

type Position = {
  x: number;
  y: number;
};

function nextPos(): Position {
  return {
    x: 10 + Math.random() * 72,
    y: 12 + Math.random() * 68,
  };
}

export function MiniGames() {
  const [flipping, setFlipping] = useState(false);
  const [bottleAngle, setBottleAngle] = useState(0);
  const [flipScore, setFlipScore] = useState(0);
  const [flipMessage, setFlipMessage] = useState("Ready to flip?");

  const [playingCatch, setPlayingCatch] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [catches, setCatches] = useState(0);
  const [misses, setMisses] = useState(0);
  const [target, setTarget] = useState<Position>({ x: 48, y: 52 });

  const flipBottle = () => {
    if (flipping) {
      return;
    }

    setFlipping(true);
    const spins = 3 + Math.floor(Math.random() * 5);
    const finalAngle = spins * 360 + Math.floor(Math.random() * 180);
    setBottleAngle(finalAngle);

    window.setTimeout(() => {
      const landed = Math.random() > 0.42;
      setBottleAngle(landed ? 0 : 94 + Math.random() * 22);
      setFlipMessage(landed ? "Landed!! internet legend" : "Nope. table too slippery");
      if (landed) {
        setFlipScore((current) => current + 1);
      }
      setFlipping(false);
      window.dispatchEvent(new Event("tm2016-notify"));
    }, 950);
  };

  const startCatch = () => {
    setPlayingCatch(true);
    setTimeLeft(20);
    setCatches(0);
    setMisses(0);
    setTarget(nextPos());
  };

  useEffect(() => {
    if (!playingCatch) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setPlayingCatch(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [playingCatch]);

  useEffect(() => {
    if (!playingCatch) {
      return;
    }

    const mover = window.setInterval(() => {
      setTarget(nextPos());
      setMisses((current) => current + 1);
    }, 780 + Math.floor(Math.random() * 250));

    return () => window.clearInterval(mover);
  }, [playingCatch]);

  const scoreLabel = useMemo(() => {
    if (timeLeft > 0) {
      return "Catch as many as you can";
    }
    return "Round done. Smash start again";
  }, [timeLeft]);

  const catchTarget = () => {
    if (!playingCatch) {
      return;
    }

    setCatches((current) => current + 1);
    setTarget(nextPos());
    window.dispatchEvent(new Event("tm2016-notify"));
  };

  return (
    <section className="retro-panel p-4">
      <p className="font-pixel text-[10px] text-pink-100">MINI GAMES</p>
      <h3 className="font-chaos mt-1 text-xl text-white">Bottle Flip + Monster Catch</h3>

      <div className="mt-3 rounded-2xl border border-white/25 bg-black/30 p-3">
        <p className="text-xs text-cyan-100">Bottle Flip Challenge</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="bottle-stage">
            <div
              className="bottle"
              style={{ transform: "rotate(" + bottleAngle.toFixed(1) + "deg)", transitionDuration: flipping ? "0.9s" : "0.3s" }}
            />
          </div>
          <div className="text-xs text-pink-100">
            <p>Score: {flipScore}</p>
            <p className="mt-1 text-cyan-100">{flipMessage}</p>
          </div>
        </div>
        <button type="button" className="retro-micro-btn mt-3" onClick={flipBottle}>
          {flipping ? "flipping..." : "Flip Bottle"}
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/25 bg-black/30 p-3">
        <p className="text-xs text-cyan-100">Tap to catch (Pokémon GO style)</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-pink-100">
          <span>Time: {timeLeft}s</span>
          <span>Caught: {catches}</span>
          <span>Misses: {misses}</span>
        </div>

        <div className="catch-zone mt-2">
          <button
            type="button"
            onClick={catchTarget}
            className="catch-target"
            style={{ left: target.x + "%", top: target.y + "%" }}
          >
            ⚪
          </button>
        </div>

        <p className="mt-2 text-[11px] text-cyan-100">{scoreLabel}</p>
        <button type="button" className="retro-micro-btn mt-2" onClick={startCatch}>
          {playingCatch ? "Restart round" : "Start round"}
        </button>
      </div>
    </section>
  );
}
