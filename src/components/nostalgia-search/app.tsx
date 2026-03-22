"use client";

import { useRef, useState } from "react";
import { ResultsList } from "./results-list";
import { SearchBar } from "./search-bar";
import type { InjectedResult, NostalgiaResult, RealResult, SearchApiPayload } from "./types";

const LOADING_STEPS = ["Connecting to 2016 internet...", "Searching archived web...", "Indexing old pages..."] as const;

function buildInjected(query: string): InjectedResult[] {
  const focus = query.trim() || "internet";
  return [
    {
      id: `inj-video-${focus}`,
      kind: "youtube",
      title: `BEST ${focus.toUpperCase()} MOMENTS 2016`,
      url: "https://www.youtube.com",
      displayUrl: "youtube.com/watch?v=nostalgia2016",
      snippet: `Low-res throwback clips and chaotic comments around ${focus}.`,
    },
    {
      id: `inj-tumblr-${focus}`,
      kind: "tumblr",
      title: "tumblr mood archive",
      url: "https://www.tumblr.com",
      displayUrl: "tumblr.com/post/late-night-feelings",
      snippet: `i miss when ${focus} felt small, weird, and human online.`,
    },
    {
      id: `inj-buzz-${focus}`,
      kind: "buzzfeed",
      title: `21 things only 2016 ${focus} fans remember`,
      url: "https://www.buzzfeed.com",
      displayUrl: "buzzfeed.com/nostalgia-2016",
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

export function NostalgiaSearchApp() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_STEPS[0]);
  const [results, setResults] = useState<NostalgiaResult[]>([]);
  const [provider, setProvider] = useState<"bing" | "fallback" | "none">("none");
  const [warning, setWarning] = useState<string>("");

  const loadingIntervalRef = useRef<number | null>(null);

  const hasResults = results.length > 0;

  const runSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) {
      return;
    }

    setSubmittedQuery(trimmed);
    setLoading(true);
    setWarning("");
    setLoadingMessage(LOADING_STEPS[0]);

    let step = 0;
    if (loadingIntervalRef.current !== null) {
      window.clearInterval(loadingIntervalRef.current);
    }
    loadingIntervalRef.current = window.setInterval(() => {
      step = (step + 1) % LOADING_STEPS.length;
      setLoadingMessage(LOADING_STEPS[step]);
    }, 650);

    const minDelay = 1000 + Math.floor(Math.random() * 1000);
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

  return (
    <main className="ns16-shell ns16-shell-clean">
      <div className="ns16-noise" />

      <header className="ns16-toolbar">
        <h1>NOSTALGIA</h1>
        <SearchBar value={query} searching={loading} onChange={setQuery} onSubmit={runSearch} compact />
      </header>

      <section className="ns16-results-wrap ns16-results-wrap-clean">
        <div className="ns16-results-meta">
          {loading ? (
            <p className="ns16-status">{loadingMessage}</p>
          ) : hasResults ? (
            <p>
              Showing results for &quot;{submittedQuery}&quot;
            </p>
          ) : (
            <p>Search anything to start browsing.</p>
          )}
          {!loading ? <p>{provider === "bing" ? "Live web results" : "Fallback mode (add API key for live web)"}</p> : null}
          {warning && !loading ? <p className="ns16-warning">{warning}</p> : null}
        </div>

        {loading ? (
          <div className="ns16-loading-inline">
            <div className="ns16-loading-bar-wrap">
              <div className="ns16-loading-bar" />
            </div>
          </div>
        ) : null}

        {!loading && hasResults ? <ResultsList items={results} /> : null}

        {!loading && !hasResults ? (
          <section className="ns16-empty">
            <h2>Nostalgia Search Engine</h2>
            <p>Type a query and press Explore.</p>
            <p>Try: youtube, school memes, old tumblr, roblox 2016</p>
          </section>
        ) : null}
      </section>

      <footer className="ns16-footnote">
        <p>2016-style web search experience (live API + nostalgic ranking).</p>
        <p className="ns16-footnote-link">Set SEARCH_API_KEY in .env.local and Vercel for live search.</p>
      </footer>
    </main>
  );
}
