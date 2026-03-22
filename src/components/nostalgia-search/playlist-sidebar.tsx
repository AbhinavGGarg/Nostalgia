"use client";

import { useMemo, useState } from "react";

type Song = {
  id: string;
  title: string;
  artist: string;
  year: string;
  youtubeId: string;
};

const SONGS: Song[] = [
  { id: "closer", title: "Closer", artist: "The Chainsmokers ft. Halsey", year: "2016", youtubeId: "PT2_F-1esPk" },
  { id: "one-dance", title: "One Dance", artist: "Drake", year: "2016", youtubeId: "iAbnEUA0wpA" },
  { id: "work", title: "Work", artist: "Rihanna ft. Drake", year: "2016", youtubeId: "HL1UzIK-flA" },
  { id: "stressed-out", title: "Stressed Out", artist: "Twenty One Pilots", year: "2016", youtubeId: "pXRviuL6vMY" },
  { id: "cheap-thrills", title: "Cheap Thrills", artist: "Sia", year: "2016", youtubeId: "31crA53Dgu0" },
];

export function PlaylistSidebar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const currentSong = SONGS[currentIndex];

  const embedUrl = useMemo(() => {
    if (!playing) {
      return "";
    }

    return `https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&loop=1&playlist=${currentSong.youtubeId}&controls=1&modestbranding=1&rel=0`;
  }, [currentSong.youtubeId, playing]);

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setPlaying(true);
  };

  const next = () => {
    setCurrentIndex((value) => (value + 1) % SONGS.length);
    setPlaying(true);
  };

  const previous = () => {
    setCurrentIndex((value) => (value - 1 + SONGS.length) % SONGS.length);
    setPlaying(true);
  };

  const stop = () => {
    setPlaying(false);
  };

  return (
    <aside className="ns16-playlist">
      <div className="ns16-playlist-head">
        <p>2016 Playlist</p>
        <h3>Popular Songs</h3>
      </div>

      <div className="ns16-now-playing">
        <p>Now playing</p>
        <strong>{currentSong.title}</strong>
        <span>{currentSong.artist}</span>
      </div>

      <div className="ns16-player-controls">
        <button type="button" onClick={previous}>
          Prev
        </button>
        <button type="button" onClick={() => setPlaying((value) => !value)}>
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={next}>
          Next
        </button>
        <button type="button" onClick={stop}>
          Stop
        </button>
      </div>

      <div className="ns16-player-frame">
        {embedUrl ? (
          <iframe
            title="Nostalgia 2016 playlist player"
            src={embedUrl}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <p>Player paused. Press play to resume.</p>
        )}
      </div>

      <ul className="ns16-song-list">
        {SONGS.map((song, index) => (
          <li key={song.id}>
            <button
              type="button"
              className={index === currentIndex ? "is-active" : ""}
              onClick={() => playSong(index)}
            >
              <span>{song.title}</span>
              <small>
                {song.artist} • {song.year}
              </small>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
