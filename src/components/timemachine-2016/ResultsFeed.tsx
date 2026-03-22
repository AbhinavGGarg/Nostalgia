"use client";

import { useMemo, useState } from "react";
import type { NostalgiaResult } from "./types";

type ResultsFeedProps = {
  results: NostalgiaResult[];
  searching: boolean;
  onOpenResult: (result: NostalgiaResult) => void;
};

function badgeFor(type: NostalgiaResult["type"]) {
  if (type === "video") {
    return "YouTube-style";
  }
  if (type === "tumblr") {
    return "Tumblr text post";
  }
  if (type === "buzzfeed") {
    return "Buzz listicle";
  }
  if (type === "meme") {
    return "Meme card";
  }
  return "Forum thread";
}

export function ResultsFeed({ results, searching, onOpenResult }: ResultsFeedProps) {
  const [flipping, setFlipping] = useState(false);
  const [bottleRotation, setBottleRotation] = useState(0);
  const [flipScore, setFlipScore] = useState(0);
  const [filter, setFilter] = useState<"all" | NostalgiaResult["type"]>("all");

  const message = useMemo(() => {
    if (searching) {
      return "Connecting to 2016 servers...";
    }
    return `${results.length} weird results from the old internet`;
  }, [results.length, searching]);

  const visibleResults = useMemo(() => {
    if (filter === "all") {
      return results;
    }
    return results.filter((result) => result.type === filter);
  }, [filter, results]);

  const flipBottle = () => {
    if (flipping) {
      return;
    }

    setFlipping(true);
    const spins = 2 + Math.floor(Math.random() * 4);
    setBottleRotation(spins * 360 + Math.random() * 200);

    window.setTimeout(() => {
      const landed = Math.random() > 0.45;
      setBottleRotation(landed ? 0 : 95 + Math.random() * 20);
      if (landed) {
        setFlipScore((current) => current + 1);
      }
      setFlipping(false);
      window.dispatchEvent(new Event("tmx-notify"));
    }, 800);
  };

  return (
    <section className="tmx-results-wrap">
      <header className="tmx-results-header">
        <h2>Mixed 2016 Results Feed</h2>
        <p>{message}</p>
        <div className="tmx-filter-row" role="toolbar" aria-label="Filter result types">
          {(["all", "video", "tumblr", "buzzfeed", "meme", "forum"] as const).map((entry) => (
            <button
              key={entry}
              type="button"
              className={`tmx-filter-pill ${filter === entry ? "tmx-filter-pill-active" : ""}`}
              onClick={() => setFilter(entry)}
            >
              {entry}
            </button>
          ))}
        </div>
      </header>

      <div className="tmx-results-grid">
        {visibleResults.map((result, index) => (
          <article
            key={result.id}
            className={`tmx-result-card tmx-type-${result.type}`}
            style={{ transform: `rotate(${(index % 4 - 1.5) * 0.5}deg)` }}
          >
            <p className="tmx-result-badge">{badgeFor(result.type)}</p>
            <h3>{result.title}</h3>
            <p className="tmx-result-subtitle">{result.subtitle}</p>
            <p className="tmx-result-snippet">{result.snippet}</p>
            <div className="tmx-tag-row">
              {result.tags.map((tag) => (
                <span key={`${result.id}-${tag}`}>#{tag}</span>
              ))}
            </div>
            <button
              type="button"
              className="tmx-open-button"
              onClick={() => {
                window.dispatchEvent(new Event("tmx-notify"));
                window.setTimeout(() => onOpenResult(result), 210);
              }}
            >
              Open This Page
            </button>
          </article>
        ))}
      </div>

      {!searching && visibleResults.length === 0 ? (
        <p className="tmx-empty-state">No results in this filter yet. Try another filter or run a new search.</p>
      ) : null}

      <aside className="tmx-game-box">
        <h3>Bottle Flip Break</h3>
        <p>Quick break while pages load like 2016.</p>
        <div className="tmx-bottle-stage">
          <div className="tmx-bottle" style={{ transform: `rotate(${bottleRotation}deg)` }} />
        </div>
        <p>Score: {flipScore}</p>
        <button type="button" onClick={flipBottle} className="tmx-open-button">
          {flipping ? "flipping..." : "Flip"}
        </button>
      </aside>
    </section>
  );
}
