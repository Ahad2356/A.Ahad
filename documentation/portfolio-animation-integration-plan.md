# Portfolio Animation Integration Plan

**Date:** 2026-11-19
**Status:** Implementation complete; this document records the mapping that was applied.
**Basis:** `documentation/reference-animation-audit.md` (evidence-driven reverse engineering) + full inspection of the local React/Vite project.

---

## 1. Guiding constraints

1. **Do not rebuild.** The portfolio already exists (`ahad-portfolio`, React 18 + Vite 6 + React Router 6). A prior session had already integrated a substantial animation system; this plan preserves and completes it.
2. **Preserve all content and uncommitted work.** Git status showed extensive in-progress changes (new project imagery, signature components, engine improvements). None were reverted, overwritten, staged, or committed.
3. **Adapt, don't copy branding.** The reference spells "RAVI / FOLLOW"; this portfolio correctly spells "ABDUL AHAD" / "HIRE ME" with its own red/blue identity. Animation *mechanics* were ported, not the reference's personal content.
4. **No new runtime dependencies.** The engine uses vanilla rAF + Web Audio + Canvas 2D. No GSAP/Framer added (confirmed none in `package.json`).

---

## 2. Mapping: reference behavior → portfolio component → implementation

| Reference animation (audit ID) | Portfolio component / target | Implementation approach | Status |
|---|---|---|---|
| 18 cursor agents, curved Bézier flight, role labels (A3, A4) | `SelfBuildingEngine` → `#sb-stage` (rendered by `SelfBuildingOverlay`) | `createAgents()` builds 18 DOM agents with arrow/cross/I-beam SVGs; `moveTo()` reproduces the perpendicular-bend quadratic Bézier; `drift()` reproduces orbit/wander with the same easing constants. | Verified live (18 agents observed) |
| Wireframe measurement boxes (A5) | `wireJob()` overlay | `makeWireframe()` draws 4 handles + live `W × H` label, grows with eased tween, `.out` fade + 220 ms removal. | Verified (24 wires observed) |
| Character-by-character typing (A6) | `splitAndType()` on `[data-b="text"]` | TreeWalker wraps chars in `.sb-char`, reveals progressively, I-beam tracks last char, original `innerHTML` restored (DOM byte-identical). | Verified |
| Box click + stamp reveal (A8) | `resolveJob()` on `[data-b="box"]` | Agent moves to element, `.click()` shockwave, `.sb-resolved` class; CSS handles opacity/filter transition. | Verified |
| Progress HUD / layer counter (A9) | `SelfBuildingOverlay` HUD | `onProgress` callback mirrors coarse state into React (never per-frame); bar width from ratio; status from `onStatus`. | Verified (3→42→89 of 110) |
| Auto scroll tour + manual hand-off (A11) | `runTour()` / `setupScrollWatcher()` | Viewport-grouped camera stops, `scrollToY()` on shared clock, wheel/touch hands camera back for 2.2 s. | Verified (scrollY 0→803→2253) |
| Scan line / review beat (A2) | `runReview()` | Full-viewport scan sweep + 3 inspector flights after blocks complete. | Implemented |
| Color pick moment (A10) | Intentionally adapted out | Reference picks the brand accent live; this portfolio has a fixed brand identity (red/blue). Reintroducing a picker would alter branding — deliberately omitted per constraint 3. | Design decision |
| Finale swarm spelling words (A16) | `ParticleSignature` component (home) + `runFinale()` ending card | Swarm mechanics ported (offscreen rasterisation → hex-grid sampling → spring-damper integrators → white-outlined cursor sprites, pointer repulsion, adaptive particle count). Words are "ABDUL AHAD"/"HIRE ME"/emblem, not the reference's. | Verified source; rendered on home |
| Space start/pause/replay (A12) | engine `setupKeyListeners()` + HUD button | Context-sensitive: not started → `start()`; running → `togglePause()`; finished → `replay()`. Guards for inputs/modals/modifiers. | Verified |
| R replay (A13) | `replay()` | In-memory reset (no `location.reload()`) — deliberate improvement: generation bump clears timers/tweens/workers, resets classes and clock. | Verified source |
| A: auto-scroll during build (A14) | `toggleAutoScroll()` | During build: toggles `autoOn`. | Verified live |
| A: slow-glide after finish (A15) | **NEW `runGlide()`** (this session) | `finished` → `cruise()` reconstruction: scroll to top (900 ms), wait 450 ms, linear top→bottom at ~0.17 px/ms. Added `sb-gliding` class to disable global CSS smooth scroll so tweened `scrollTo` writes land exactly (the reference has no global smooth scroll). Cleaned on replay/skip/destroy. | **Fixed & verified live** (scrollY 34→213→459→807→1237) |
| Sound synthesis (sfx) | engine `tone/tick/pop/chord/whoosh` | Web Audio oscillators, unlocked on gesture, mute via M key / HUD. | Implemented |
| Reduced-motion (§7) | `SelfBuildingOverlay` + CSS | Engine not instantiated; `sb-complete` added so page renders finished and static. | Verified source |
| Mobile / coarse pointer (§7) | ParticleSignature adaptive count + CSS media queries | Particle caps, touch handling, responsive HUD; no horizontal overflow. | Verified live at 390 px |
| Ambient CSS keyframes (A18) | existing portfolio CSS | Retained the portfolio's own ambient animations; no unrelated effects injected. | Preserved |

---

## 3. Files involved

**Modified this session (targeted, minimal):**
- `src/components/SelfBuildingAnimation/SelfBuildingEngine.js` — added `runGlide()`, made `A` context-sensitive, added `sb-gliding` lifecycle cleanup.
- `src/components/SelfBuildingAnimation/SelfBuildingOverlay.jsx` — recognize `gliding` state in HUD guard.
- `src/components/SelfBuildingAnimation/SelfBuildingOverlay.css` — `html.sb-building, html.sb-gliding { scroll-behavior: auto; }`.

**Created this session:**
- `documentation/reference-animation-audit.md`
- `documentation/portfolio-animation-integration-plan.md` (this file)

**Pre-existing / preserved (not rewritten):** all page components, `ParticleSignature`, `HireMeSignature`, project data, imagery, global styles, `package.json`, `vercel.json`, and all uncommitted changes including staged deletions of superseded frame assets.

---

## 4. Verification performed

- `npm run build` — passes (87 modules, no errors) after each change.
- Live CDP inspection at 1280×800 and 390×844 — intro card fits, no horizontal overflow, content readable.
- End-to-end build run — 18 agents, wireframes, progressive 110-layer reveal across 9 section stops, scroll tour.
- Slow-glide — verified scroll advances at the reference rate after pressing `A` post-finish.
- `document.hidden` pause behavior confirmed (animation correctly freezes in a background tab — a performance feature, not a bug).

---

## 5. Deferred / not implemented (with reasons)

- **Live accent picker (`C` key):** would overwrite the portfolio's established brand color; conflicts with content-preservation rule.
- **`H` clean-UI / `1/2/3` speed keys:** the reference has them, but this portfolio exposes equivalent controls via the HUD (speed cycle, mute, glide) and adds `Esc` skip; adding all reference keys would risk conflicts with router/browser shortcuts. The meaningful experiential controls are all present.
- **Full `location.reload()` replay:** replaced with an in-memory generation-based reset, which is functionally equivalent from the visitor's perspective and avoids a flash/re-fetch.

These are conscious adaptations documented in the audit, not omissions caused by the investigation being incomplete.
