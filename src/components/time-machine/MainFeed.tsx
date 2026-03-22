"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { createPersonalizedFeed } from "./feed-data";
import type { FeedItem, UserProfile } from "./types";

type MainFeedProps = {
  profile: UserProfile;
};

type LagMap = Record<string, boolean>;

function platformLabel(item: FeedItem) {
  if (item.platform === "instagram") {
    return "Instagram";
  }
  if (item.platform === "tumblr") {
    return "Tumblr";
  }
  return "Twitter";
}

export function MainFeed({ profile }: MainFeedProps) {
  const feed = useMemo(() => createPersonalizedFeed(profile), [profile]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [lagging, setLagging] = useState<LagMap>({});

  const queueLike = (id: string) => {
    if (lagging[id]) {
      return;
    }

    setLagging((current) => ({ ...current, [id]: true }));

    const delayMs = 540;

    window.setTimeout(() => {
      setLiked((current) => ({ ...current, [id]: !current[id] }));
      setLagging((current) => ({ ...current, [id]: false }));
      window.dispatchEvent(new Event("tm2016-notify"));
    }, delayMs);
  };

  return (
    <section className="retro-panel h-full min-h-[650px] p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-chaos text-2xl text-white">Personalized 2016 Feed</h2>
        <span className="font-pixel rounded-full bg-black/30 px-3 py-1 text-[10px] text-cyan-100">Chronological chaos</span>
      </div>

      <div className="feed-scroll max-h-[70vh] space-y-4 overflow-y-auto pr-2">
        {feed.map((item, index) => (
          <article
            key={item.id}
            className="retro-feed-card"
            style={{ transform: `rotate(${(index % 3 - 1) * 0.65}deg)` }}
          >
            <header className="mb-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-white">{item.handle}</p>
                <p className="text-[10px] uppercase tracking-wide text-cyan-100/90">{platformLabel(item)}</p>
              </div>
              <span className="text-[11px] text-pink-100">{item.timestamp}</span>
            </header>

            {item.imageUrl ? (
              <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl border border-white/20 bg-black/40">
                <Image
                  src={item.imageUrl}
                  alt="Generated memory"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover contrast-125 saturate-125"
                  style={{
                    filter:
                      "blur(0.25px) contrast(1.12) saturate(1.4) brightness(1.08) sepia(0.18) hue-rotate(-8deg)",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,243,117,0.2),transparent_45%),linear-gradient(to_top,rgba(0,0,0,0.22),transparent_45%)]" />
              </div>
            ) : null}

            <p className="text-sm leading-relaxed text-white/92">{item.caption}</p>
            <p className="mt-1 text-xs text-cyan-50/75">mood: {item.mood}</p>

            <footer className="mt-3 flex flex-wrap items-center gap-2 text-xs text-pink-100">
              <button type="button" onClick={() => queueLike(item.id)} className="retro-micro-btn">
                {lagging[item.id] ? "buffering..." : liked[item.id] ? "liked <3" : "like"}
              </button>
              <span>{item.likes ? `${item.likes + (liked[item.id] ? 1 : 0)} likes` : ""}</span>
              <span>{item.notes ? `${item.notes} notes` : ""}</span>
              <span>{item.reposts ? `${item.reposts} retweets` : ""}</span>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
