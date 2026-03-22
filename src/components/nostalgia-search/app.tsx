"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlaylistSidebar } from "./playlist-sidebar";
import { ResultsList } from "./results-list";
import { SearchBar } from "./search-bar";
import type { InjectedResult, NostalgiaResult, RealResult, SearchApiPayload } from "./types";

const LOADING_STEPS = ["Connecting to 2016 internet...", "Searching archived web...", "Indexing old pages..."] as const;
const TRANSITION_STEPS = ["Rewinding timeline...", "Dialing year: 2016...", "Restoring old internet..."] as const;
const QUICK_PROMPTS = [
  "youtube",
  "instagram 2016",
  "tumblr aesthetic quotes",
  "roblox 2016",
  "best songs 2016",
  "school memes 2016",
] as const;
const CHAOS_MESSAGES = [
  "Someone tagged you in a blurry concert photo.",
  "This Vine is trending again.",
  "Tumblr dashboard is chaotic tonight.",
  "2016 quiz unlocked: What pizza are you?",
  "A friend posted 12 selfies in a row.",
] as const;

type SceneMode = "intro" | "transition" | "search";
type SearchFilter = "all" | "videos" | "social" | "forums" | "articles";
type NavTab = "search" | "videos" | "tumblr" | "forums" | "saved";
type ChaosToast = { id: string; message: string };

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

function getYouTubeVideoId(urlString: string) {
  try {
    const url = new URL(urlString);
    if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v");
    }
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "");
    }
    return null;
  } catch {
    return null;
  }
}

export function NostalgiaSearchApp() {
  const [scene, setScene] = useState<SceneMode>("intro");
  const [memoryPrompt, setMemoryPrompt] = useState("");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_STEPS[0]);
  const [transitionMessage, setTransitionMessage] = useState<string>(TRANSITION_STEPS[0]);
  const [results, setResults] = useState<NostalgiaResult[]>([]);
  const [provider, setProvider] = useState<"serpstack" | "tavily" | "bing" | "youtube" | "fallback" | "none">("none");
  const [warning, setWarning] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");
  const [activeTab, setActiveTab] = useState<NavTab>("search");
  const [savedItems, setSavedItems] = useState<RealResult[]>([]);
  const [chaosToasts, setChaosToasts] = useState<ChaosToast[]>([]);
  const [simulatedResult, setSimulatedResult] = useState<RealResult | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  const loadingIntervalRef = useRef<number | null>(null);
  const transitionIntervalRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (scene !== "search") {
      setChaosToasts([]);
      return;
    }

    const interval = window.setInterval(() => {
      const toast: ChaosToast = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        message: CHAOS_MESSAGES[Math.floor(Math.random() * CHAOS_MESSAGES.length)],
      };
      setChaosToasts((previous) => [...previous.slice(-2), toast]);
      window.setTimeout(() => {
        setChaosToasts((previous) => previous.filter((entry) => entry.id !== toast.id));
      }, 8500);
    }, 16000);

    return () => window.clearInterval(interval);
  }, [scene]);

  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current !== null) {
        window.clearInterval(loadingIntervalRef.current);
      }
      if (transitionIntervalRef.current !== null) {
        window.clearInterval(transitionIntervalRef.current);
      }
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const currentFilter = useMemo<SearchFilter>(() => {
    if (activeTab === "videos") {
      return "videos";
    }
    if (activeTab === "tumblr") {
      return "social";
    }
    if (activeTab === "forums") {
      return "forums";
    }
    return activeFilter;
  }, [activeFilter, activeTab]);

  const filteredResults = useMemo(() => {
    if (activeTab === "saved") {
      return savedItems;
    }
    return results.filter((item) => matchesFilter(item, currentFilter));
  }, [activeTab, currentFilter, results, savedItems]);

  const hasResults = filteredResults.length > 0;
  const savedIdSet = useMemo(() => new Set(savedItems.map((item) => item.id)), [savedItems]);
  const trendTerms = useMemo(() => {
    const seed = submittedQuery || memoryPrompt || "2016";
    return [`${seed} meme dump`, `${seed} tumblr posts`, `${seed} youtube playlist`, `${seed} forum threads`];
  }, [memoryPrompt, submittedQuery]);

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
    setActiveTab("search");
    setLoadingMessage(LOADING_STEPS[0]);
    setScene("search");

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

  const dismissToast = (id: string) => {
    setChaosToasts((previous) => previous.filter((entry) => entry.id !== id));
  };

  const beginTimeTravel = (seed?: string) => {
    const starter = (seed ?? memoryPrompt ?? query).trim() || QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)];
    setQuery(starter);
    setTransitionMessage(TRANSITION_STEPS[0]);
    setScene("transition");

    let step = 0;
    if (transitionIntervalRef.current !== null) {
      window.clearInterval(transitionIntervalRef.current);
    }
    transitionIntervalRef.current = window.setInterval(() => {
      step = (step + 1) % TRANSITION_STEPS.length;
      setTransitionMessage(TRANSITION_STEPS[step]);
    }, reducedMotion ? 1200 : 680);

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      if (transitionIntervalRef.current !== null) {
        window.clearInterval(transitionIntervalRef.current);
        transitionIntervalRef.current = null;
      }
      setScene("search");
      void runSearch(starter);
    }, reducedMotion ? 1800 : 2500);
  };

  const simulatedVideoId = simulatedResult ? getYouTubeVideoId(simulatedResult.url) : null;
  const simulatedHost = simulatedResult ? simulatedResult.url.toLowerCase() : "";
  const simulatedIsInstagram = simulatedHost.includes("instagram.com");
  const simulatedIsTumblr = simulatedHost.includes("tumblr.com");

  return (
    <main className={`ns16-shell ns16-shell-clean ${reducedMotion ? "ns16-reduced" : ""}`}>
      <div className="ns16-noise" />

      <div className="ns16-app-grid">
        <section className="ns16-main-panel">
          {scene === "intro" ? (
            <section className="ns16-intro">
              <div className="ns16-intro-hero">
                <Image src="/nostalgia-mark.svg" alt="Nostalgia logo" width={76} height={76} priority />
                <h1>NOSTALGIA</h1>
                <p className="ns16-intro-lead">
                  Modern feeds are optimized and overwhelming. Nostalgia recreates the messy, human internet feeling of 2016.
                </p>
              </div>

              <div className="ns16-intro-panel">
                <p>What did your days feel like?</p>
                <input
                  value={memoryPrompt}
                  onChange={(event) => setMemoryPrompt(event.target.value)}
                  placeholder="after school youtube, gaming, late-night tumblr..."
                />
                <div className="ns16-home-pills">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button key={prompt} type="button" onClick={() => setMemoryPrompt(prompt)}>
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="ns16-intro-actions">
                  <button type="button" onClick={() => beginTimeTravel(memoryPrompt)}>
                    Begin Time Travel
                  </button>
                  <button type="button" onClick={() => beginTimeTravel(QUICK_PROMPTS[Math.floor(Math.random() * QUICK_PROMPTS.length)])}>
                    Try Random Memory
                  </button>
                </div>
              </div>

              <div className="ns16-proof-strip">
                <article>
                  <h3>Live Search</h3>
                  <p>Real results filtered for 2016 vibes.</p>
                </article>
                <article>
                  <h3>Interactive Cards</h3>
                  <p>Watch videos, preview posts, comment in threads.</p>
                </article>
                <article>
                  <h3>Immersive Audio</h3>
                  <p>Persistent 2016 playlist while browsing.</p>
                </article>
              </div>
            </section>
          ) : null}

          {scene === "transition" ? (
            <section className="ns16-transition">
              <div className="ns16-transition-overlay" />
              <div className="ns16-transition-card">
                <p>TIME MACHINE MODE</p>
                <h2>{transitionMessage}</h2>
                <div className="ns16-loading-bar-wrap">
                  <div className="ns16-loading-bar" />
                </div>
              </div>
            </section>
          ) : null}

          {scene === "search" ? (
            <div className="ns16-results-view">
              <header className="ns16-toolbar">
                <div className="ns16-brand">
                  <button type="button" className="ns16-back-button" onClick={() => setScene("intro")}>
                    ← Back
                  </button>
                  <div className="ns16-brand-mark">
                    <Image src="/nostalgia-mark.svg" alt="Nostalgia logo" width={37} height={37} priority />
                  </div>
                  <div>
                    <h1>NOSTALGIA</h1>
                    <p>Search like it&apos;s 2016.</p>
                  </div>
                  <div className="ns16-toolbar-controls">
                    <button type="button" className={reducedMotion ? "is-active" : ""} onClick={() => setReducedMotion((value) => !value)}>
                      Reduced Motion
                    </button>
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

              <section className="ns16-trending">
                <p>Trending in 2016</p>
                <div>
                  {trendTerms.map((trend) => (
                    <button key={trend} type="button" onClick={() => void runSearch(trend)}>
                      {trend}
                    </button>
                  ))}
                </div>
              </section>

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

                <div className="ns16-nav-tabs">
                  <button type="button" className={activeTab === "search" ? "is-active" : ""} onClick={() => setActiveTab("search")}>
                    Search
                  </button>
                  <button type="button" className={activeTab === "videos" ? "is-active" : ""} onClick={() => setActiveTab("videos")}>
                    Videos
                  </button>
                  <button type="button" className={activeTab === "tumblr" ? "is-active" : ""} onClick={() => setActiveTab("tumblr")}>
                    Tumblr
                  </button>
                  <button type="button" className={activeTab === "forums" ? "is-active" : ""} onClick={() => setActiveTab("forums")}>
                    Forums
                  </button>
                  <button type="button" className={activeTab === "saved" ? "is-active" : ""} onClick={() => setActiveTab("saved")}>
                    Saved ({savedItems.length})
                  </button>
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
                  <ResultsList
                    items={filteredResults}
                    savedIds={savedIdSet}
                    onToggleSave={toggleSave}
                    onSimulateOpen={(item) => setSimulatedResult(item)}
                  />
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
          ) : null}
        </section>

        <PlaylistSidebar />
      </div>

      {chaosToasts.length > 0 ? (
        <div className="ns16-chaos-stack">
          {chaosToasts.map((toast) => (
            <div key={toast.id} className="ns16-chaos">
              <p>{toast.message}</p>
              <button type="button" onClick={() => dismissToast(toast.id)}>
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {simulatedResult ? (
        <div className="ns16-modal-layer" role="dialog" aria-modal="true">
          <div className="ns16-modal-backdrop" onClick={() => setSimulatedResult(null)} />
          <div className="ns16-modal-card">
            <div className="ns16-modal-head">
              <p>Simulated 2016 Tab</p>
              <button type="button" onClick={() => setSimulatedResult(null)}>
                Close
              </button>
            </div>

            <h3>{simulatedResult.title}</h3>
            <p>{simulatedResult.displayUrl}</p>

            {simulatedVideoId ? (
              <div className="ns16-modal-video">
                <iframe
                  src={`https://www.youtube.com/embed/${simulatedVideoId}`}
                  title={simulatedResult.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}

            {simulatedIsInstagram ? (
              <div className="ns16-modal-social">
                <p>@nostalgia.throwback</p>
                <p>sunset filter + grain + no algorithm drama</p>
                <button type="button">Like</button>
              </div>
            ) : null}

            {simulatedIsTumblr ? (
              <div className="ns16-modal-social">
                <p>tumblr feels //</p>
                <p>we were cringe but free</p>
                <button type="button">Reblog</button>
              </div>
            ) : null}

            {!simulatedVideoId && !simulatedIsInstagram && !simulatedIsTumblr ? (
              <div className="ns16-modal-social">
                <p>{simulatedResult.snippet}</p>
              </div>
            ) : null}

            <a href={simulatedResult.url} target="_blank" rel="noreferrer">
              Open real source
            </a>
          </div>
        </div>
      ) : null}
    </main>
  );
}
