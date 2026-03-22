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

type Topic = "youtube" | "music" | "school" | "games" | "social" | "general";

type TopicPack = {
  videos: string[];
  tumblr: string[];
  buzzfeed: string[];
  memeTop: string[];
  memeCaption: string[];
  forumQuestions: string[];
};

const CHANNELS = ["nostalgiaTV", "pixelwolf", "musicburner99", "vlogvoid", "midnightclips", "buffered4ever"];

const TUMBLR_BLOGS = ["softgrungeplanet", "cryingwifi", "sadcapslock", "neonmidnight", "schoolhallwaycore"];

const ASKER_NAMES = ["coolkid14", "sadpenguin", "vlogfan88", "needhelpplz", "xXmoodXx"];

const TOPIC_PACKS: Record<Topic, TopicPack> = {
  youtube: {
    videos: [
      "youtube rabbit hole: {focus} at 2am",
      "{focus} compilations that broke 2016",
      "best {focus} channels you forgot",
      "old youtube tutorial for {focus} (still works)",
    ],
    tumblr: [
      "i opened youtube for one {focus} clip and lost 4 hours",
      "the buffering circle during {focus} was character development",
      "youtube comments on {focus} were pure chaos",
    ],
    buzzfeed: [
      "23 iconic youtube moments about {focus}",
      "which 2016 youtube phase are you if you loved {focus}?",
      "we ranked old youtube {focus} trends from cursed to elite",
    ],
    memeTop: ["when youtube buffers", "me searching {focus}", "2016 youtube autoplay"],
    memeCaption: ["still watching one more video", "algorithm said sleep is optional", "autoplay won again"],
    forumQuestions: [
      "why is my youtube so slow for {focus} videos???",
      "best channel for {focus} in 2016?",
      "how to download a {focus} video from youtube",
    ],
  },
  music: {
    videos: [
      "top songs for {focus} vibes (2016)",
      "nightcore + {focus} playlist dump",
      "best 2016 {focus} remixes you forgot",
      "late-night {focus} playlist while doing nothing",
    ],
    tumblr: [
      "one {focus} song can reset your whole week",
      "headphones in, {focus} on repeat, world muted",
      "2016 music and {focus} was my entire personality",
    ],
    buzzfeed: [
      "21 songs for your {focus} era",
      "build your 2016 {focus} playlist and we judge it",
      "which 2016 artist matches your {focus} mood?",
    ],
    memeTop: ["when beat drops", "me hearing {focus}", "playlist at 1% battery"],
    memeCaption: ["immediately crying in public", "this was the soundtrack", "one song all week"],
    forumQuestions: [
      "where can i find good {focus} playlists",
      "how to put {focus} songs on my phone??",
      "best free app for {focus} music download",
    ],
  },
  school: {
    videos: [
      "school morning routine 2016 ({focus} edition)",
      "study tips while everyone is distracted by {focus}",
      "surviving school week with {focus} energy",
      "back to school haul + {focus}",
    ],
    tumblr: [
      "homework, low sleep, and {focus} in the background",
      "school felt endless but {focus} made it bearable",
      "hallway drama + {focus} + bad wifi",
    ],
    buzzfeed: [
      "17 school memes if you were into {focus}",
      "only school-era kids into {focus} will understand",
      "pack your 2016 school bag and we'll rate your {focus} level",
    ],
    memeTop: ["teacher says surprise quiz", "me with homework", "school + {focus}"],
    memeCaption: ["brain has left the chat", "copying notes at 11:58pm", "cafeteria wifi is cursed"],
    forumQuestions: [
      "how to focus on homework when i keep thinking about {focus}?",
      "best study playlist for school and {focus}",
      "is skipping one class for {focus} bad",
    ],
  },
  games: {
    videos: [
      "best {focus} moments from 2016",
      "{focus} fails that still hurt",
      "roblox + minecraft + {focus} nostalgia",
      "gaming highlights: {focus} edition",
    ],
    tumblr: [
      "one more match of {focus} turned into 3 hours",
      "{focus} after homework was the reward",
      "voice chat during {focus} was actual therapy",
    ],
    buzzfeed: [
      "which 2016 game matches your {focus} mood?",
      "19 gaming habits if {focus} owned your evenings",
      "rank these {focus} game moments and reveal your age",
    ],
    memeTop: ["when squad disconnects", "me in {focus} lobby", "lag at final boss"],
    memeCaption: ["controller almost launched", "this game ruined me", "still queueing anyway"],
    forumQuestions: [
      "best settings for {focus} with low fps",
      "how to stop lag while playing {focus}",
      "is {focus} better on phone or pc",
    ],
  },
  social: {
    videos: [
      "best posts about {focus} from old socials",
      "timeline recap: {focus} edition",
      "{focus} trends from instagram and snapchat",
      "social media throwbacks around {focus}",
    ],
    tumblr: [
      "everyone posting {focus} at the same exact time",
      "my whole feed was {focus} and blurry selfies",
      "{focus} looked better with old filters",
    ],
    buzzfeed: [
      "24 posts proving {focus} owned the timeline",
      "which social app were you on if you loved {focus}?",
      "take this quiz: your feed + {focus} = ?",
    ],
    memeTop: ["when friend posts 12 selfies", "me checking {focus}", "notifications at 3am"],
    memeCaption: ["timeline was never calm", "chaos but make it social", "everyone was online somehow"],
    forumQuestions: [
      "best app to post {focus} pics in 2016?",
      "why is everyone posting only {focus}",
      "how to make my {focus} post go viral",
    ],
  },
  general: {
    videos: [
      "top 10 {focus} moments of 2016",
      "everything about {focus} you forgot",
      "2016 recap: {focus} edition",
      "{focus} nostalgia compilation",
    ],
    tumblr: [
      "i miss when {focus} felt simple",
      "2016 was messy but {focus} felt real",
      "{focus} and low battery energy",
    ],
    buzzfeed: [
      "21 things about {focus} only 2016 kids remember",
      "can you survive this {focus} nostalgia quiz?",
      "which {focus} era are you actually from",
    ],
    memeTop: ["me in 2016", "when {focus} hits", "wifi during {focus}"],
    memeCaption: ["still refreshing anyway", "peak internet moment", "we all lived like this"],
    forumQuestions: [
      "where can i find more {focus} content like 2016",
      "best website for {focus} throwbacks",
      "how to get old {focus} vibes back",
    ],
  },
};

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

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function detectTopic(query: string): Topic {
  const value = normalize(query);

  if (/(youtube|video|vlog|channel)/.test(value)) {
    return "youtube";
  }
  if (/(music|song|songs|playlist|drake|chainsmokers|spotify)/.test(value)) {
    return "music";
  }
  if (/(school|homework|class|study|test|exam|teacher)/.test(value)) {
    return "school";
  }
  if (/(game|games|gaming|roblox|minecraft|fortnite|pokemon)/.test(value)) {
    return "games";
  }
  if (/(instagram|snapchat|twitter|tumblr|vine|social|selfie|story)/.test(value)) {
    return "social";
  }
  return "general";
}

function prettyFocus(query: string, profile: UserProfile) {
  const typed = query.trim();
  if (typed) {
    return typed.toLowerCase();
  }

  const firstContentTag = profile.favoriteContent
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .find(Boolean);

  return firstContentTag || "nostalgia";
}

function formatTemplate(template: string, focus: string) {
  return template.replaceAll("{focus}", focus);
}

function views(seedRef: { current: number }) {
  const bucket = 1 + Math.floor(nextValue(seedRef) * 39);
  const decimal = Math.floor(nextValue(seedRef) * 10);
  return `${bucket}.${decimal}M views`;
}

function notes(seedRef: { current: number }) {
  return `${900 + Math.floor(nextValue(seedRef) * 9300)} notes`;
}

function replies(seedRef: { current: number }) {
  return `${7 + Math.floor(nextValue(seedRef) * 88)} replies`;
}

function seedImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/480/290`;
}

function prioritizedKinds(topic: Topic) {
  if (topic === "youtube" || topic === "music") {
    return ["video", "video", "tumblr", "buzzfeed", "forum", "meme"] as const;
  }

  if (topic === "school") {
    return ["meme", "tumblr", "forum", "video", "buzzfeed", "meme"] as const;
  }

  if (topic === "games") {
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
  const focus = prettyFocus(query, profile);
  const topic = detectTopic(focus);
  const pack = TOPIC_PACKS[topic];
  const primaryApp = profile.favoriteApps[0] ?? "YouTube";

  const seedSource = `${focus}|${topic}|${profile.favoriteContent}|${profile.favoriteApps.join(",")}|${profile.vibes.join(",")}`;
  const seedRef = { current: hashSeed(seedSource) };
  const kinds = prioritizedKinds(topic);

  return Array.from({ length: 24 }, (_, index) => {
    const kind = kinds[index % kinds.length];
    const tilt = tiltFor(index, seedRef);
    const offsetY = offsetFor(index, seedRef);

    if (kind === "video") {
      return {
        id: `video-${index}`,
        kind,
        title: formatTemplate(pick(pack.videos, seedRef), focus),
        channel: pick(CHANNELS, seedRef),
        views: views(seedRef),
        imageUrl: seedImage(`${focus}-video-${index}`),
        tilt,
        offsetY,
      };
    }

    if (kind === "tumblr") {
      return {
        id: `tumblr-${index}`,
        kind,
        quote: formatTemplate(pick(pack.tumblr, seedRef), focus),
        blog: pick(TUMBLR_BLOGS, seedRef),
        notes: notes(seedRef),
        tilt,
        offsetY,
      };
    }

    if (kind === "buzzfeed") {
      return {
        id: `buzz-${index}`,
        kind,
        headline: formatTemplate(pick(pack.buzzfeed, seedRef), focus),
        bullets: [
          `only 2016 people remember ${focus}`,
          `${primaryApp} feeds were full of ${focus}`,
          "we ranked everything and made it chaotic",
        ],
        tilt,
        offsetY,
      };
    }

    if (kind === "meme") {
      return {
        id: `meme-${index}`,
        kind,
        topText: formatTemplate(pick(pack.memeTop, seedRef), focus),
        caption: formatTemplate(pick(pack.memeCaption, seedRef), focus),
        imageUrl: seedImage(`${focus}-meme-${index}`),
        tilt,
        offsetY,
      };
    }

    return {
      id: `forum-${index}`,
      kind: "forum",
      question: formatTemplate(pick(pack.forumQuestions, seedRef), focus),
      asker: pick(ASKER_NAMES, seedRef),
      bestAnswer: `Try searching ${focus} on ${primaryApp} and refresh twice. 2016 internet rules still apply.`,
      replies: replies(seedRef),
      tilt,
      offsetY,
    };
  });
}
