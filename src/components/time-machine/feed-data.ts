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

function hashCode(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (Math.imul(hash, 31) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function escapeXml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&apos;");
}

function trimWords(text: string, count: number) {
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, count)
    .join(" ");
}

function seedImage(seed: string, title: string, subtitle: string) {
  const palettes = [
    ["#ff8ec7", "#7e65ff", "#2b0b67"],
    ["#78e8ff", "#ff83b3", "#260d5a"],
    ["#ffb176", "#ff6ea0", "#2b105f"],
    ["#73f2cd", "#6f7cff", "#1f114c"],
    ["#ffc95f", "#ff7bd0", "#3b146f"],
  ] as const;
  const palette = palettes[hashCode(seed) % palettes.length];
  const tilt = ((hashCode(seed + "-tilt") % 10) - 5) * 0.7;

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='460' height='460' viewBox='0 0 460 460'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${palette[0]}'/>
        <stop offset='48%' stop-color='${palette[1]}'/>
        <stop offset='100%' stop-color='${palette[2]}'/>
      </linearGradient>
      <filter id='grain'>
        <feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='1' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0.25'/>
        <feBlend mode='soft-light' in2='SourceGraphic'/>
      </filter>
    </defs>
    <rect width='460' height='460' fill='url(#g)'/>
    <rect width='460' height='460' fill='rgba(0,0,0,0.16)'/>
    <g transform='translate(230 230) rotate(${tilt})'>
      <rect x='-170' y='-125' width='340' height='250' rx='20' fill='rgba(8,5,32,0.33)' stroke='rgba(255,255,255,0.34)' stroke-width='3'/>
      <text x='-145' y='-70' fill='white' font-family='Verdana, Arial, sans-serif' font-size='30' font-weight='700'>${escapeXml(trimWords(title.toUpperCase(), 6))}</text>
      <text x='-145' y='-20' fill='#d4fbff' font-family='Verdana, Arial, sans-serif' font-size='24'>${escapeXml(trimWords(subtitle, 8))}</text>
      <text x='-145' y='28' fill='#ffe3f2' font-family='Verdana, Arial, sans-serif' font-size='18'>captured in blurry 2016 quality</text>
      <text x='-145' y='78' fill='#b2f4ff' font-family='Verdana, Arial, sans-serif' font-size='15'>tap to open post</text>
    </g>
    <rect width='460' height='460' filter='url(#grain)' opacity='0.14'/>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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
  const selectedVibes: PersonalityVibe[] = profile.vibes.length > 0 ? profile.vibes : ["aesthetic"];
  const moods = selectedVibes.flatMap((entry) => VIBE_TO_MOOD[entry]);

  const baseItems: FeedItem[] = Array.from({ length: 24 }, (_, index) => {
    const platformIndex = index % 3;
    const platform = platformIndex === 0 ? "instagram" : platformIndex === 1 ? "tumblr" : "twitter";
    const term = pick(terms);
    const appSeed = pick(chosenAppSeeds);
    const mood = pick(moods);

    if (platform === "instagram") {
      const summary = `${term} / ${trimWords(mood, 3)}`;
      return {
        id: `ig-${index}`,
        platform,
        handle: pick(HANDLES),
        caption: `${appSeed} | #${term.replace(/\s+/g, "")} #2016mood`,
        timestamp: pick(TIMESTAMPS),
        likes: 78 + Math.floor(Math.random() * 921),
        imageUrl: seedImage(`${term}-${selectedVibes.join("-")}-${index}`, appSeed, summary),
        mood,
      };
    }

    if (platform === "tumblr") {
      const diarySummary = `mood: ${trimWords(mood, 4)} | topic: ${term}`;
      return {
        id: `tb-${index}`,
        platform,
        handle: pick(HANDLES),
        caption: `anonymous thought: "${mood} + ${term} + 2:14AM scrolling..."`,
        timestamp: pick(TIMESTAMPS),
        notes: 31 + Math.floor(Math.random() * 600),
        imageUrl: seedImage(`tumblr-${profile.ageIn2016}-${index}`, term, diarySummary),
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
