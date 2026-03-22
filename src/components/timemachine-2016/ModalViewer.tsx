"use client";

import type { NostalgiaResult } from "./types";

type ModalViewerProps = {
  result: NostalgiaResult | null;
  onClose: () => void;
};

function variantFor(result: NostalgiaResult) {
  if (result.type === "video") {
    return "youtube";
  }
  if (result.type === "tumblr") {
    return "tumblr";
  }
  return "instagram";
}

export function ModalViewer({ result, onClose }: ModalViewerProps) {
  if (!result) {
    return null;
  }

  const variant = variantFor(result);

  return (
    <section className="tmx-modal-backdrop" onClick={onClose}>
      <article className="tmx-modal-card" onClick={(event) => event.stopPropagation()}>
        <header className="tmx-modal-header">
          <p className="tmx-pill">{`${variant.toUpperCase()} / SIMULATED`}</p>
          <button type="button" className="tmx-modal-close" onClick={onClose}>
            Close
          </button>
        </header>

        {variant === "youtube" ? (
          <div className="tmx-modal-platform tmx-youtube">
            <div className="tmx-youtube-player">▶</div>
            <h3>{result.title}</h3>
            <p>{result.snippet}</p>
            <div className="tmx-meta-row">
              <span>1.3M views</span>
              <span>uploaded in 2016</span>
              <span>comments: absolute chaos</span>
            </div>
          </div>
        ) : null}

        {variant === "tumblr" ? (
          <div className="tmx-modal-platform tmx-tumblr">
            <h3>text post // dashboard vibes</h3>
            <p className="tmx-tumblr-body">{result.snippet}</p>
            <div className="tmx-meta-row">
              <span>reblogs: 9,422</span>
              <span>notes: 13.4k</span>
              <span>tagged: #sad #neon #2016</span>
            </div>
          </div>
        ) : null}

        {variant === "instagram" ? (
          <div className="tmx-modal-platform tmx-instagram">
            <div className="tmx-instagram-post" />
            <h3>{result.title}</h3>
            <p>{result.snippet}</p>
            <div className="tmx-meta-row">
              <span>likes: 8,761</span>
              <span>filter: Valencia + too much contrast</span>
              <span>caption typo included</span>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}
