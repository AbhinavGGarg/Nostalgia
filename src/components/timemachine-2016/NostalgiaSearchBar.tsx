"use client";

import { useEffect, useState } from "react";

type NostalgiaSearchBarProps = {
  initialQuery: string;
  searching: boolean;
  onSearch: (query: string) => void;
};

export function NostalgiaSearchBar({ initialQuery, searching, onSearch }: NostalgiaSearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(query.trim() || initialQuery);
  };

  return (
    <section className="tmx-search-wrap">
      <form onSubmit={submit} className="tmx-search-form">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            window.dispatchEvent(new Event("tmx-type"));
          }}
          placeholder="Search like it's 2016..."
          className="tmx-search-input"
        />
        <button type="submit" className="tmx-search-button">
          Search
        </button>
      </form>

      {searching ? <p className="tmx-search-loading">Searching 2016 internet...</p> : null}
    </section>
  );
}
