"use client";

import { FakeInjectedContent } from "./fake-injected-content";
import { ResultItem } from "./result-item";
import type { NostalgiaResult } from "./types";

type ResultsListProps = {
  items: NostalgiaResult[];
};

export function ResultsList({ items }: ResultsListProps) {
  return (
    <section className="ns16-results">
      {items.map((item, index) => {
        if (item.kind === "real") {
          return <ResultItem key={item.id} item={item} index={index} />;
        }

        return <FakeInjectedContent key={item.id} item={item} />;
      })}
    </section>
  );
}
