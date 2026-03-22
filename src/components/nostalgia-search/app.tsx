"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { PlaylistSidebar } from "./playlist-sidebar";
import { ResultsList } from "./results-list";
import { SearchBar } from "./search-bar";
import type { InjectedResult, NostalgiaResult, RealResult, SearchApiPayload } from "./types";

const LOADING_STEPS = ["Connecting to 2016 internet...", "Searching archived web...", "Indexing old pages..."] as const;
const QUICK_PROMPTS = [
  "youtube",
  "instagram 2016",
  "tumblr aesthetic quotes",
  "roblox 2016",
  "best songs 2016",
  "school memes 2016",
] as const;

type SearchFilter = "all" | "videos" | "social" | "forums" | "articles";
type ViewMode = "home" | "results";

function buildInjected(query: string): InjectedResult[] {
  const focus = query.trim() || "internet";
  return [
    {
      id: `inj-video-${focus}`,
      kind: "youtube",
      title: `BEST ${focus.toUpperCase()} MOMENTS 2016`,
      url: "https://www.youtube.com/results?search_query=best+2016+moments",
      displayUrl: "youtube.com/results",
      snippet: `Low-res throwback clips and chaotic comments around ${focus}.`,
    },
    {
      id: `inj-tumblr-${focus}`,
      kind: "tumblr",
      title: "tumblr mood archive",
      url: "https://www.tumblr.com/search/2016",
      displayUrl: "tumblr.com/search/2016",
      snippet: `i miss when ${focus} felt small, weird, and human online.`,
    },
    {
      id: `inj-buzz-${focus}`,
      kind: "buzzfeed",
      title: `21 things only 2016 ${focus} fans remember`,
      url: "https://www.buzzfeed.com/tag/nostalgia",
      displayUrl: "buzzfeed.com/tag/nostalgia",
      snippet: "This list will absolutely unlock an old memory you forgot.",
    },
  ];
}

function mixResults(real: RealResult[], injected: InjectedResult[]) {
  const slicedReal = real.slice(0, 12);
  const output: NostalgiaResult[] = [];
  const insertMap = new Map<number, InjectedResult>();
  insertMap.set(1, injected[0]);
  insertMap.set(4, injected[1]);
  insertMap.set(8, injected[2]);

  for (let i = 0; i < slicedReal.length; i += 1) {
    const maybe = insertMap.get(i);
    if (maybe) {
      output.push(maybe);
    }
    output.push(slicedReal[i]);
  }

  return output;
}

function matchesFilter(item: NostalgiaResult, filter: SearchFilter) {
  if (filter === "all") {
    return true;
  }

  const value = `${item.title} ${item.url} ${item.displayUrl} ${item.snippet}`.toLowerCase();
  if (filter === "videos") {
    return value.includes("youtube") || value.includes("video") || value.includes("watch");
  }
  if (filter === "social") {
    return value.includes("instagram") || value.includes("tumblr") || value.includes("snapchat") || value.includes("social");
  }
  if (filter === "forums") {
    return value.includes("forum") || value.includes("reddit") || value.includes("answers") || value.includes("thread");
  }
  return value.includes("buzzfeed") || value.includes("article") || value.includes("blog") || value.includes("news");
}

export function NostalgiaSearchApp() {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_STEPS[0]);
  const [results, setResults] = useState<NostalgiaResult[]>([]);
  const [provider, setProvider] = useState<"serpstack" | "tavily" | "bing" | "youtube" | "fallback" | "none">("none");
  const [warning, setWarning] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");
  const [savedItems, setSavedItems] = useState<RealResult[]>([]);

  const loadingIntervalRef = useRef<number | null>(null);

  const filteredResults = useMemo(
    () => results.filter((item) => matchesFilter(item, activeFilter)),
    [activeFilter, results],
  );
  const hasResults = filteredResults.length > 0;
  const savedIdSet = useMemo(() => new Set(savedItems.map((item) => item.id)), [savedItems]);

  const providerLabel =
    provider === "serpstack"
      ? "Live web results (Serpstack)"
      : provider === "tavily"
        ? "Live web results (Tavily)"
        : provider === "bing"
          ? "Live web results (Bing)"
          : provider === "youtube"
            ? "YouTube fallback mode"
            : provider === "fallback"
              ? "Fallback mode (add SERPSTACK_API_KEY)"
              : "Ready to search 2016 web archives";

  const runSearch = async (overrideQuery?: string) => {
    const trimmed = (overrideQuery ?? query).trim();
    if (!trimmed || loading) {
      return;
    }

    if (overrideQuery) {
      setQuery(trimmed);
    }

    setSubmittedQuery(trimmed);
    setLoading(true);
    setWarning("");
    setActiveFilter("all");
    setLoadingMessage(LOADING_STEPS[0]);
    setViewMode("results");

    let step = 0;
    if (loadingIntervalRef.current !== null) {
      window.clearInterval(loadingIntervalRef.current);
    }
    loadingIntervalRef.current = window.setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length;
      setLoadingMessage(LOADING_STEPS[step]);
    }, 650);

    const minDelay = 900 + Math.floor(Math.random() * 600);
    const startedAt = Date.now();

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const payload = (await response.json()) as SearchApiPayload;

      const elapsed = Date.now() - startedAt;
      if (elapsed < minDelay) {
        await new Promise((resolve) => window.setTimeout(resolve, minDelay - elapsed));
      }

      const injected = buildInjected(trimmed);
      setResults(mixResults(payload.results, injected));
      setProvider(payload.provider);
      setWarning(payload.warning ?? "");
    } catch {
      const injected = buildInjected(trimmed);
      setResults(mixResults([], injected));
      setProvider("fallback");
      setWarning("Could not reach search servers. Showing nostalgia fallback results.");
    } finally {
      if (loadingIntervalRef.current !== null) {
        window.clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
      setLoadingMessage(LOADING_STEPS[0]);
      setLoading(false);
    }
  };

  const runLucky = () => {
    const luckyQuery = QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)];
    void runSearch(luckyQuery);
  };

  const toggleSave = (item: RealResult) => {
    setSavedItems((previous) => {
      if (previous.some((entry) => entry.id === item.id)) {
        return previous.filter((entry) => entry.id !== item.id);
      }
      return [item, ...previous].slice(0, 10);
    });
  };

  return (
    <main className="ns16-shell ns16-shell-clean">
      <div className="ns16-noise" />

      <div className="ns16-app-grid">
        <section className="ns16-main-panel">
          {viewMode === "home" ? (
            <div className="ns16-home">
              <div className="ns16-home-logo-wrap">
                <Image src="/nostalgia-mark.svg" alt="Nostalgia logo" width={66} height={66} priority />
                <h1>NOSTALGIA</h1>
              </div>
              <p>Search like it&apos;s 2016</p>
              <SearchBar value={query} searching={loading} onChange={setQuery} onSubmit={() => void runSearch()} onLucky={runLucky} />

              <div className="ns16-home-pills">
                {QUICK_PROMPTS.map((prompt) => (
                  <button key={prompt} type="button" onClick={() => void runSearch(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="ns16-results-view">
              <header className="ns16-toolbar">
                <div className="ns16-brand">
                  <button type="button" className="ns16-back-button" onClick={() => setViewMode("home")}>
                    ← Back
                  </button>
                  <div className="ns16-brand-mark">
                    <Image src="/nostalgia-mark.svg" alt="Nostalgia logo" width={37} height={37} priority />
                  </div>
                  <div>
                    <h1>NOSTALGIA</h1>
                    <p>Search like it&apos;s 2016.</p>
                  </div>
                </div>
                <SearchBar
                  value={query}
                  searching={loading}
                  onChange={setQuery}
                  onSubmit={() => void runSearch()}
                  onLucky={runLucky}
                  compact
                />
              </header>

              <section className="ns16-results-wrap ns16-results-wrap-clean">
                <div className="ns16-results-meta">
                  {loading ? (
                    <p className="ns16-status">{loadingMessage}</p>
                  ) : hasResults ? (
                    <p>
                      Showing {filteredResults.length} result(s) for &quot;{submittedQuery}&quot;
                    </p>
                  ) : (
                    <p>Search anything to start browsing.</p>
                  )}
                  {!loading ? <p>{providerLabel}</p> : null}
                  {warning && !loading ? <p className="ns16-warning">{warning}</p> : null}
                </div>

                <div className="ns16-filter-row" role="tablist" aria-label="Result filters">
                  {(["all", "videos", "social", "forums", "articles"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={activeFilter === filter ? "is-active" : ""}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {savedItems.length > 0 ? (
                  <div className="ns16-saved-strip">
                    <p>Saved throwbacks ({savedItems.length})</p>
                    <div>
                      {savedItems.slice(0, 4).map((item) => (
                        <a key={item.id} href={item.url} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                {loading ? (
                  <div className="ns16-loading-inline">
                    <div className="ns16-loading-bar-wrap">
                      <div className="ns16-loading-bar" />
                    </div>
                  </div>
                ) : null}

                {!loading && hasResults ? (
                  <ResultsList items={filteredResults} savedIds={savedIdSet} onToggleSave={toggleSave} />
                ) : null}

                {!loading && !hasResults ? (
                  <section className="ns16-empty">
                    <h2>Nostalgia Search Engine</h2>
                    <p>Type a query and press Search.</p>
                    <p>Try: youtube, school memes, old tumblr, roblox 2016</p>
                  </section>
                ) : null}
              </section>
            </div>
          )}
        </section>

        <PlaylistSidebar />
      </div>
    </main>
  );
}
