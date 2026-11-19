# Animation System

The self-building intro is a hand-written engine in
`src/components/SelfBuildingAnimation/`. There is no animation library.

| File | Contents |
| --- | --- |
| `SelfBuildingEngine.js` | Timeline clock, agent roster, job dispatcher, block discovery, tour director, review, finale formation, controls, cleanup. |
| `SelfBuildingOverlay.jsx` | Mounts the engine, renders the intro card, the control HUD, the replay chip and the signature ending, mirrors engine state into React. |
| `SelfBuildingOverlay.css` | Agent cursors, wireframes, reveal states, review scan line, intro card, HUD, ending emblem/lettering, responsive rules. |

The overlay is mounted **once, globally**, in `App.jsx` as
`<SelfBuildingOverlay key={pathname} />`. The key is what makes the tour cover every route: a route
change unmounts the previous engine (`destroy()` stops its loop and clears its timers) and mounts a
fresh one that discovers the new page's own DOM. Mounting it inside `Home.jsx` instead would have
limited the experience to one page and left every other route with no controls at all.

The hero's animated cursor swarm is the one other hand-written animation in the app. It lives in
`src/components/HireMeSignature/`, not in this folder, and touches the engine only by reading its reveal
classes — see *Consumers outside the engine* below. Neither file uses an animation library.

## Design in one paragraph

The engine does not animate a recording. It reads the real DOM, draws a wireframe box around each
real element, then reveals that same element — typing its real text character by character — and moves
on. Because the target is the live page, the animation always ends on the actual portfolio: no dummy
markup, no swap step, no content that can drift out of sync with the site.

## The virtual clock

Everything is scheduled against `vt`, a virtual millisecond clock advanced inside one
`requestAnimationFrame` loop:

```js
const dt = realDt * this.speed;   // playback multiplier (1 / 1.75 / 2.5)
this.vt += dt;
```

Scheduling primitives:

- `wait(ms)` → resolves when `vt` reaches `vt + ms`.
- `tween(duration, fn)` → calls `fn(progress)` with `progress` in `0..1` until it completes.

Because both are driven by `vt`, pausing freezes the whole sequence, speed changes apply to
everything at once, and replay just resets `vt` to `0`. Real `setTimeout` is never used for sequencing
(only for the final CSS-class settle), so nothing fires after a skip.

The loop skips all work when `document.hidden` is true and clamps `realDt` to 100 ms so a stalled tab
does not jump the timeline forward.

## Agent roster

18 agents, each a `<div>` holding three SVG cursors (arrow, cross, I-beam), a click shockwave ring and
a role badge. Hues come from an 18-entry palette, roles from a 12-entry list (Architect, Layout,
Typography, Interface, React Eng, Motion, Components, Styling, Assets, Canvas, Optimizer, State).

Each agent owns:

- `moveTo(x, y, { dur, straight })` — quadratic Bézier flight. The control point is offset
  perpendicular to the travel vector by a random bend, which is what makes paths look hand-drawn
  instead of linear. Duration scales with distance (`90 + dist * 0.22`, clamped `100–340 ms`).
- `drift(dt, t)` — idle orbiting around the viewport centre with a spring (`k = 4.2`, velocity capped
  at 950 px/s), so unused agents still feel alive without any per-agent timers.
- `render()` — writes only `transform: translate3d(...)`.

Position updates are written once per frame in the loop, never from React.

## Job dispatch

Agents are workers pulling from a queue, not a fixed script:

```js
const job = this.queue.shift() || await new Promise(res => this.waiters.push({ agent, res }));
```

`dispatch(fn, at, preferredAgent)` hands a job to a free agent, preferring the one closest to the
target rectangle. Two agents never draw the same element, work overlaps naturally, and blocks appear
in parallel because several agents are busy at once. This is the mechanism behind the "collaborating
agents" impression.

## Timeline

### Camera stops, not sections

`discoverBlocks()` scores every `[data-block]` and then merges consecutive blocks of the same score
that fit inside one viewport into a **camera stop** (`this.groups`). The tour iterates stops, so a tall
section becomes several short glides instead of one impossible jump, and the `0X/0Y ·` status numbering
comes from the same array the director actually iterates — the counter can never disagree with the
camera.

On the homepage the scores name its real sections; on every other route all blocks get one identical
score, which leaves the stable sort in DOM order (navbar → that page's sections → footer):

| Score | Homepage stage | Camera target |
| --- | --- | --- |
| 10 | Navbar | top of page |
| 20 | Hero | top of page |
| 30 | About | `#about` − 70 |
| 40 | Skills | `.three-panel-grid` − 70 |
| 50 | Certificates | `#certificates` − 80 |
| 60 | Featured Projects | `.projects-trio` − 80 |
| 70 | Contact | `#contact` − 70 |
| 80 | Footer | bottom of document |
| 100 | (non-home routes) | the block itself − 40 |

Status lines are prefixed with `pad2(index)/pad2(total)` from that route's stop list — `/services`
therefore reads `01/04 … 04/04`, not a hardcoded eight. The eight curated homepage sentences are gated
to `location.pathname === '/'`; everywhere else the label is the first `h1`/`h2`/`.section-tag` found
inside the stop's blocks (`/about` → `02/03 · MILESTONES & CREDENTIALS`), falling back to
`Assembling this page…` only when a stop genuinely contains no heading. Nothing labels a page with
content it does not have.

Per stop the camera glides to its target (auto-glide), then each block runs two phases:

1. **Wireframe** — an agent flies to the element, a dashed box with corner handles and a live
   `width × height` tag grows to the element's real size, following the agent.
2. **Resolve** — `text` items get a per-character typewriter reveal with an I-beam cursor; `box` items
   get a click shockwave and a stamp. The wireframe fades out and the layer counter advances.

Then `runReview()` runs the inspection beat: a 2px composited scan line sweeps the viewport over
820 ms while three agents fly straight inspection paths, status reading
`Reviewing layout, spacing & interactions…`. Only after the review does `runFinale()` start, so the
ending always plays regardless of block completion order.

## The ending

`runFinale()` is the engine's only involvement in the finale, and it is physical rather than visual:

1. `revealFinishedPage()` — force-resolve the real page (same routine Skip uses) and play a chord.
2. `onStateChange('finale')` — React renders the ending card; the engine owns no part of it.
3. `convergeAgents(gen)` — all 18 agents fly straight-line onto an ellipse around the current viewport
   centre (`rx = min(vw × 0.36, 430)`, `ry = min(vh × 0.3, 230)`), staggered by index, each clicking on
   arrival. That is the coordinated final arrangement: the crew assembling the signature.
4. `formationOn = true` — the main loop stops applying idle drift, which is what holds the ring steady
   while the card animates. The flag lives on the engine, not on each agent, because workers keep
   toggling their own `idle` flag mid-job.
5. An `FINALE_AUTO_DISMISS_MS` (11 s) safety timer arms, so the card can never trap a visitor.

`completeEnding()` is the single exit and is idempotent: the `HIRE ME` button, `Enter portfolio`, the
11 s timer and `ESC` can all fire it in any order, and only the first one clears `formationOn`, marks
`done` and fades the stage. `skip()` and `replay()` also clear the ending timer, so a skip during the
ending cannot let a stale timer rewrite the HUD of the next run.

The card itself (`SelfBuildingOverlay.jsx`) is deliberately **not** `aria-modal`: the real site is
already finished behind it, focus must be able to leave, and the engine's keyboard guard treats
`aria-modal="true"` as "a dialog owns the keys", which would stop `ESC` from retiring the card.

Its emblem is an original mark built from the animation's own vocabulary — a selection frame with four
corner handles, the `A` legs, a measurement rule with end ticks and a cursor dart as the apex — each
stroke drawn by `stroke-dashoffset` in sequence, then `ABDUL AHAD` letter by letter (`--i` stagger),
then the actions. `HIRE ME` calls `completeEnding()` and scrolls to the real `#contact` section,
offset by the fixed header; on any other route it mounts the homepage first and waits two frames for
layout before measuring, because `#contact` only exists there.

## Reveal states (CSS contract)

- `html.sb-building [data-block]` → `opacity: .12`, grayscale.
- `.sb-resolved` on a block or item → full opacity, no filter.
- `.sb-char` / `.sb-char.v` → typewriter characters, hidden until revealed.
- `html.sb-complete` → everything forced visible (used by the finale and by Skip).

### Consumers outside the engine

`HireMeSignature` (the animated cursor swarm in the hero) is not part of the engine and imports nothing
from it. It is a `[data-block]` like any other, so the engine discovers and reveals it, and it reads the
reveal classes back off the DOM to decide whether to move: while `html.sb-building` is set and its own
root has no `.sb-resolved`, the swarm freezes and hides its trails instead of orbiting behind a
12%-opacity panel. A `MutationObserver` on both `html` and its own root reopens the loop the moment the
block resolves. If you change those class names, that gate is the thing to update.

## Controls

| Control | Implementation |
| --- | --- |
| `Start Experience ↗` | `engine.start()` — discovers blocks, builds agents, starts the clock and the tour. |
| `Skip Intro →` | `engine.skip()` — bumps `tourGen` (killing in-flight tours), clears timers/tweens/queue, force-reveals everything, fades the stage. Then reports the real totals: `this.itemOf.size || document.querySelectorAll('[data-b]').length`, so skipping from the intro card shows `111 / 111` rather than `0 / 0`. |
| `SPACE` | Starts; pauses/resumes while running; replays once finished. |
| `R` | `replay()` — resets classes and `vt`, clears `started`, then `start()`. The `started = false` matters: `start()` early-returns while a run is still marked unfinished, so without the reset a replay after a finished or skipped run did nothing. |
| `A` | Toggles slow-glide auto scroll. |
| `M` | Mute (Web Audio gain only, no file I/O). |
| `ESC` | Skip — the same code path as the Skip button, including the stored preference. |
| Speed | Cycles 1x → 1.75x → 2.5x. |
| `HIRE ME ↗` | `completeEnding()` then scroll to the real `#contact` (from another route: mount `/` first). |
| `Enter portfolio →` | `completeEnding()` only. |
| `Replay Build Animation ↻` | Chip shown when the stored skip is suppressing the intro; clears the preference and calls `replay()`. |

`toggleAutoScroll()`, `cycleSpeed()` and `toggleSound()` each end with `emitControls()`, which calls the
`onControls` callback the overlay passes in. That is the only way HUD and keyboard stay in agreement —
React never guesses engine state, and pressing `A` or `M` updates the same button styling as clicking
them. The same callback also fires from the wheel/touch interrupt in `setupScrollWatcher()`, which drops
slow-glide for ~2.2 s so the visitor's own scroll is respected and then hands the camera back; an
explicit `A` during that window clears the pending restore, because a deliberate user toggle outranks an
interrupt timer.

Keyboard guards, in order, so shortcuts never break something else:

1. Ignore the event if `ctrlKey`/`metaKey`/`altKey` is down (`Ctrl+R` must still be a real browser
   reload, `Cmd+A` must still select).
2. Ignore it if the target is an `INPUT`, `TEXTAREA` or contenteditable element.
3. Ignore `SPACE` if a dialog owns the keyboard (`[aria-modal="true"]` is in the document) or if focus
   is on a control that activates with `SPACE` (`button`, `a[href]`, `select`, `[role="button"]`,
   `[tabindex]`) — otherwise the first Space after Tab would trigger both the button and the tour.
4. Otherwise `preventDefault()`, so Space cannot scroll the page mid-sequence.

`Skip Intro →` is also what the navbar uses. The `PROJECTS` link dispatches a `sb:handoff` custom event
before scrolling, and the overlay listens for it during an active run and skips. The engine's autopilot
rewrites `window.scrollTo` every frame, so releasing the camera is the only way a user-initiated jump
survives. `scrollToY()` is additionally gated on `tourGen`, so a jump started after a skip is never
fought over by jobs from the dead tour.

## Skip is remembered

A visitor who presses `Skip Intro` has answered the question "do you want to watch this?" — making them
answer it again on every route change and every reload is the difference between a signature and a
loading screen. `skip()` ends by dispatching a `sb:skip` window event, and the overlay listens for it
once per mount to write `localStorage['sb.intro.skipped'] = '1'`. Because the signal comes from the
engine rather than from the button, all three ways of skipping — the intro card, the HUD, the `ESC` key
and a navbar hand-off (`sb:handoff` → `skip()`) — persist identically, and the keyboard path cannot
leave the stored preference disagreeing with the page the visitor is looking at.

The preference is read **before the first paint** through a lazy `useState` initialiser, so a returning
visitor never sees the card flash and disappear. Storage access is wrapped in `try/catch`: in private
mode or with storage disabled the intro simply shows, because the preference is a courtesy, not a
dependency.

Two affordances take the decision back: the HUD's replay button while a run is live, and — when the
stored skip is suppressing the intro — the low-contrast `Replay Build Animation ↻` chip at the bottom
left. Pressing it removes the key, clears `skipRemembered` and replays, so from then on the intro
behaves as if it had never been dismissed. Watching a build to its ending and dismissing the card
(HIRE ME, Enter portfolio, the 11 s timer) does **not** write the preference: that visitor did not skip.

## Performance decisions

- **One rAF loop.** `startLoop()` cancels any existing `rafId` first. Without that guard, `replay()`
  would stack a second loop and run the sequence at double speed with double the render work.
- **Generational workers.** `createAgents()` bumps `agentGen`; `runAgentWorker(agent, gen)` exits as
  soon as the generation changes, so replays do not accumulate worker loops. Parked waiters are
  released with a no-op job before being cleared.
- **Compositor-only animation.** Agent movement is `translate3d`, the review scan line is a
  `translate3d` on one layer, the progress bar animates `width` once per completed layer.
- **No React re-render per frame.** The engine writes to the DOM directly; React only receives coarse
  callbacks (`onProgress`, `onStatus`, `onStateChange`, `onControls`). The HUD layer counter prints
  `layersCount.done / layersCount.total` straight from those callbacks — there is no made-up fallback
  number, and `total` is the count of `[data-b]` elements the engine actually found.
- **Layout reads are batched per job** (`getBoundingClientRect` at the start of a job), not per frame.
- **Reduced motion.** With `prefers-reduced-motion: reduce` the overlay never constructs the engine: it
  marks `html.sb-complete` on mount and renders neither the intro card, the HUD, the replay chip nor the
  ending card, because controls for an animation that cannot run are dead UI. The canvas hook draws
  frame 0 only. The ending CSS additionally has a `prefers-reduced-motion` block that pins every finale
  animation to its finished state, so nothing can be left at `opacity: 0` if that ever changes.
- **Safety net.** A 55 s timer in the overlay force-skips if frame scheduling stalls.
- **Middle-ground speeds.** Wireframe draws take 80–240 ms, typewriter runs are 70–340 ms depending on
  character count, section gaps are 100–150 ms and block staggering is 45 ms. The whole tour is
  designed to land in roughly 20–30 s, and every one of these numbers is a single clamp you can edit.

## How to tune it

| Goal | Where |
| --- | --- |
| Overall speed | `speed` (multiplier) or `cycleSpeed()` in the engine. |
| Cursor flight speed | `moveTo()` → `clamp(90 + dist * 0.22, 100, 340)`. |
| Wireframe draw speed | `wireJob()` → `clamp(70 + Math.hypot(w, h) * 0.13, 80, 240)`. |
| Typewriter speed | `splitAndType()` → `clamp(chars * 5, 70, 340)`. |
| Gap between stops | `runTour()` → `wait(g === 0 ? 220 : 150)`. |
| How wide a stop is | `discoverBlocks()` → the `vh - 40` merge window. |
| Review length | `runReview()` → `tween(820, ...)`. |
| Agent count | `this.numAgents = 18` (the `HUES` array has 18 entries). |
| Camera easing | `scrollToY()` → `clamp(dist * 0.55, 200, 560)`. |
| Ending ring size | `convergeAgents()` → `rx = min(vw * 0.36, 430)`, `ry = min(vh * 0.3, 230)`. |
| Ending patience | `FINALE_AUTO_DISMISS_MS` (11 000). |
| Emblem / name / CTA timing | `SelfBuildingOverlay.css` → the `--delay` / `--len` custom properties and `calc(1.42s + var(--i) * 48ms)`. |
| What gets built | Add `data-block` / `data-b` attributes in the JSX; stop order comes from `getSectionScore()`. |

## Adding a section

1. Mark the wrapper `data-block`.
2. Mark text elements `data-b="text"`, structural elements `data-b="box"`.
3. Nothing else. The stop joins the camera tour at its document position, the `0X/0Y` counter picks it
   up, and the status line reads its own `h1`/`h2`/`.section-tag`.

Section-specific camera anchors and the eight curated homepage sentences are optional refinements: add a
`closest(...)` selector to `getSectionScore()` (homepage only) and a branch in
`updateSectionStatus()` if a new homepage section deserves its own sentence.

Nothing else in the engine needs to change — discovery, ordering, camera targeting, status numbering
and progress counting are data-driven, and the same code builds `/services`, `/about`, a project detail
page or a demo app without knowing their names.
