"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SoundControllerProps = {
  autoStart?: boolean;
};

const MAIN_GAIN = 0.22;

export function SoundController({ autoStart = false }: SoundControllerProps) {
  const [enabled, setEnabled] = useState(autoStart);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const timersRef = useRef<number[]>([]);

  const tone = useCallback((freq: number, duration: number, volume: number, type: OscillatorType) => {
    const context = contextRef.current;
    const master = gainRef.current;
    if (!context || !master) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + 0.03);
  }, []);

  const init = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    if (!contextRef.current) {
      const AudioContextCtor =
        window.AudioContext ??
        (window as Window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (!AudioContextCtor) {
        return;
      }

      const context = new AudioContextCtor();
      const master = context.createGain();
      master.gain.value = MAIN_GAIN;
      master.connect(context.destination);

      contextRef.current = context;
      gainRef.current = master;

      const loopA = window.setInterval(() => tone(261.6, 0.34, 0.06, "sine"), 1000);
      const loopB = window.setInterval(() => tone(392, 0.24, 0.045, "triangle"), 680);
      const loopC = window.setInterval(() => tone(196, 0.2, 0.05, "square"), 1450);
      timersRef.current = [loopA, loopB, loopC];
    }

    if (contextRef.current.state === "suspended") {
      await contextRef.current.resume();
    }
  }, [tone]);

  useEffect(() => {
    if (enabled) {
      void init();
    }

    const master = gainRef.current;
    const context = contextRef.current;
    if (master && context) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.linearRampToValueAtTime(enabled ? MAIN_GAIN : 0.0001, context.currentTime + 0.12);
    }
  }, [enabled, init]);

  useEffect(() => {
    const onType = () => tone(440 + Math.random() * 50, 0.05, 0.028, "square");
    const onNotify = () => tone(880, 0.09, 0.05, "square");
    const onRewind = () => {
      tone(330, 0.23, 0.09, "sawtooth");
      window.setTimeout(() => tone(190, 0.3, 0.09, "triangle"), 80);
    };

    window.addEventListener("tmx-type", onType);
    window.addEventListener("tmx-notify", onNotify);
    window.addEventListener("tmx-rewind", onRewind);

    return () => {
      window.removeEventListener("tmx-type", onType);
      window.removeEventListener("tmx-notify", onNotify);
      window.removeEventListener("tmx-rewind", onRewind);
    };
  }, [tone]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearInterval(timer));
      if (contextRef.current) {
        void contextRef.current.close();
      }
    };
  }, []);

  return (
    <section className="tmx-sound-card">
      <p>Background immersion</p>
      <div>
        <button type="button" className="tmx-open-button" onClick={() => setEnabled((value) => !value)}>
          {enabled ? "Sound ON" : "Sound OFF"}
        </button>
        <button type="button" className="tmx-open-button" onClick={() => void init()}>
          Enable audio
        </button>
      </div>
    </section>
  );
}
