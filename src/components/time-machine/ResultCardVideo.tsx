"use client";

import Image from "next/image";
import type { NostalgiaResultVideo } from "./nostalgia-search-data";

type ResultCardVideoProps = {
  result: NostalgiaResultVideo;
};

function fakeDurationFromId(id: string) {
  const idNumber = Number.parseInt(id.replace(/[^0-9]/g, ""), 10) || 1;
  const minutes = 2 + ((idNumber * 3) % 8);
  const seconds = (idNumber * 17 + 21) % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function ResultCardVideo({ result }: ResultCardVideoProps) {
  return (
    <article className="search2016-card search2016-card-video">
      <div className="search2016-card-label">VIDEO RESULT</div>
      <div className="search2016-video-thumb">
        <Image
          src={result.imageUrl}
          alt={result.title}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
          style={{ filter: "contrast(1.16) saturate(1.14) sepia(0.08) blur(0.2px)" }}
        />
        <span className="search2016-video-duration">{fakeDurationFromId(result.id)}</span>
      </div>
      <h3>{result.title}</h3>
      <p className="search2016-video-meta">
        <span>{result.channel}</span>
        <span>{result.views}</span>
      </p>
    </article>
  );
}
