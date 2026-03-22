"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export type InteractionModalItem = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
  source: "post" | "search";
};

type InteractionModalProps = {
  item: InteractionModalItem | null;
  onClose: () => void;
};

function seedScore(id: string, base: number, range: number) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  }
  return base + (hash % range);
}

export function InteractionModal({ item, onClose }: InteractionModalProps) {
  const [liked, setLiked] = useState(false);
  const [reblogged, setReblogged] = useState(false);
  const [typed, setTyped] = useState("");
  const [posted, setPosted] = useState(false);

  const baseLikes = useMemo(() => (item ? seedScore(item.id, 80, 4200) : 0), [item]);
  const baseShares = useMemo(() => (item ? seedScore(`${item.id}-share`, 12, 700) : 0), [item]);

  if (!item) {
    return null;
  }

  const postReply = () => {
    if (!typed.trim()) {
      return;
    }

    window.setTimeout(() => {
      setPosted(true);
      setTyped("");
      window.dispatchEvent(new Event("tm2016-notify"));
    }, 280);
  };

  const toggleLike = () => {
    window.setTimeout(() => {
      setLiked((value) => !value);
      window.dispatchEvent(new Event("tm2016-notify"));
    }, 160);
  };

  const toggleReblog = () => {
    window.setTimeout(() => {
      setReblogged((value) => !value);
      window.dispatchEvent(new Event("tm2016-notify"));
    }, 180);
  };

  return (
    <div className="interaction-overlay" role="dialog" aria-modal="true" aria-label="Post interaction modal" onClick={onClose}>
      <div className="interaction-modal" onClick={(event) => event.stopPropagation()}>
        <div className="interaction-head">
          <div>
            <p className="font-pixel text-[10px] text-cyan-100">{item.source === "search" ? "RESULT PREVIEW" : "POST PREVIEW"}</p>
            <h3 className="font-chaos text-2xl text-white">{item.title}</h3>
            <p className="text-xs text-pink-100">{item.subtitle}</p>
          </div>
          <button type="button" className="retro-micro-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {item.imageUrl ? (
          <div className="interaction-image-wrap">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
              style={{ filter: "contrast(1.14) saturate(1.2) blur(0.2px)" }}
            />
          </div>
        ) : null}

        <p className="interaction-body">{item.body}</p>

        <div className="interaction-actions">
          <button type="button" className="retro-micro-btn" onClick={toggleLike}>
            {liked ? "Liked <3" : "Like"}
          </button>
          <button type="button" className="retro-micro-btn" onClick={toggleReblog}>
            {reblogged ? "Reblogged" : "Reblog"}
          </button>
          <span className="text-xs text-cyan-100">{baseLikes + (liked ? 1 : 0)} likes</span>
          <span className="text-xs text-pink-100">{baseShares + (reblogged ? 1 : 0)} shares</span>
        </div>

        <div className="interaction-reply">
          <input
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value);
              setPosted(false);
              window.dispatchEvent(new Event("tm2016-type"));
            }}
            className="retro-input"
            placeholder="drop a comment like it's 2016..."
          />
          <button type="button" className="retro-micro-btn" onClick={postReply}>
            Post Reply
          </button>
        </div>

        {posted ? <p className="text-xs text-cyan-100">reply posted to the timeline</p> : null}
      </div>
    </div>
  );
}
