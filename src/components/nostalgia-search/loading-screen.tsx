"use client";

type LoadingScreenProps = {
  message: string;
  flicker: boolean;
};

export function LoadingScreen({ message, flicker }: LoadingScreenProps) {
  return (
    <section className={`ns16-loading ${flicker ? "ns16-loading-flicker" : ""}`} aria-live="polite">
      <div className="ns16-loading-card">
        <p className="ns16-loading-label">NOSTALGIA SEARCH</p>
        <h2>{message}</h2>
        <p>Restoring old internet textures, low-res thumbnails, and forum threads...</p>
        <div className="ns16-loading-bar-wrap">
          <div className="ns16-loading-bar" />
        </div>
      </div>
    </section>
  );
}
