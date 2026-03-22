export type MemoryInput = {
  interests: string;
  dayFeel: string;
  favoriteApps: string[];
};

export type ResultType = "video" | "tumblr" | "buzzfeed" | "meme" | "forum";

export type NostalgiaResult = {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  snippet: string;
  source: string;
  timestamp: string;
  tags: string[];
};

export type ChaosPopup = {
  id: number;
  text: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};
