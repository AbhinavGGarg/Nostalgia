"use client";

import { useEffect, useMemo, useState } from "react";
import { chaosMessages } from "./data";
import type { ChaosPopup, MemoryInput } from "./types";

type PopupSystemProps = {
  memory: MemoryInput;
  enabled: boolean;
  intensity: "low" | "medium" | "high";
};

const POSITIONS: ChaosPopup["position"][] = ["top-left", "top-right", "bottom-left", "bottom-right"];

function configFor(intensity: "low" | "medium" | "high") {
  if (intensity === "low") {
    return { minDelay: 6800, randomDelay: 2800, maxVisible: 3 };
  }
  if (intensity === "high") {
    return { minDelay: 2800, randomDelay: 1400, maxVisible: 6 };
  }
  return { minDelay: 4700, randomDelay: 2200, maxVisible: 5 };
}

export function PopupSystem({ memory, enabled, intensity }: PopupSystemProps) {
  const [items, setItems] = useState<ChaosPopup[]>([]);
  const messages = useMemo(() => chaosMessages(memory), [memory]);
  const config = useMemo(() => configFor(intensity), [intensity]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let serial = 0;

    const spawn = () => {
      const popup: ChaosPopup = {
        id: Date.now() + serial,
        text: messages[Math.floor(Math.random() * messages.length)],
        position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
      };
      serial += 1;

      setItems((current) => [...current.slice(-(config.maxVisible - 1)), popup]);
      window.dispatchEvent(new Event("tmx-notify"));

      window.setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== popup.id));
      }, 4200 + Math.random() * 1800);
    };

    const first = window.setTimeout(spawn, 2100);
    const interval = window.setInterval(spawn, config.minDelay + Math.random() * config.randomDelay);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [config.maxVisible, config.minDelay, config.randomDelay, enabled, messages]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      {items.map((item) => (
        <aside key={item.id} className={`tmx-popup tmx-${item.position}`}>
          {item.text}
        </aside>
      ))}
    </>
  );
}
