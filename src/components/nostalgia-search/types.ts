export type RealResult = {
  id: string;
  kind: "real";
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
};

export type InjectedResult = {
  id: string;
  kind: "youtube" | "tumblr" | "buzzfeed";
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  imageUrl?: string;
};

export type NostalgiaResult = RealResult | InjectedResult;

export type SearchApiPayload = {
  query: string;
  provider: "serpstack" | "tavily" | "bing" | "youtube" | "fallback";
  results: RealResult[];
  warning?: string;
};
