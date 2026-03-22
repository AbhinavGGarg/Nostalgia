"use client";

import { FormEvent, useMemo, useState } from "react";
import type { RealResult } from "./types";

type ResultItemProps = {
  item: RealResult;
  index: number;
  isSaved: boolean;
  onToggleSave: (item: RealResult) => void;
  onSimulateOpen: (item: RealResult) => void;
};

export function ResultItem({ item, index, isSaved, onToggleSave, onSimulateOpen }: ResultItemProps) {
  const bump = (index % 4) - 1;
  const [openInline, setOpenInline] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openDiscussion, setOpenDiscussion] = useState(false);
  const [draftComment, setDraftComment] = useState("");
  const [comments, setComments] = useState<string[]>([
    "this is peak 2016 energy",
    "i forgot this existed omg",
  ]);
  const [likes, setLikes] = useState(214);
  const [reblogs, setReblogs] = useState(57);

  const youtubeVideoId = useMemo(() => {
    try {
      const url = new URL(item.url);
      if (url.hostname.includes("youtube.com")) {
        return url.searchParams.get("v");
      }
      if (url.hostname.includes("youtu.be")) {
        return url.pathname.replace("/", "");
      }
      return null;
    } catch {
      return null;
    }
  }, [item.url]);

  const isInstagram = item.url.includes("instagram.com");
  const isTumblr = item.url.includes("tumblr.com");
  const isForum = item.url.includes("reddit.com") || item.url.includes("forum") || item.url.includes("answers");

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = draftComment.trim();
    if (!trimmed) {
      return;
    }
    setComments((previous) => [trimmed, ...previous].slice(0, 8));
    setDraftComment("");
  };

  return (
    <article className="ns16-result" style={{ marginLeft: `${Math.max(0, bump) * 4}px` }}>
      <p className="ns16-result-url">{item.displayUrl}</p>
      <a className="ns16-result-title" href={item.url} target="_blank" rel="noreferrer">
        {item.title}
      </a>
      <p className="ns16-result-snippet">{item.snippet}</p>

      <div className="ns16-result-actions">
        <a className="ns16-inline-button" href={item.url} target="_blank" rel="noreferrer">
          Open Link
        </a>
        <button type="button" className="ns16-inline-button" onClick={() => setOpenPreview((value) => !value)}>
          {openPreview ? "Hide Preview" : "Nostalgia Preview"}
        </button>
        {youtubeVideoId ? (
          <button type="button" className="ns16-inline-button" onClick={() => setOpenInline((value) => !value)}>
            {openInline ? "Hide Video" : "Watch Video"}
          </button>
        ) : null}
        <button type="button" className="ns16-inline-button" onClick={() => setOpenDiscussion((value) => !value)}>
          {openDiscussion ? "Hide Thread" : "Open Thread"}
        </button>
        <button type="button" className={`ns16-inline-button ${isSaved ? "is-saved" : ""}`} onClick={() => onToggleSave(item)}>
          {isSaved ? "Saved" : "Save"}
        </button>
        <button type="button" className="ns16-inline-button" onClick={() => onSimulateOpen(item)}>
          Simulate Tab
        </button>
      </div>

      {youtubeVideoId && openInline ? (
        <div className="ns16-video-frame">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
            title={item.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : null}

      {openPreview ? (
        <section className="ns16-preview-box">
          {isInstagram ? (
            <div className="ns16-social-preview">
              <p>@throwback.feed</p>
              <p>grainy selfie filter + oversaturated vibes #2016</p>
              <div className="ns16-preview-actions">
                <button type="button" onClick={() => setLikes((value) => value + 1)}>
                  Like ({likes})
                </button>
                <button type="button" onClick={() => setComments((previous) => ["new comment dropped", ...previous])}>
                  Comment ({comments.length})
                </button>
              </div>
            </div>
          ) : null}

          {isTumblr ? (
            <div className="ns16-social-preview">
              <p>tumblr moodboard //</p>
              <p>nothing was perfect, that&apos;s why it felt real.</p>
              <div className="ns16-preview-actions">
                <button type="button" onClick={() => setReblogs((value) => value + 1)}>
                  Reblog ({reblogs})
                </button>
                <button type="button" onClick={() => setLikes((value) => value + 1)}>
                  Notes ({likes + reblogs})
                </button>
              </div>
            </div>
          ) : null}

          {!isInstagram && !isTumblr ? (
            <div className="ns16-social-preview">
              <p>{isForum ? "forum snapshot" : "old-web snapshot"}</p>
              <p>{item.snippet}</p>
              <div className="ns16-preview-actions">
                <a href={item.url} target="_blank" rel="noreferrer">
                  Open source tab
                </a>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {openDiscussion ? (
        <section className="ns16-thread-box">
          <p className="ns16-thread-title">2016 thread reactions</p>
          <form className="ns16-thread-form" onSubmit={submitComment}>
            <input value={draftComment} onChange={(event) => setDraftComment(event.target.value)} placeholder="drop your comment..." />
            <button type="submit">Post</button>
          </form>
          <div className="ns16-thread-list">
            {comments.map((comment, commentIndex) => (
              <p key={`${comment}-${commentIndex}`}>{comment}</p>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
