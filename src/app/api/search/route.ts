import { NextRequest, NextResponse } from "next/server";
import type { RealResult } from "@/components/nostalgia-search/types";

type BingWebPage = {
  name?: string;
  url?: string;
  displayUrl?: string;
  snippet?: string;
};

type BingResponse = {
  webPages?: {
    value?: BingWebPage[];
  };
};

type TavilyResultItem = {
  title?: string;
  url?: string;
  content?: string;
};

type TavilyResponse = {
  results?: TavilyResultItem[];
};

type YouTubeSearchItem = {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    description?: string;
    channelTitle?: string;
    publishedAt?: string;
  };
};

type YouTubeSearchResponse = {
  items?: YouTubeSearchItem[];
};

type SerpstackOrganicResult = {
  title?: string;
  link?: string;
  url?: string;
  displayed_link?: string;
  displayed_url?: string;
  snippet?: string;
  description?: string;
};

type SerpstackResponse = {
  organic_results?: SerpstackOrganicResult[];
  error?: {
    code?: string | number;
    message?: string;
  };
};

const FORUM_HINTS = ["forum", "reddit", "tumblr", "youtube", "blog", "wordpress", "blogspot", "answers", "fandom"];
const VINTAGE_HINTS = [
  "2016",
  "2015",
  "2014",
  "vine",
  "musically",
  "tumblr",
  "snapchat",
  "old youtube",
  "yahoo answers",
  "nostalgia",
  "throwback",
];
const MODERN_YEAR_PATTERN = /\b(2019|202\d|203\d)\b/;

function hasExplicitYear(query: string) {
  return /\b(19|20)\d{2}\b/.test(query);
}

function buildVintageQuery(query: string) {
  const cleaned = query.trim();
  if (!cleaned) {
    return "2016 internet nostalgia";
  }

  if (hasExplicitYear(cleaned)) {
    return cleaned;
  }

  return `${cleaned} 2016 tumblr youtube vine forum`;
}

function safeHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function containsHint(text: string, hints: string[]) {
  const lowered = text.toLowerCase();
  return hints.some((hint) => lowered.includes(hint));
}

function scoreResult(url: string, title: string, snippet: string) {
  const value = `${url} ${title} ${snippet}`.toLowerCase();
  let score = 0;

  FORUM_HINTS.forEach((hint) => {
    if (value.includes(hint)) {
      score += 2;
    }
  });

  VINTAGE_HINTS.forEach((hint) => {
    if (value.includes(hint)) {
      score += 3;
    }
  });

  if (MODERN_YEAR_PATTERN.test(value) && !value.includes("2016")) {
    score -= 4;
  }

  return score;
}

function casualizeSnippet(snippet: string, query: string) {
  const cleaned = snippet.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return `Old-web result about ${query}, pulled from 2016-style archives and forum threads.`;
  }
  return `${cleaned} 2016 vibe check: archived + chaotic + human.`;
}

function fallbackResults(query: string): RealResult[] {
  return Array.from({ length: 8 }, (_, index) => ({
    id: `fallback-${index}`,
    kind: "real",
    title: `${query} 2016 archive thread ${index + 1}`,
    url: `https://example.com/${encodeURIComponent(query)}/2016/${index + 1}`,
    displayUrl: `example.com/${query.replace(/\s+/g, "-")}/2016/${index + 1}`,
    snippet: `Fallback 2016-style result for ${query}. Add SERPSTACK_API_KEY, TAVILY_API_KEY, SEARCH_API_KEY, or YOUTUBE_API_KEY.`,
  }));
}

function finalizeVintageResults(items: RealResult[]) {
  const ranked = items
    .map((item) => ({
      item,
      score: scoreResult(item.url, item.title, item.snippet),
      isVintage: containsHint(`${item.title} ${item.url} ${item.snippet}`, VINTAGE_HINTS),
    }))
    .sort((a, b) => b.score - a.score);

  const strictVintage = ranked
    .filter((entry) => entry.score >= 2 && (!MODERN_YEAR_PATTERN.test(entry.item.snippet) || entry.isVintage))
    .map((entry) => entry.item);

  const selected = (strictVintage.length >= 6 ? strictVintage : ranked.map((entry) => entry.item)).slice(0, 14);

  return selected.map((entry) => ({
    ...entry,
    snippet: casualizeSnippet(entry.snippet, entry.title),
  }));
}

async function fetchSerpstackResults(query: string, key: string) {
  const endpoint = new URL("https://api.serpstack.com/search");
  endpoint.searchParams.set("access_key", key);
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("num", "20");
  endpoint.searchParams.set("hl", "en");
  endpoint.searchParams.set("gl", "us");
  endpoint.searchParams.set("safe", "active");

  const response = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Serpstack request failed: ${response.status}`);
  }

  const payload = (await response.json()) as SerpstackResponse;
  if (payload.error) {
    throw new Error(`Serpstack error: ${payload.error.code}`);
  }

  const normalized = (payload.organic_results ?? [])
    .map((entry, index): RealResult | null => {
      const url = (entry.link || entry.url || "").trim();
      const title = (entry.title || "").trim();
      if (!url || !title) {
        return null;
      }

      const snippet = (entry.snippet || entry.description || "").trim();
      const displayUrl = (entry.displayed_link || entry.displayed_url || safeHostname(url)).trim();
      return {
        id: `serpstack-${index}-${url}`,
        kind: "real",
        title,
        url,
        displayUrl,
        snippet,
      };
    })
    .filter((entry): entry is RealResult => Boolean(entry));

  return finalizeVintageResults(normalized);
}

async function fetchTavilyResults(query: string, key: string) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: key,
      query,
      search_depth: "advanced",
      include_answer: false,
      include_images: false,
      max_results: 18,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Tavily request failed: ${response.status}`);
  }

  const payload = (await response.json()) as TavilyResponse;
  const normalized = (payload.results ?? [])
    .map((entry, index): RealResult | null => {
      const url = entry.url?.trim();
      const title = entry.title?.trim();
      if (!url || !title) {
        return null;
      }

      return {
        id: `tavily-${index}-${url}`,
        kind: "real",
        title,
        url,
        displayUrl: safeHostname(url),
        snippet: (entry.content || "").trim(),
      };
    })
    .filter((entry): entry is RealResult => Boolean(entry));

  return finalizeVintageResults(normalized);
}

async function fetchYouTubeResults(query: string, key: string) {
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("type", "video");
  endpoint.searchParams.set("maxResults", "18");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("key", key);

  const response = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`YouTube request failed: ${response.status}`);
  }

  const payload = (await response.json()) as YouTubeSearchResponse;
  const normalized = (payload.items ?? [])
    .map((entry, index): RealResult | null => {
      const videoId = entry.id?.videoId?.trim();
      const title = entry.snippet?.title?.trim();
      if (!videoId || !title) {
        return null;
      }

      const description = (entry.snippet?.description || "").trim();
      const channel = entry.snippet?.channelTitle?.trim() || "YouTube channel";
      const published = entry.snippet?.publishedAt?.slice(0, 10) || "unknown";
      return {
        id: `yt-${index}-${videoId}`,
        kind: "real",
        title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        displayUrl: `youtube.com/watch?v=${videoId}`,
        snippet: `${description} Channel: ${channel}. Uploaded: ${published}.`,
      };
    })
    .filter((entry): entry is RealResult => Boolean(entry));

  return finalizeVintageResults(normalized);
}

async function fetchBingResults(query: string, key: string) {
  const endpoint = new URL("https://api.bing.microsoft.com/v7.0/search");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("count", "18");
  endpoint.searchParams.set("mkt", "en-US");
  endpoint.searchParams.set("safeSearch", "Moderate");
  endpoint.searchParams.set("responseFilter", "Webpages");
  endpoint.searchParams.set("textDecorations", "false");
  endpoint.searchParams.set("textFormat", "Raw");

  const response = await fetch(endpoint.toString(), {
    headers: {
      "Ocp-Apim-Subscription-Key": key,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Bing request failed: ${response.status}`);
  }

  const payload = (await response.json()) as BingResponse;
  const normalized = (payload.webPages?.value ?? [])
    .map((entry, index): RealResult | null => {
      const url = entry.url?.trim();
      const title = entry.name?.trim();
      if (!url || !title) {
        return null;
      }

      return {
        id: `bing-${index}-${url}`,
        kind: "real",
        title,
        url,
        displayUrl: entry.displayUrl?.trim() || safeHostname(url),
        snippet: (entry.snippet || "").trim(),
      };
    })
    .filter((entry): entry is RealResult => Boolean(entry));

  return finalizeVintageResults(normalized);
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const vintageQuery = buildVintageQuery(query);
  const serpstackKey = process.env.SERPSTACK_API_KEY || process.env.NEXT_PUBLIC_SERPSTACK_API_KEY;
  const tavilyKey = process.env.TAVILY_API_KEY || process.env.NEXT_PUBLIC_TAVILY_API_KEY;
  const bingKey = process.env.SEARCH_API_KEY || process.env.NEXT_PUBLIC_SEARCH_API_KEY;
  const youtubeKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  if (serpstackKey) {
    try {
      const serpstackResults = await fetchSerpstackResults(vintageQuery, serpstackKey);
      if (serpstackResults.length > 0) {
        return NextResponse.json({
          query,
          provider: "serpstack",
          results: serpstackResults,
        });
      }
    } catch {
      // Continue fallback chain.
    }
  }

  if (tavilyKey) {
    try {
      const tavilyResults = await fetchTavilyResults(vintageQuery, tavilyKey);
      if (tavilyResults.length > 0) {
        return NextResponse.json({
          query,
          provider: "tavily",
          results: tavilyResults,
        });
      }
    } catch {
      // Continue fallback chain.
    }
  }

  if (bingKey) {
    try {
      const bingResults = await fetchBingResults(vintageQuery, bingKey);
      if (bingResults.length > 0) {
        return NextResponse.json({
          query,
          provider: "bing",
          results: bingResults,
        });
      }
    } catch {
      // Continue fallback chain.
    }
  }

  if (youtubeKey) {
    try {
      const youtubeResults = await fetchYouTubeResults(vintageQuery, youtubeKey);
      return NextResponse.json({
        query,
        provider: "youtube",
        warning: "Using YouTube fallback. Add SERPSTACK_API_KEY for broader web results.",
        results: youtubeResults.length ? youtubeResults : fallbackResults(query),
      });
    } catch {
      return NextResponse.json({
        query,
        provider: "fallback",
        warning: "Search providers failed. Showing fallback results.",
        results: fallbackResults(query),
      });
    }
  }

  return NextResponse.json({
    query,
    provider: "fallback",
    warning: "Missing SERPSTACK_API_KEY / TAVILY_API_KEY / SEARCH_API_KEY / YOUTUBE_API_KEY.",
    results: fallbackResults(query),
  });
}
