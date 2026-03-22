# 2016 Time Machine — Design Process Notes

## 1. Problem Framing

### Core Problem
Modern social platforms feel polished, optimized, and algorithm-heavy, which can reduce spontaneity and emotional authenticity.

### Opportunity
Create a search-powered nostalgia experience that recreates the imperfect, chaotic feel of 2016 internet culture while staying lightweight and demo-ready.

## 2. Target Users and Pain Points

1. Young adults nostalgic for mid-2010s internet culture.
2. Users overwhelmed by modern algorithmic feeds.
3. Hackathon judges evaluating emotional impact, interaction quality, and feasibility.

Pain points addressed:
1. Generic nostalgia pages are not personally meaningful.
2. Modern interfaces feel too clean to evoke old-web emotion.
3. Many prototypes look good visually but lack experiential depth.

## 3. Design Goals

1. Personalization from user memory input.
2. Strong transition moment (rewind/glitch/VHS) to signal emotional context switch.
3. Mixed, inconsistent content cards to simulate real 2016 web chaos.
4. Fast, no-login, no-external-API demo reliability.

## 4. Ideation and Tradeoffs

### Concepts considered
1. Full old-social clone
2. Static nostalgia gallery
3. Search-powered mixed-web simulator (chosen)

### Why concept 3 won
1. More feasible for hackathon timelines.
2. Supports personalization better than static galleries.
3. Keeps legal/product risk lower than direct platform clones.

## 5. Iteration Timeline

1. V1: Input -> transition -> mixed feed shell.
2. V2: Personalized fake-result generation by memory terms.
3. V3: Chaos popups, sound system, and modal platform simulations.
4. V4: UX/accessibility pass (loading feedback, filters, escape-to-close modal, controllable chaos intensity).
5. V5: Judge-facing panel documenting rationale and feasibility.

## 6. Feasibility and Delivery Strategy

1. Client-side generated content avoids backend/API dependence.
2. Simple deterministic templates keep output stable in demos.
3. Route isolation (`/timemachine`, `/2016`) avoids regressions to existing site areas.
4. High-fidelity styling delivered with scoped `tmx-*` classes.

## 7. Accessibility and UX Checklist

1. Form validation with explicit error messages.
2. Search status text with `aria-live`.
3. Modal supports click-outside and Escape key close.
4. User controls for audio and chaos intensity.
5. Reduced-motion behavior inherited from global preference rules.

## 8. Suggested Evidence to Add Before Final Pitch

To maximize rubric score, append the following from your own sprint work:
1. 2-3 direct user quotes from tests/interviews.
2. 1-2 case-study references used in decision making.
3. A short metric from playtesting (example: completion rate, average time in experience, repeat engagement).
