"use client";

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
  return (
    <section className={`retro-panel flex h-full min-h-[650px] flex-col p-4 sm:p-5 ${flicker ? "vhs-flicker" : ""}`}>
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
                {renderCard(result)}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
