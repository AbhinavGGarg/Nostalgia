import type { FavoriteApp, FeedItem, PersonalityVibe, UserProfile } from "./types";

const HANDLES = [
  "@sadboi.hours",
  "@neonpeach",
  "@wifi_crying",
  "@vhs.m0od",
  "@latebusvibes",
  "@softgrungeplanet",
  "@memeoracle",
  "@tinytextposts",
];

const TIMESTAMPS = ["12m ago", "2h ago", "yesterday", "just now", "5h ago", "1d ago"];

const VIBE_TO_MOOD: Record<PersonalityVibe, string[]> = {
  funny: ["chaotic meme energy", "laughing at terrible edits", "inside jokes"],
  aesthetic: ["pastel haze", "over-filtered sunsets", "glitter overlays"],
  chaotic: ["caps lock timeline", "too many tabs open", "viral randomness"],
  introverted: ["late-night scrolling", "soft thoughts", "quiet lyric posts"],
  edgy: ["grainy black-and-white", "cryptic captions", "moody remixes"],
  soft: ["dreamy moodboard", "cozy pixel skies", "gentle nostalgia"],
  "main-character": ["cinematic bus window moments", "dramatic caption energy", "soundtrack-core"],
  daydreamer: ["cloudy neon thoughts", "imagination spirals", "soft-focus universe"],
  gamer: ["late-night rank grind", "lobby banter", "victory screenshot flex"],
  romantic: ["heart-eyes playlists", "crush-coded posts", "hopeless but iconic"],
  hype: ["all-caps excitement", "party timeline", "unstoppable weekend energy"],
};

const APP_SEEDS: Record<FavoriteApp, string[]> = {
  Instagram: [
    "blurry concert photo with too much Valencia",
    "mirror selfie with giant caption emoji combo",
    "food pic taken in bad yellow lighting",
  ],
  Snapchat: ["dog filter spam", "streak panic", "story full of tiny captions"],
  "Musical.ly": ["lip-sync in bedroom lighting", "slow-motion transition attempt", "duet challenge"],
  Vine: ["looping six-second chaos", "quote everyone repeats", "micro-sketch with a loud cut"],
  YouTube: ["DIY fail compilation", "reaction video marathon", "storytime with clickbait title"],
  Roblox: ["obby fail screenshot", "avatar flex post", "late-night server chaos"],
  Fortnite: ["squad clutch clip", "storm panic moment", "victory dance spam"],
  Spotify: ["playlist screenshot dump", "repeat song confession", "lyric quote story"],
  Facebook: ["tagged in old album", "comment war under a meme", "family group post overload"],
  WhatsApp: ["group chat meltdown", "voice note chain", "meme forward with 28 replies"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function seedImage(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/460/460`;
}

function contentTerms(input: string) {
  const cleaned = input
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);

  if (cleaned.length > 0) {
    return cleaned;
  }

  return ["memes", "gaming", "playlist screenshots", "challenge videos"];
}

export function createPersonalizedFeed(profile: UserProfile): FeedItem[] {
  const terms = contentTerms(profile.favoriteContent);
  const chosenAppSeeds = profile.favoriteApps.length
    ? profile.favoriteApps.flatMap((app) => APP_SEEDS[app])
    : APP_SEEDS.Instagram;
  const moods = VIBE_TO_MOOD[profile.vibe];

  const baseItems: FeedItem[] = Array.from({ length: 16 }, (_, index) => {
    const platformIndex = index % 3;
    const platform = platformIndex === 0 ? "instagram" : platformIndex === 1 ? "tumblr" : "twitter";
    const term = pick(terms);
    const appSeed = pick(chosenAppSeeds);
    const mood = pick(moods);

    if (platform === "instagram") {
      return {
        id: `ig-${index}`,
        platform,
        handle: pick(HANDLES),
        caption: `${appSeed} | #${term.replace(/\s+/g, "")} #2016mood`,
        timestamp: pick(TIMESTAMPS),
        likes: 78 + Math.floor(Math.random() * 921),
        imageUrl: seedImage(`${term}-${profile.vibe}-${index}`),
        mood,
      };
    }

    if (platform === "tumblr") {
      return {
        id: `tb-${index}`,
        platform,
        handle: pick(HANDLES),
        caption: `anonymous thought: "${mood} + ${term} + 2:14AM scrolling..."`,
        timestamp: pick(TIMESTAMPS),
        notes: 31 + Math.floor(Math.random() * 600),
        imageUrl: seedImage(`tumblr-${profile.ageIn2016}-${index}`),
        mood,
      };
    }

    return {
      id: `tw-${index}`,
      platform,
      handle: pick(HANDLES),
      caption: `${term} was literally the whole personality today. retweet if your battery was 3% all year`,
      timestamp: pick(TIMESTAMPS),
      reposts: 7 + Math.floor(Math.random() * 210),
      mood,
    };
  });

  return baseItems.sort(() => Math.random() - 0.5);
}
