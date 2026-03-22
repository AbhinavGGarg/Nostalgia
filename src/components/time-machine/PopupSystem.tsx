"use client";

import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "./types";

type PopupSystemProps = {
  profile: UserProfile;
  enabled: boolean;
};

type Popup = {
  id: number;
  text: string;
  source: string;
};

const SOURCES = ["Instagram", "Vine", "Tumblr", "Snapchat", "Twitter"];

function createMessages(profile: UserProfile) {
  const term = profile.favoriteContent.split(",")[0]?.trim() || "memes";
  return [
    "Your friend tagged you in a photo",
    "This Vine is going viral",
    "Someone just posted 12 selfies in a row",
    "Your crush viewed your story",
    `New ${term} meme format unlocked`,
    "Battery at 5%. Low Power Mode is judging you",
    `${profile.favoriteApps[0] ?? "Instagram"} says: 8 unread notifications`,
    "You were added to a group chat with 47 unread messages",
  ];
}

export function PopupSystem({ profile, enabled }: PopupSystemProps) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const messages = useMemo(() => createMessages(profile), [profile]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let serial = 0;
    let nextSpawnTimer: number | null = null;
    const activeRemovalTimers = new Map<number, number>();

    const dismissPopup = (id: number) => {
      setPopups((current) => current.filter((entry) => entry.id !== id));
      const timer = activeRemovalTimers.get(id);
      if (timer !== undefined) {
        window.clearTimeout(timer);
        activeRemovalTimers.delete(id);
      }
    };

    const scheduleNext = () => {
      const delay = 15000 + Math.floor(Math.random() * 2001);
      nextSpawnTimer = window.setTimeout(() => {
        spawn();
        scheduleNext();
      }, delay);
    };

    const spawn = () => {
      const text = messages[Math.floor(Math.random() * messages.length)];
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const popup: Popup = {
        id: Date.now() + serial,
        text,
        source,
      };
      serial += 1;

      setPopups((current) => [popup, ...current].slice(0, 3));
      window.dispatchEvent(new Event("tm2016-notify"));

      const removalTimer = window.setTimeout(() => {
        dismissPopup(popup.id);
      }, 8200 + Math.random() * 2000);
      activeRemovalTimers.set(popup.id, removalTimer);
    };

    const first = window.setTimeout(() => {
      spawn();
      scheduleNext();
    }, 7600);

    return () => {
      window.clearTimeout(first);
      if (nextSpawnTimer !== null) {
        window.clearTimeout(nextSpawnTimer);
      }
      activeRemovalTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [enabled, messages]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-40 flex w-[min(92vw,330px)] flex-col gap-2 sm:right-6 sm:top-6">
      {popups.map((popup) => (
        <aside key={popup.id} className="popup-card pointer-events-auto">
          <button
            type="button"
            className="popup-close"
            onClick={() => setPopups((current) => current.filter((entry) => entry.id !== popup.id))}
            aria-label="Close popup"
          >
            x
          </button>
          <p className="font-pixel text-[10px] uppercase text-cyan-100">{popup.source} alert</p>
          <p className="mt-1 text-sm text-white">{popup.text}</p>
        </aside>
      ))}
    </div>
  );
}
