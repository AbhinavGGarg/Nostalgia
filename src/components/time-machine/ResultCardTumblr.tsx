"use client";

import type { NostalgiaResultTumblr } from "./nostalgia-search-data";

type ResultCardTumblrProps = {
  result: NostalgiaResultTumblr;
};

export function ResultCardTumblr({ result }: ResultCardTumblrProps) {
  return (
    <article className="search2016-card search2016-card-tumblr">
      <div className="search2016-card-label">TUMBLR FEELS</div>
      <p className="search2016-tumblr-quote">{result.quote}</p>
      <p className="search2016-tumblr-meta">
        <span>@{result.blog}</span>
        <span>{result.notes}</span>
      </p>
    </article>
  );
}
