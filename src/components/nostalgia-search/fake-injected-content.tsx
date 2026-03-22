"use client";

import type { InjectedResult } from "./types";

type FakeInjectedContentProps = {
  item: InjectedResult;
};

export function FakeInjectedContent({ item }: FakeInjectedContentProps) {
  if (item.kind === "youtube") {
    return (
      <article className="ns16-result ns16-injected ns16-injected-youtube">
        <p className="ns16-result-url">{item.displayUrl}</p>
        <a className="ns16-result-title" href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
        <p className="ns16-result-snippet">{item.snippet}</p>
      </article>
    );
  }

  if (item.kind === "tumblr") {
    return (
      <article className="ns16-result ns16-injected ns16-injected-tumblr">
        <p className="ns16-result-url">{item.displayUrl}</p>
        <a className="ns16-result-title" href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
        <p className="ns16-result-snippet">{item.snippet}</p>
      </article>
    );
  }

  return (
    <article className="ns16-result ns16-injected ns16-injected-buzzfeed">
      <p className="ns16-result-url">{item.displayUrl}</p>
      <a className="ns16-result-title" href={item.url} target="_blank" rel="noreferrer">
        {item.title}
      </a>
      <p className="ns16-result-snippet">{item.snippet}</p>
    </article>
  );
}
