"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type MusicPlayerProps = {
  autoStart?: boolean;
};

type CleanupBag = {
  sequenceTimers: number[];
  noiseSource?: AudioBufferSourceNode;
};

const PROGRESSION = [
  [261.63, 329.63, 392.0],
  [293.66, 369.99, 440.0],
  [220.0, 277.18, 349.23],
  [246.94, 311.13, 392.0],
];
const ACTIVE_MASTER_GAIN = 0.28;

export function MusicPlayer({ autoStart = true }: MusicPlayerProps) {
  const [enabled, setEnabled] = useState(autoStart);

  const contextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const cleanupRef = useRef<CleanupBag>({ sequenceTimers: [] });

  const playTone = useCallback(
    (frequency: number, length: number, type: OscillatorType, volume: number) => {
      const context = contextRef.current;
      const masterGain = masterGainRef.current;
      if (!context || !masterGain) {
        return;
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.0001, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + length);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      oscillator.start();
      oscillator.stop(context.currentTime + length + 0.04);
    },
    [],
  );

  const bootAudio = useCallback(async () => {
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
      const masterGain = context.createGain();
      masterGain.gain.value = ACTIVE_MASTER_GAIN;
      masterGain.connect(context.destination);

      contextRef.current = context;
      masterGainRef.current = masterGain;

      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < channel.length; i += 1) {
        channel[i] = (Math.random() * 2 - 1) * 0.06;
      }

      const noise = context.createBufferSource();
      const noiseGain = context.createGain();
      noise.buffer = buffer;
      noise.loop = true;
      noiseGain.gain.value = 0.02;
      noise.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start();

      cleanupRef.current.noiseSource = noise;

      let chordIndex = 0;
      const chordTimer = window.setInterval(() => {
        const chord = PROGRESSION[chordIndex % PROGRESSION.length];
        chord.forEach((note, position) => {
          window.setTimeout(() => {
            playTone(note, 0.36, "sine", position === 0 ? 0.06 : 0.045);
          }, position * 28);
        });
        chordIndex += 1;
      }, 1060);

      const bassTimer = window.setInterval(() => {
        const bass = PROGRESSION[(chordIndex + 1) % PROGRESSION.length][0] / 2;
        playTone(bass, 0.21, "triangle", 0.052);
      }, 540);

      cleanupRef.current.sequenceTimers = [chordTimer, bassTimer];
    }

    if (contextRef.current.state === "suspended") {
      await contextRef.current.resume();
    }

  }, [playTone]);

  useEffect(() => {
    if (enabled) {
      void bootAudio();
    }

    const master = masterGainRef.current;
    if (master && contextRef.current) {
      master.gain.cancelScheduledValues(contextRef.current.currentTime);
      master.gain.linearRampToValueAtTime(enabled ? ACTIVE_MASTER_GAIN : 0.0001, contextRef.current.currentTime + 0.15);
    }
  }, [bootAudio, enabled]);

  useEffect(() => {
    const onNotify = () => playTone(860, 0.08, "square", 0.045);
    const onType = () => playTone(420 + Math.random() * 80, 0.05, "square", 0.024);
    const onGlitch = () => {
      playTone(220, 0.23, "sawtooth", 0.075);
      window.setTimeout(() => playTone(132, 0.2, "triangle", 0.058), 80);
    };

    window.addEventListener("tm2016-notify", onNotify);
    window.addEventListener("tm2016-type", onType);
    window.addEventListener("tm2016-glitch", onGlitch);

    return () => {
      window.removeEventListener("tm2016-notify", onNotify);
      window.removeEventListener("tm2016-type", onType);
      window.removeEventListener("tm2016-glitch", onGlitch);
    };
  }, [playTone]);

  useEffect(() => {
    const cleanupBag = cleanupRef.current;
    return () => {
      cleanupBag.sequenceTimers.forEach((timer) => window.clearInterval(timer));
      cleanupBag.sequenceTimers = [];

      if (cleanupBag.noiseSource) {
        cleanupBag.noiseSource.stop();
        cleanupBag.noiseSource.disconnect();
      }

      if (contextRef.current) {
        void contextRef.current.close();
      }
    };
  }, []);

  return (
    <section className="retro-panel p-4">
      <p className="font-pixel text-[10px] text-pink-100">BACKGROUND IMMERSION SYSTEM</p>
      <h3 className="font-chaos mt-1 text-xl text-white">2016 Mixtape Engine</h3>
      <p className="mt-1 text-xs text-cyan-50/85">Closer / One Dance inspired synth loop + notifications + keyboard taps.</p>

      <div className="mt-4 flex items-center gap-2">
        <button type="button" className="retro-micro-btn" onClick={() => setEnabled((value) => !value)}>
          {enabled ? "Sound ON" : "Sound OFF"}
        </button>
        <button type="button" className="retro-micro-btn" onClick={() => void bootAudio()}>
          Enable Audio
        </button>
      </div>
    </section>
  );
}
