"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CameraMode } from "./CameraMode";
import { MainFeed } from "./MainFeed";
import { MiniGames } from "./MiniGames";
import { MusicPlayer } from "./MusicPlayer";
import { NostalgiaResults } from "./NostalgiaResults";
import { generateNostalgiaSearchResults, nostalgiaSearchDelayMs, type NostalgiaSearchResult } from "./nostalgia-search-data";
import { NostalgiaSearchBar } from "./NostalgiaSearchBar";
import { OnboardingScreen } from "./OnboardingScreen";
import { PopupSystem } from "./PopupSystem";
import { TimeCollapse } from "./TimeCollapse";
import { TransitionScreen } from "./TransitionScreen";
import { TumblrMode } from "./TumblrMode";
import type { CollapseStage, UserProfile } from "./types";

type AppStage = "onboarding" | "transition" | "experience";
type ExperienceView = "feed" | "explore";

const LOADING_MESSAGES = ["Searching 2016 internet...", "Connecting to old servers..."] as const;

export function TimeMachineExperience() {
  const [stage, setStage] = useState<AppStage>("onboarding");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [collapseStage, setCollapseStage] = useState<CollapseStage>(0);
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

  const stageClass = useMemo(() => {
    if (collapseStage === 1) {
      return "stage-drifting";
    }
    if (collapseStage === 2) {
      return "stage-bleeding";
    }
    if (collapseStage === 3) {
      return "stage-collapsing";
    }
    return "";
  }, [collapseStage]);

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
          setStartedAt(Date.now());
        }}
      />
    );
  }

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
    <main className={`relative min-h-screen overflow-hidden px-3 pb-24 pt-4 sm:px-5 sm:pt-6 ${stageClass}`}>
      <div className="vhs-noise pointer-events-none absolute inset-0 opacity-45" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

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
          <p className="font-pixel text-[10px] text-cyan-100">CONNECTING TO 2016 SERVERS...</p>
          <h1 className="font-chaos mt-1 text-3xl text-white sm:text-4xl">NOSTALGIA</h1>
          <p className="text-xs text-white/80 sm:text-sm">Personalized Digital Time Machine for age {profile.ageIn2016}</p>
        </div>
        <div className="text-right text-[11px] text-pink-100">
          <p>apps: {profile.favoriteApps.join(", ")}</p>
          <p>vibes: {profile.vibes.join(", ")}</p>
          <p>content: {profile.favoriteContent}</p>
        </div>
      </header>

      <section className="relative z-10 grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
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

        <div className="space-y-4 lg:ml-1">
          <MusicPlayer autoStart />
          <CameraMode />
          <MiniGames />
          <TumblrMode />

          <section className="retro-panel p-4">
            <p className="font-pixel text-[10px] text-cyan-100">FOR HACKATHON JUDGES</p>
            <h3 className="font-chaos mt-1 text-lg text-white">Why this matters</h3>
            <p className="mt-2 text-sm text-white/90">
              Modern social platforms can feel optimized, performative, and overwhelming. This prototype recreates a
              less-perfect social era to highlight what we lost: spontaneity, weirdness, and emotional honesty.
            </p>
          </section>
        </div>
      </section>

      {startedAt ? <TimeCollapse startedAt={startedAt} onStageChange={setCollapseStage} /> : null}
    </main>
  );
}
