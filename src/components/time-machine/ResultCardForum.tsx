"use client";

import type { NostalgiaResultForum } from "./nostalgia-search-data";

type ResultCardForumProps = {
  result: NostalgiaResultForum;
};

export function ResultCardForum({ result }: ResultCardForumProps) {
  return (
    <article className="search2016-card search2016-card-forum">
      <div className="search2016-card-label">FORUM / ANSWERS</div>
      <h3>{result.question}</h3>
      <p className="search2016-forum-asker">asked by {result.asker}</p>
      <p className="search2016-forum-answer">best answer: {result.bestAnswer}</p>
      <p className="search2016-forum-replies">{result.replies}</p>
    </article>
  );
}
