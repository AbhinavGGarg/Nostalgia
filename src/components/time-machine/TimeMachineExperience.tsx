"use client";

import { useEffect, useRef, useState } from "react";
import { ControlDeck } from "./ControlDeck";
import { MainFeed } from "./MainFeed";
import { MusicPlayer } from "./MusicPlayer";
import { NostalgiaResults } from "./NostalgiaResults";
import { generateNostalgiaSearchResults, nostalgiaSearchDelayMs, type NostalgiaSearchResult } from "./nostalgia-search-data";
import { NostalgiaSearchBar } from "./NostalgiaSearchBar";
import { OnboardingScreen } from "./OnboardingScreen";
import { PopupSystem } from "./PopupSystem";
import { TransitionScreen } from "./TransitionScreen";
import type { UserProfile } from "./types";

type AppStage = "onboarding" | "transition" | "experience";
type ExperienceView = "feed" | "explore";

const LOADING_MESSAGES = ["Searching 2016 internet...", "Connecting to old servers..."] as const;

export function TimeMachineExperience() {
  const [stage, setStage] = useState<AppStage>("onboarding");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NostalgiaSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchStarted, setSearchStarted] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [activeView, setActiveView] = useState<ExperienceView>("feed");
  const [searchFlicker, setSearchFlicker] = useState(false);

  const searchTimerRef = useRef<number | null>(null);
  const loadingSwapTimerRef = useRef<number | null>(null);
  const flickerTimerRef = useRef<number | null>(null);

  const clearSearchTimers = () => {
    if (searchTimerRef.current !== null) {
      window.clearTimeout(searchTimerRef.current);
      searchTimerRef.current = null;
    }
    if (loadingSwapTimerRef.current !== null) {
      window.clearTimeout(loadingSwapTimerRef.current);
      loadingSwapTimerRef.current = null;
    }
    if (flickerTimerRef.current !== null) {
      window.clearTimeout(flickerTimerRef.current);
      flickerTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearSearchTimers();
    };
  }, []);

  if (stage === "onboarding") {
    return (
      <OnboardingScreen
        onComplete={(nextProfile) => {
          setProfile(nextProfile);
          setStage("transition");
        }}
      />
    );
  }

  if (!profile) {
    return null;
  }

  if (stage === "transition") {
    return (
      <TransitionScreen
        profile={profile}
        onComplete={() => {
          setStage("experience");
        }}
      />
    );
  }

  const returnToSetup = () => {
    clearSearchTimers();
    setSearching(false);
    setSearchStarted(false);
    setSearchFlicker(false);
    setLoadingMessage(LOADING_MESSAGES[0]);
    setActiveView("feed");
    setSearchQuery("");
    setSubmittedQuery("");
    setSearchResults([]);
    setProfile(null);
    setStage("onboarding");
  };

  const runSearch = () => {
    if (searching) {
      return;
    }

    const typedQuery = searchQuery.trim();
    const fallbackQuery = profile.favoriteContent.split(",")[0]?.trim() || "2016 internet";
    const finalQuery = typedQuery || fallbackQuery;

    if (!typedQuery) {
      setSearchQuery(finalQuery);
    }

    clearSearchTimers();
    setSearchStarted(true);
    setSearching(true);
    setSearchFlicker(true);
    setSubmittedQuery(finalQuery);
    setActiveView("explore");
    setLoadingMessage(LOADING_MESSAGES[0]);

    const delay = nostalgiaSearchDelayMs(finalQuery);
    const swapAt = Math.min(850, Math.max(280, Math.floor(delay * 0.52)));

    loadingSwapTimerRef.current = window.setTimeout(() => {
      setLoadingMessage(LOADING_MESSAGES[1]);
    }, swapAt);

    flickerTimerRef.current = window.setTimeout(() => {
      setSearchFlicker(false);
    }, 520);

    searchTimerRef.current = window.setTimeout(() => {
      setSearchResults(generateNostalgiaSearchResults(profile, finalQuery));
      setSearching(false);
      setSearchFlicker(false);
      setLoadingMessage(LOADING_MESSAGES[0]);
      window.dispatchEvent(new Event("tm2016-notify"));
    }, delay);
  };

  return (
    <main className="clean-theme relative min-h-screen overflow-hidden px-3 pb-24 pt-4 sm:px-5 sm:pt-6 xl:h-screen xl:pb-6">
      <div className="vhs-noise pointer-events-none absolute inset-0 opacity-24" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-14" />
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <PopupSystem profile={profile} enabled />

      <NostalgiaSearchBar
        query={searchQuery}
        searching={searching}
        loadingMessage={loadingMessage}
        activeView={activeView}
        onChangeQuery={setSearchQuery}
        onSearch={runSearch}
        onSwitchView={setActiveView}
      />

      <header className={`retro-panel relative z-10 mb-4 flex flex-wrap items-center justify-between gap-2 p-4 ${searchFlicker ? "glitch-panel" : ""}`}>
        <div>
          <p className="font-pixel text-[10px] text-violet-100">CONNECTING TO 2016 SERVERS...</p>
          <h1 className="font-chaos mt-1 text-3xl text-white sm:text-4xl">NOSTALGIA</h1>
          <p className="text-xs text-white/80 sm:text-sm">Personalized Digital Time Machine for age {profile.ageIn2016}</p>
        </div>
        <div className="text-right text-[11px] text-violet-100/90">
          <p>apps: {profile.favoriteApps.join(", ")}</p>
          <p>vibes: {profile.vibes.join(", ")}</p>
          <p>content: {profile.favoriteContent}</p>
          <button type="button" className="retro-micro-btn mt-2" onClick={returnToSetup}>
            Back To Setup
          </button>
        </div>
      </header>

      <section className="relative z-10 grid gap-4 xl:h-[calc(100vh-250px)] xl:grid-cols-[1.3fr_0.9fr] xl:overflow-hidden">
        {activeView === "feed" ? (
          <MainFeed profile={profile} />
        ) : (
          <NostalgiaResults
            query={submittedQuery || searchQuery}
            results={searchResults}
            searching={searching}
            searchStarted={searchStarted}
            flicker={searchFlicker}
          />
        )}

        <div className="space-y-4 lg:ml-1 xl:max-h-full xl:overflow-y-auto xl:pr-1">
          <MusicPlayer autoStart />
          <ControlDeck />
        </div>
      </section>
    </main>
  );
}
