"use client";

import type { FormEvent } from "react";

type SearchBarProps = {
  value: string;
  searching: boolean;
  compact?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onLucky?: () => void;
};

export function SearchBar({ value, searching, compact = false, onChange, onSubmit, onLucky }: SearchBarProps) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={`ns16-search-form ${compact ? "ns16-search-form-compact" : ""}`} onSubmit={submit}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="ns16-search-input"
        placeholder="Search like it's 2016..."
        list="ns16-query-suggestions"
      />
      <datalist id="ns16-query-suggestions">
        <option value="top songs 2016" />
        <option value="vine compilation 2016" />
        <option value="old youtube gaming" />
        <option value="tumblr sad quotes 2016" />
        <option value="roblox videos 2016" />
      </datalist>
      <button type="submit" className="ns16-search-button" disabled={searching}>
        Search
      </button>
      {onLucky ? (
        <button type="button" className="ns16-search-button ns16-search-button-alt" onClick={onLucky} disabled={searching}>
          I&apos;m Feeling 2016
        </button>
      ) : null}
    </form>
  );
}
