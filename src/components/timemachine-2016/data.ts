import type { MemoryInput, NostalgiaResult, ResultType } from "./types";

const TYPES: ResultType[] = ["video", "tumblr", "buzzfeed", "meme", "forum"];
const TIMESTAMPS = ["2h ago", "yesterday", "11m ago", "4h ago", "3 days ago", "just now"];

const VIDEO_TEMPLATES = [
  "{term} playlist you forgot existed",
  "2016 school vlog: {term} edition",
  "top 10 {term} moments (low quality)",
  "late-night {term} compilation",
];

const TUMBLR_TEMPLATES = [
  "i still think {term} was a whole personality",
  "2:14am thought: {term} + fluorescent hallway lights",
  "the way {term} felt more real than today",
  "reblog if your soul is still in 2016 with {term}",
];

const BUZZFEED_TEMPLATES = [
  "Only 2016 Kids Will Remember These {term} Moments",
  "Which {term} Era Defined Your Teen Timeline?",
  "21 {term} Things That Owned Your Entire Week",
  "We Ranked {term} Trends and It Got Emotional",
];

const MEME_TEMPLATES = [
  "when teacher says no phones but {term} drops",
  "me pretending i'm fine while {term} plays",
  "nobody: absolutely nobody: me in 2016 with {term}",
  "my wifi during {term} peak hours",
];

const FORUM_TEMPLATES = [
  "Is {term} still cool in 2016? pls answer fast",
  "How do i survive school while obsessed with {term}",
  "Best apps for {term} content?",
  "Need advice: {term} ruined my sleep schedule",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function tokensFrom(input: MemoryInput, query: string) {
  const combined = `${input.interests}, ${input.dayFeel}, ${query}`
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => part.split(" "))
    .map((word) => word.toLowerCase())
    .filter((word) => word.length > 2);

  const unique = Array.from(new Set(combined));
  if (unique.length > 0) {
    return unique.slice(0, 10);
  }

  return ["music", "school", "summer", "memes", "youtube"];
}

function fill(template: string, term: string) {
  return template.replace("{term}", term);
}

function sourceFor(type: ResultType) {
  if (type === "video") {
    return "ClipTube";
  }
  if (type === "tumblr") {
    return "Tumblrsphere";
  }
  if (type === "buzzfeed") {
    return "BuzzDaily";
  }
  if (type === "meme") {
    return "MemeBoard";
  }
  return "AnswerNest";
}

export function generateNostalgiaResults(input: MemoryInput, query: string): NostalgiaResult[] {
  const terms = tokensFrom(input, query);

  return Array.from({ length: 15 }, (_, index) => {
    const type = TYPES[index % TYPES.length];
    const term = pick(terms);
    const fallbackTag = terms[(index + 2) % terms.length] ?? term;

    let title = "";
    let snippet = "";

    if (type === "video") {
      title = fill(pick(VIDEO_TEMPLATES), term);
      snippet = `Recorded at 240p. Comments fighting about ${fallbackTag}.`;
    } else if (type === "tumblr") {
      title = "text post // no one asked but";
      snippet = fill(pick(TUMBLR_TEMPLATES), term);
    } else if (type === "buzzfeed") {
      title = fill(pick(BUZZFEED_TEMPLATES), term);
      snippet = `contains quizzes, chaotic GIFs, and way too many references to ${fallbackTag}.`;
    } else if (type === "meme") {
      title = "reaction image thread";
      snippet = fill(pick(MEME_TEMPLATES), term);
    } else {
      title = fill(pick(FORUM_TEMPLATES), term);
      snippet = `highest voted answer says: "it depends, but ${fallbackTag} helps".`;
    }

    return {
      id: `${type}-${index}-${term}`,
      type,
      title,
      subtitle: `${sourceFor(type)} • ${pick(TIMESTAMPS)}`,
      snippet,
      source: sourceFor(type),
      timestamp: pick(TIMESTAMPS),
      tags: [term, fallbackTag, input.favoriteApps[0] ?? "2016"],
    };
  }).sort(() => Math.random() - 0.5);
}

export function chaosMessages(input: MemoryInput) {
  const anchor = input.favoriteApps[0] ?? "Vine";
  const firstInterest = input.interests.split(",")[0]?.trim() || "music";

  return [
    "This Vine is trending right now",
    "Take this quiz: What pizza are you?",
    "Someone just followed you",
    `${anchor} just sent you 9 notifications`,
    `New meme format about ${firstInterest}`,
    "Your friend posted 12 selfies in a row",
    "Forum reply: your question got 53 answers",
  ];
}
