"use client";

import { useEffect, useMemo, useState } from "react";
import { chaosMessages } from "./data";
import type { ChaosPopup, MemoryInput } from "./types";

type PopupSystemProps = {
  memory: MemoryInput;
  enabled: boolean;
};

const POSITIONS: ChaosPopup["position"][] = ["top-left", "top-right", "bottom-left", "bottom-right"];

export function PopupSystem({ memory, enabled }: PopupSystemProps) {
  const [items, setItems] = useState<ChaosPopup[]>([]);
  const messages = useMemo(() => chaosMessages(memory), [memory]);

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

      setItems((current) => [...current.slice(-4), popup]);
      window.dispatchEvent(new Event("tmx-notify"));

      window.setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== popup.id));
      }, 4200 + Math.random() * 1800);
    };

    const first = window.setTimeout(spawn, 2100);
    const interval = window.setInterval(spawn, 5000 + Math.random() * 3500);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [enabled, messages]);

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
