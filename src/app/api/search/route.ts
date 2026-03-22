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

const FORUM_HINTS = ["forum", "reddit", "tumblr", "youtube", "blog", "wordpress", "blogspot", "answers", "fandom"];

function scoreResult(url: string, title: string) {
  const value = `${url} ${title}`.toLowerCase();
  let score = 0;
  FORUM_HINTS.forEach((hint) => {
    if (value.includes(hint)) {
      score += 2;
    }
  });
  return score;
}

function casualizeSnippet(snippet: string, query: string) {
  const cleaned = snippet.trim().replace(/\s+/g, " ");
  if (!cleaned) {
    return `Old-web result about ${query}, likely discussed in forums and old blogs.`;
  }
  return `${cleaned} Feels very 2016 internet.`;
}

function fallbackResults(query: string): RealResult[] {
  return Array.from({ length: 8 }, (_, index) => ({
    id: `fallback-${index}`,
    kind: "real",
    title: `${query} thread archive ${index + 1}`,
    url: `https://example.com/${encodeURIComponent(query)}/${index + 1}`,
    displayUrl: `example.com/${query.replace(/\s+/g, "-")}/${index + 1}`,
    snippet: `Fallback result for ${query}. Add NEXT_PUBLIC_SEARCH_API_KEY to enable live Bing results.`,
  }));
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
  }

  const key = process.env.NEXT_PUBLIC_SEARCH_API_KEY || process.env.SEARCH_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        query,
        provider: "fallback",
        warning: "Missing NEXT_PUBLIC_SEARCH_API_KEY. Using fallback results.",
        results: fallbackResults(query),
      },
      { status: 200 },
    );
  }

  try {
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
    const pages = payload.webPages?.value ?? [];

    const normalized = pages
      .map((entry, index): RealResult | null => {
        const url = entry.url?.trim();
        const title = entry.name?.trim();
        if (!url || !title) {
          return null;
        }

        const displayUrl = entry.displayUrl?.trim() || new URL(url).hostname;
        return {
          id: `real-${index}-${url}`,
          kind: "real",
          title,
          url,
          displayUrl,
          snippet: casualizeSnippet(entry.snippet ?? "", query),
        };
      })
      .filter((entry): entry is RealResult => Boolean(entry));

    const ranked = normalized
      .sort((a, b) => scoreResult(b.url, b.title) - scoreResult(a.url, a.title))
      .slice(0, 14);

    return NextResponse.json({
      query,
      provider: "bing",
      results: ranked.length ? ranked : fallbackResults(query),
      warning: ranked.length ? undefined : "Live search returned no web pages. Showing fallback results.",
    });
  } catch {
    return NextResponse.json(
      {
        query,
        provider: "fallback",
        warning: "Bing request failed. Showing fallback results.",
        results: fallbackResults(query),
      },
      { status: 200 },
    );
  }
}
