export type FavoriteApp = "Instagram" | "Snapchat" | "Musical.ly" | "Vine" | "YouTube";

export type PersonalityVibe =
  | "funny"
  | "aesthetic"
  | "chaotic"
  | "introverted"
  | "edgy"
  | "soft"
  | "main-character"
  | "daydreamer"
  | "gamer"
  | "romantic"
  | "hype";

export type UserProfile = {
  ageIn2016: number;
  favoriteApps: FavoriteApp[];
  favoriteContent: string;
  vibe: PersonalityVibe;
};

export type FeedPlatform = "instagram" | "tumblr" | "twitter";

export type FeedItem = {
  id: string;
  platform: FeedPlatform;
  handle: string;
  caption: string;
  timestamp: string;
  likes?: number;
  notes?: number;
  reposts?: number;
  imageUrl?: string;
  mood: string;
};

export type CollapseStage = 0 | 1 | 2 | 3;
