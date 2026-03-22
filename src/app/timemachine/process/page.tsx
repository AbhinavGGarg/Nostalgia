export default function TimeMachineProcessPage() {
  return (
    <main className="tmx-shell tmx-center">
      <section className="tmx-input-card" style={{ maxWidth: 980 }}>
        <p className="tmx-pill">DESIGN PROCESS</p>
        <h1 className="tmx-title">2016 Time Machine Sprint Notes</h1>
        <p className="tmx-subtitle">This page documents the ideation and iteration process for judging review.</p>

        <div className="tmx-form-grid">
          <section className="tmx-field">
            <span>Problem</span>
            <p>Users want social-web nostalgia that feels personal, imperfect, and emotionally real.</p>
          </section>

          <section className="tmx-field">
            <span>Why This Solution</span>
            <p>
              We chose a search-powered nostalgia engine instead of a static throwback page to maximize personalization
              and replayability while keeping implementation feasible in a hackathon window.
            </p>
          </section>

          <section className="tmx-field">
            <span>Iteration Steps</span>
            <ol>
              <li>Built input, transition, and mixed feed shell.</li>
              <li>Added personalization engine from memory text.</li>
              <li>Added chaos, sound, mini-game, and platform modals.</li>
              <li>Added accessibility and edge-case improvements.</li>
            </ol>
          </section>

          <section className="tmx-field">
            <span>Feasibility</span>
            <p>Client-generated content, isolated routes, and no mandatory external APIs make the demo reliable.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
