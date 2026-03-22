"use client";

import Image from "next/image";
import type { NostalgiaResultMeme } from "./nostalgia-search-data";

type ResultCardMemeProps = {
  result: NostalgiaResultMeme;
};

export function ResultCardMeme({ result }: ResultCardMemeProps) {
  return (
    <article className="search2016-card search2016-card-meme">
      <div className="search2016-card-label">MEME DROP</div>
      <div className="search2016-meme-frame">
        <Image
          src={result.imageUrl}
          alt={result.caption}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover"
          style={{ filter: "contrast(1.22) saturate(1.32) blur(0.18px)" }}
        />
        <p className="search2016-meme-top">{result.topText}</p>
      </div>
      <p className="search2016-meme-caption">{result.caption}</p>
    </article>
  );
}
