"use client";

import type { FormEvent } from "react";

type SearchBarProps = {
  value: string;
  searching: boolean;
  compact?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SearchBar({ value, searching, compact = false, onChange, onSubmit }: SearchBarProps) {
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
      />
      <button type="submit" className="ns16-search-button" disabled={searching}>
        Search
      </button>
    </form>
  );
}
