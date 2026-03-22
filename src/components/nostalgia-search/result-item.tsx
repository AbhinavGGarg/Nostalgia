"use client";

import type { RealResult } from "./types";

type ResultItemProps = {
  item: RealResult;
  index: number;
};

export function ResultItem({ item, index }: ResultItemProps) {
  const bump = (index % 4) - 1;

  return (
    <article className="ns16-result" style={{ marginLeft: `${Math.max(0, bump) * 4}px` }}>
      <p className="ns16-result-url">{item.displayUrl}</p>
      <a className="ns16-result-title" href={item.url} target="_blank" rel="noreferrer">
        {item.title}
      </a>
      <p className="ns16-result-snippet">{item.snippet}</p>
    </article>
  );
}
