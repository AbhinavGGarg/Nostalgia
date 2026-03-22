"use client";

import { FakeInjectedContent } from "./fake-injected-content";
import { ResultItem } from "./result-item";
import type { NostalgiaResult, RealResult } from "./types";

type ResultsListProps = {
  items: NostalgiaResult[];
  savedIds: Set<string>;
  onToggleSave: (item: RealResult) => void;
  onSimulateOpen: (item: RealResult) => void;
};

export function ResultsList({ items, savedIds, onToggleSave, onSimulateOpen }: ResultsListProps) {
  return (
    <section className="ns16-results">
      {items.map((item, index) => {
        if (item.kind === "real") {
          return (
            <ResultItem
              key={item.id}
              item={item}
              index={index}
              isSaved={savedIds.has(item.id)}
              onToggleSave={onToggleSave}
              onSimulateOpen={onSimulateOpen}
            />
          );
        }

        return <FakeInjectedContent key={item.id} item={item} />;
      })}
    </section>
  );
}
