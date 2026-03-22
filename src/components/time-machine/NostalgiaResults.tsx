"use client";

import { useState } from "react";
import { InteractionModal, type InteractionModalItem } from "./InteractionModal";
import type { NostalgiaSearchResult } from "./nostalgia-search-data";
import { ResultCardBuzzfeed } from "./ResultCardBuzzfeed";
import { ResultCardForum } from "./ResultCardForum";
import { ResultCardMeme } from "./ResultCardMeme";
import { ResultCardTumblr } from "./ResultCardTumblr";
import { ResultCardVideo } from "./ResultCardVideo";

type NostalgiaResultsProps = {
  query: string;
  results: NostalgiaSearchResult[];
  searching: boolean;
  searchStarted: boolean;
  flicker: boolean;
};

function renderCard(result: NostalgiaSearchResult) {
  if (result.kind === "video") {
    return <ResultCardVideo result={result} />;
  }

  if (result.kind === "tumblr") {
    return <ResultCardTumblr result={result} />;
  }

  if (result.kind === "buzzfeed") {
    return <ResultCardBuzzfeed result={result} />;
  }

  if (result.kind === "meme") {
    return <ResultCardMeme result={result} />;
  }

  return <ResultCardForum result={result} />;
}

export function NostalgiaResults({ query, results, searching, searchStarted, flicker }: NostalgiaResultsProps) {
  const [activeResult, setActiveResult] = useState<InteractionModalItem | null>(null);

  const openResult = (result: NostalgiaSearchResult) => {
    if (result.kind === "video") {
      setActiveResult({
        id: result.id,
        title: result.title,
        subtitle: `${result.channel} • ${result.views}`,
        body: `Throwback video result for "${query}". Clicks, comments, and replay loops were the whole vibe.`,
        imageUrl: result.imageUrl,
        source: "search",
      });
      return;
    }

    if (result.kind === "tumblr") {
      setActiveResult({
        id: result.id,
        title: "Tumblr Thought",
        subtitle: `@${result.blog} • ${result.notes}`,
        body: result.quote,
        source: "search",
      });
      return;
    }

    if (result.kind === "buzzfeed") {
      setActiveResult({
        id: result.id,
        title: result.headline,
        subtitle: "Buzz article • listicle mode",
        body: result.bullets.join(" • "),
        source: "search",
      });
      return;
    }

    if (result.kind === "meme") {
      setActiveResult({
        id: result.id,
        title: result.topText,
        subtitle: "Meme result • low quality peak humor",
        body: result.caption,
        imageUrl: result.imageUrl,
        source: "search",
      });
      return;
    }

    setActiveResult({
      id: result.id,
      title: result.question,
      subtitle: `${result.asker} • ${result.replies}`,
      body: result.bestAnswer,
      source: "search",
    });
  };

  return (
    <section className={`retro-panel flex h-full min-h-[650px] flex-col p-4 sm:p-5 xl:min-h-0 ${flicker ? "vhs-flicker" : ""}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h2 className="font-chaos text-2xl text-white">Nostalgia Search Results</h2>
          <p className="text-xs text-cyan-100">query: {query || "(nothing yet)"}</p>
        </div>
        <span className="font-pixel rounded-full bg-black/30 px-3 py-1 text-[10px] text-cyan-100">mixed 2016 web</span>
      </div>

      <div className="search2016-results-scroll">
        {searching ? (
          <div className="search2016-loading-wrap">
            <p className="font-pixel text-sm text-cyan-100">Searching archived internet fragments...</p>
            <p className="text-xs text-pink-100/90">Loading blurry thumbnails, old forums, and chaotic takes.</p>
          </div>
        ) : null}

        {!searching && !searchStarted ? (
          <div className="search2016-empty-state">
            <p className="font-chaos text-2xl text-white">Type a memory and hit Explore.</p>
            <p className="text-sm text-cyan-100">
              Try: music, school, youtube, summer, homework, minecraft, roblox
            </p>
          </div>
        ) : null}

        {!searching && searchStarted && results.length === 0 ? (
          <div className="search2016-empty-state">
            <p className="font-chaos text-2xl text-white">No clean results found.</p>
            <p className="text-sm text-cyan-100">The 2016 internet was messy. Try a different word.</p>
          </div>
        ) : null}

        {!searching && results.length > 0 ? (
          <div className="search2016-results">
            {results.map((result, index) => (
              <div
                key={result.id}
                className="search2016-result-shell"
                style={{
                  transform: `translateY(${result.offsetY}px) rotate(${result.tilt}deg)`,
                  marginLeft: `${(index % 3) * 2}px`,
                  marginRight: `${(index % 2) * 4}px`,
                }}
              >
                <button type="button" className="search2016-result-hit" onClick={() => openResult(result)}>
                  {renderCard(result)}
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <InteractionModal key={activeResult?.id ?? "none"} item={activeResult} onClose={() => setActiveResult(null)} />
    </section>
  );
}
