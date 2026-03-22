import type { UserProfile } from "./types";

export type NostalgiaResultVideo = {
  id: string;
  kind: "video";
  title: string;
  channel: string;
  views: string;
  imageUrl: string;
  tilt: number;
  offsetY: number;
};

export type NostalgiaResultTumblr = {
  id: string;
  kind: "tumblr";
  quote: string;
  blog: string;
  notes: string;
  tilt: number;
  offsetY: number;
};

export type NostalgiaResultBuzzfeed = {
  id: string;
  kind: "buzzfeed";
  headline: string;
  bullets: string[];
  tilt: number;
  offsetY: number;
};

export type NostalgiaResultMeme = {
  id: string;
  kind: "meme";
  topText: string;
  caption: string;
  imageUrl: string;
  tilt: number;
  offsetY: number;
};

export type NostalgiaResultForum = {
  id: string;
  kind: "forum";
  question: string;
  asker: string;
  bestAnswer: string;
  replies: string;
  tilt: number;
  offsetY: number;
};

export type NostalgiaSearchResult =
  | NostalgiaResultVideo
  | NostalgiaResultTumblr
  | NostalgiaResultBuzzfeed
  | NostalgiaResultMeme
  | NostalgiaResultForum;

const VIDEO_TITLES = [
  "Top 10 songs of 2016",
  "BEST Roblox moments 2016",
  "late-night playlist dump",
  "2016 school vlog: chaos edition",
  "Vine compilations that defined the year",
  "Minecraft but every sound is cursed",
];

const CHANNELS = ["nostalgiaTV", "pixelwolf", "musicburner99", "vlogvoid", "midnightclips"];

const TUMBLR_QUOTES = [
  "i miss when things felt simpler",
  "the bus ride home and one song on repeat",
  "everyone was online at 1am and it mattered",
  "i was tired but still scrolling anyway",
  "low battery, high emotions",
];

const TUMBLR_BLOGS = ["softgrungeplanet", "cryingwifi", "sadcapslock", "neonmidnight", "schoolhallwaycore"];

const BUZZFEED_HEADLINES = [
  "21 things only 2016 kids remember",
  "Which 2016 app was your true soulmate?",
  "We ranked chaotic school moments and lost control",
  "Only real ones remember these internet phases",
  "Can you survive this 2016 nostalgia quiz?",
];

const MEME_TOP = [
  "when teacher says group project",
  "me in 2016",
  "wifi during peak hours",
  "mom said go outside",
  "battery at 2%",
];

const MEME_CAPTIONS = [
  "still refreshing the timeline anyway",
  "pretending this is fine",
  "somehow everyone lived like this",
  "the vibes were immaculate tho",
  "and we all accepted this reality",
];

const FORUM_QUESTIONS = [
  "how do i download music for free???",
  "why does my youtube buffer forever",
  "is vine actually dead or not",
  "how to survive school with zero motivation",
  "best game to play after homework?",
];

const ASKER_NAMES = ["coolkid14", "sadpenguin", "vlogfan88", "needhelpplz", "xXmoodXx"];

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextValue(seedRef: { current: number }) {
  seedRef.current = (Math.imul(seedRef.current, 1664525) + 1013904223) >>> 0;
  return seedRef.current / 4294967296;
}

function pick<T>(arr: T[], seedRef: { current: number }) {
  const index = Math.floor(nextValue(seedRef) * arr.length);
  return arr[index % arr.length];
}

function views(seedRef: { current: number }) {
  const bucket = 1 + Math.floor(nextValue(seedRef) * 36);
  const decimal = Math.floor(nextValue(seedRef) * 9);
  return `${bucket}.${decimal}M views`;
}

function notes(seedRef: { current: number }) {
  return `${1200 + Math.floor(nextValue(seedRef) * 9800)} notes`;
}

function replies(seedRef: { current: number }) {
  return `${8 + Math.floor(nextValue(seedRef) * 84)} replies`;
}

function seedImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/290`;
}

function normalize(text: string) {
  return text.toLowerCase();
}

function prioritizedKinds(query: string) {
  const value = normalize(query);

  if (/(youtube|video|music|song|playlist)/.test(value)) {
    return ["video", "video", "buzzfeed", "tumblr", "meme", "forum"] as const;
  }

  if (/(school|homework|class|study|test)/.test(value)) {
    return ["meme", "tumblr", "forum", "video", "buzzfeed", "meme"] as const;
  }

  if (/(game|games|gaming|roblox|minecraft|fortnite)/.test(value)) {
    return ["video", "meme", "forum", "video", "tumblr", "buzzfeed"] as const;
  }

  return ["video", "tumblr", "buzzfeed", "meme", "forum", "video"] as const;
}

function tiltFor(index: number, seedRef: { current: number }) {
  const base = (index % 5) - 2;
  const variance = Math.floor(nextValue(seedRef) * 3) - 1;
  return base * 0.65 + variance * 0.25;
}

function offsetFor(index: number, seedRef: { current: number }) {
  const wobble = Math.floor(nextValue(seedRef) * 9) - 4;
  return (index % 2 === 0 ? 0 : 4) + wobble;
}

export function nostalgiaSearchDelayMs(query: string) {
  const first = query.trim().charCodeAt(0) || 77;
  return 800 + ((query.trim().length * 137 + first * 3) % 701);
}

export function generateNostalgiaSearchResults(profile: UserProfile, query: string): NostalgiaSearchResult[] {
  const seedSource = `${query}|${profile.favoriteContent}|${profile.favoriteApps.join(",")}|${profile.vibes.join(",")}`;
  const seedRef = { current: hashSeed(seedSource) };
  const kinds = prioritizedKinds(query);

  return Array.from({ length: 14 }, (_, index) => {
    const kind = kinds[index % kinds.length];
    const tilt = tiltFor(index, seedRef);
    const offsetY = offsetFor(index, seedRef);

    if (kind === "video") {
      const title = pick(VIDEO_TITLES, seedRef);
      return {
        id: `video-${index}`,
        kind,
        title,
        channel: pick(CHANNELS, seedRef),
        views: views(seedRef),
        imageUrl: seedImage(`${query}-video-${index}`),
        tilt,
        offsetY,
      };
    }

    if (kind === "tumblr") {
      return {
        id: `tumblr-${index}`,
        kind,
        quote: pick(TUMBLR_QUOTES, seedRef),
        blog: pick(TUMBLR_BLOGS, seedRef),
        notes: notes(seedRef),
        tilt,
        offsetY,
      };
    }

    if (kind === "buzzfeed") {
      const bulletA = `only 2016 people remember ${query || "this"}`;
      const bulletB = `your ${profile.favoriteApps[0] ?? "timeline"} was never this calm`;
      const bulletC = `we ranked everything and made it worse`;
      return {
        id: `buzz-${index}`,
        kind,
        headline: pick(BUZZFEED_HEADLINES, seedRef),
        bullets: [bulletA, bulletB, bulletC],
        tilt,
        offsetY,
      };
    }

    if (kind === "meme") {
      return {
        id: `meme-${index}`,
        kind,
        topText: pick(MEME_TOP, seedRef),
        caption: pick(MEME_CAPTIONS, seedRef),
        imageUrl: seedImage(`${query}-meme-${index}`),
        tilt,
        offsetY,
      };
    }

    return {
      id: `forum-${index}`,
      kind: "forum",
      question: pick(FORUM_QUESTIONS, seedRef),
      asker: pick(ASKER_NAMES, seedRef),
      bestAnswer: `try ${profile.favoriteApps[0] ?? "YouTube"} and restart your router twice. worked for me`,
      replies: replies(seedRef),
      tilt,
      offsetY,
    };
  });
}
