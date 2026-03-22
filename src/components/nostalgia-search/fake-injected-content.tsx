"use client";

import { useState } from "react";
import type { InjectedResult } from "./types";

type FakeInjectedContentProps = {
  item: InjectedResult;
};

export function FakeInjectedContent({ item }: FakeInjectedContentProps) {
  const [open, setOpen] = useState(false);

  if (item.kind === "youtube") {
    return (
      <article className="ns16-result ns16-injected ns16-injected-youtube">
        <p className="ns16-result-url">{item.displayUrl}</p>
        <a className="ns16-result-title" href={item.url} target="_blank" rel="noreferrer">
          {item.title}
        </a>
        <p className="ns16-result-snippet">{item.snippet}</p>
        <div className="ns16-result-actions">
          <a className="ns16-inline-button" href={item.url} target="_blank" rel="noreferrer">
            Open YouTube
          </a>
          <button type="button" className="ns16-inline-button" onClick={() => setOpen((value) => !value)}>
            {open ? "Hide Card" : "Watch Preview"}
          </button>
        </div>
        {open ? (
          <div className="ns16-preview-box">
            <div className="ns16-social-preview">
              <p>2016 recommended video</p>
              <p>{item.snippet}</p>
            </div>
          </div>
        ) : null}
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
        <div className="ns16-result-actions">
          <a className="ns16-inline-button" href={item.url} target="_blank" rel="noreferrer">
            Open Tumblr
          </a>
        </div>
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
      <div className="ns16-result-actions">
        <a className="ns16-inline-button" href={item.url} target="_blank" rel="noreferrer">
          Open Article
        </a>
      </div>
    </article>
  );
}
