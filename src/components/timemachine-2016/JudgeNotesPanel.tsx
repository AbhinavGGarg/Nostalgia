"use client";

export function JudgeNotesPanel() {
  return (
    <details className="tmx-judge-panel">
      <summary>Sprint Notes for Judges</summary>

      <section>
        <h3>Problem Relevance</h3>
        <p>
          Users describe modern social media as optimized but emotionally tiring. This section recreates the imperfect,
          low-stakes 2016 web feeling to explore how authenticity and playful chaos can increase delight.
        </p>
      </section>

      <section>
        <h3>Target User + Pain Points</h3>
        <ul>
          <li>Users who miss exploratory, less-algorithmic internet behavior.</li>
          <li>Users who want personalized nostalgia, not generic throwback content.</li>
          <li>Users who disengage from polished feeds but still enjoy social web culture.</li>
        </ul>
      </section>

      <section>
        <h3>Design Decisions</h3>
        <ul>
          <li>Memory input is transformed into personalized mixed-format results (video, memes, forum, tumblr).</li>
          <li>Transition sequence with glitch/audio creates emotional context before content appears.</li>
          <li>Intentional inconsistency in cards and layout mirrors 2016 internet imperfection.</li>
          <li>Chaos controls and sound controls protect usability while preserving atmosphere.</li>
        </ul>
      </section>

      <section>
        <h3>Iteration Progression</h3>
        <ol>
          <li>Built core nostalgia flow (input to transition to mixed feed).</li>
          <li>Added personalization engine and fake platform modals.</li>
          <li>Added chaos popups, mini-game, and immersion audio.</li>
          <li>Added accessibility + edge-case handling (ESC modal close, loading states, filters, controls).</li>
        </ol>
      </section>

      <section>
        <h3>Feasibility</h3>
        <p>
          Uses generated content and lightweight client-side logic with no mandatory external APIs, making this reliable
          for hackathon demos and fast to deploy.
        </p>
      </section>
    </details>
  );
}
