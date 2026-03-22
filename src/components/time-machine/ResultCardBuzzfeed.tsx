"use client";

import type { NostalgiaResultBuzzfeed } from "./nostalgia-search-data";

type ResultCardBuzzfeedProps = {
  result: NostalgiaResultBuzzfeed;
};

export function ResultCardBuzzfeed({ result }: ResultCardBuzzfeedProps) {
  return (
    <article className="search2016-card search2016-card-buzzfeed">
      <div className="search2016-card-label">BUZZ ARTICLE</div>
      <h3>{result.headline}</h3>
      <ul>
        {result.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  );
}
