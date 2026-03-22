"use client";

import type { FormEvent } from "react";

type NostalgiaSearchBarProps = {
  query: string;
  searching: boolean;
  loadingMessage: string;
  activeView: "feed" | "explore";
  onChangeQuery: (value: string) => void;
  onSearch: () => void;
  onSwitchView: (view: "feed" | "explore") => void;
};

export function NostalgiaSearchBar({
  query,
  searching,
  loadingMessage,
  activeView,
  onChangeQuery,
  onSearch,
  onSwitchView,
}: NostalgiaSearchBarProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <section className="retro-panel search2016-wrap relative z-20 mb-4 p-4 sm:p-5">
      <form onSubmit={submit} className="search2016-form">
        <label htmlFor="nostalgia-2016-search" className="font-pixel text-[10px] text-cyan-100">
          NOSTALGIA SEARCH
        </label>
        <div className="search2016-row mt-2">
          <input
            id="nostalgia-2016-search"
            value={query}
            onChange={(event) => {
              onChangeQuery(event.target.value);
              window.dispatchEvent(new Event("tm2016-type"));
            }}
            placeholder="Search like it's 2016..."
            className={`search2016-input ${searching ? "search2016-input-loading" : ""}`}
          />
          <button type="submit" className="search2016-button" disabled={searching}>
            Explore 2016 Web
          </button>
        </div>
      </form>

      <div className="search2016-meta mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSwitchView("feed")}
            className={`retro-micro-btn ${activeView === "feed" ? "search2016-tab-active" : ""}`}
          >
            Feed
          </button>
          <button
            type="button"
            onClick={() => onSwitchView("explore")}
            className={`retro-micro-btn ${activeView === "explore" ? "search2016-tab-active" : ""}`}
          >
            Explore 2016 Web
          </button>
        </div>

        {searching ? (
          <p className="font-pixel text-xs text-cyan-100" role="status" aria-live="polite">
            {loadingMessage}
          </p>
        ) : (
          <p className="text-xs text-pink-100/90">Old-web mode: mixed results, messy layout, zero algorithm calm.</p>
        )}
      </div>
    </section>
  );
}
