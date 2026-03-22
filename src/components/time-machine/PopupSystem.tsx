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

    const spawn = () => {
      const text = messages[Math.floor(Math.random() * messages.length)];
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const popup: Popup = {
        id: Date.now() + serial,
        text,
        source,
      };
      serial += 1;

      setPopups((current) => [popup, ...current].slice(0, 4));
      window.dispatchEvent(new Event("tm2016-notify"));

      window.setTimeout(() => {
        setPopups((current) => current.filter((entry) => entry.id !== popup.id));
      }, 3200 + Math.random() * 2400);
    };

    const first = window.setTimeout(spawn, 2200);

    const interval = window.setInterval(
      spawn,
      4500 + Math.floor(Math.random() * 4800),
    );

    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [enabled, messages]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-40 flex w-[min(92vw,330px)] flex-col gap-2 sm:right-6 sm:top-6">
      {popups.map((popup) => (
        <aside key={popup.id} className="popup-card pointer-events-auto">
          <p className="font-pixel text-[10px] uppercase text-cyan-100">{popup.source} alert</p>
          <p className="mt-1 text-sm text-white">{popup.text}</p>
        </aside>
      ))}
    </div>
  );
}
