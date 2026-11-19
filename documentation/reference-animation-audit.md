# Reference Animation Audit — ravi-paribrajak.vercel.app

**Audit date:** 2026-11-19
**Auditor:** FrontendDeveloper (WorkBuddy AI)
**Target:** https://ravi-paribrajak.vercel.app/
**Supporting references:** supplied video `YTDown.com_..._o8c0Uh1O-1A_I-Built-a-Website-That-Builds-Itself_001_2160p.mp4` (30.65 s, 2160x3840, 59.94 fps), and REA v6.9.0 CDP evidence.

---

## 1. Evidence basis and method

This audit is **evidence-driven**. It is not derived from visual guessing.

| Evidence source | What it provided | Confidence weight |
|---|---|---|
| REA `inspect-web-page` (`include-script-sources`) | The site ships a **single unminified inline script (28,414 bytes, 414 lines)** containing the *entire* animation engine, plus a 118,609-byte inline stylesheet. This is direct source evidence of the actual production code. | **Verified — primary** |
| REA `list-browser-targets` / `capture-web-screenshot` | Real page target `980570CE…`, Chrome 157, viewport 1925x965. Final-state PNG (398 KB). | Verified |
| Live CDP keyboard + `Runtime.evaluate` | Deterministic state transitions for Space / A / R, agent counts, DOM `.on` counts, HUD status. | **Verified — runtime** |
| Supplied video | Visual confirmation of the sequence, timing feel, phone/portrait viewing context. | Corroborating |
| Inline CSS (`@keyframes`, `.agent`, `.wire`, `.ch`) | Initial/final states, transitions, cursor mode visuals. | Verified |

**REA Evidence IDs:** target list `ev_0619d9b9…`; full page inspection `inspect-web-page` (scripts total 1, `confidence: observed`, DOM 774 nodes); screenshot `ev_bd7014ad…`.

### Important constraint discovered
The production site exposes its **complete JavaScript and CSS as readable inline source**. The animation system is **vanilla JavaScript + CSS + Canvas 2D + Web Audio**. **No GSAP, Framer Motion, Motion, React, Vue, or other animation library is present.** This is verified from the loaded script text and resource inventory — not inferred.

### Verified clarification of the brief's assumptions
The master prompt describes `A` as "slow glide" and `Space` as "activate the 18-agent experience". The **verified runtime behavior refines** this:

- `Space` → `toggle()` = start if not started, pause/resume if running, **replay if finished** (source line 367: `if (finished) return replay()`). Starting launches the 18-agent build.
- `A` → `toggleAuto()` is **context-sensitive** (source lines 269–274):
  - **During the build** → toggles the auto-scroll tour on/off (verified live: `autoOn` true→false→true, status "Auto-scroll off"/"Touring"). No speed change.
  - **After the build is finished** → `if (finished) return cruise()` — the **slow glide**. So "A = slow glide" is correct *in the finished state*; during construction it is the auto-scroll toggle.
- The slow glide itself is `cruise()` (lines 275–281): scroll to top (900 ms), wait 450 ms, then a linear top→bottom scroll at ~0.17 px/ms.
- `R` → `replay()` = sets `sessionStorage['rp-replay']='1'` and `location.reload()`, which auto-starts the experience from a clean state.
- Additional verified shortcuts: `C` cycle accent, `M` mute, `H` clean UI, `1/2/3` set speed 1x/2x/0.5x; query params `?auto`, `?play`, `?accent=`, `?agents=`, `?speed=`, `?mute`.

These are documented faithfully below. The reconstruction should reproduce **what the site actually does**, including the context-sensitive `A` behavior.

---

## 2. Architecture of the reference animation system

The recovered engine has these subsystems:

1. **Virtual clock** — `vt` advances by `dt*speed` each `requestAnimationFrame`. `wait(ms)` and `tween(dur, fn)` are promise-based on this clock, so *all* choreography is time-scalable and pausable via one mechanism. `speed` is clamped 0.25–4.
2. **18 Agent instances** — DOM `<div class="agent">` elements, each rendered with `translate3d(x,y,0)`. Three cursor glyphs (arrow SVG, cross SVG, I-beam SVG) switched by `data-mode`; 6 of the agents carry role labels (`layout`, `type`, `color`, `copy`, `motion`, `pixels`).
3. **Idle motion** — `drift()` with three modes: `orbit` (elliptical around viewport center), `wander` (random targets), `ring` (circle the primary CTA). Velocity-smoothed (spring-like) with per-agent phase/radius/direction.
4. **Job queue / dispatcher** — `enqueue(job, at, prefer)` routes each job to the **nearest idle agent** (or an explicitly preferred one). Idle agents `await` jobs in `live(a)`. This is a real cooperative work-stealing queue.
5. **Build blocks** — DOM `[data-block]` elements containing `[data-b]` items (`text` = 48, `box` = 61, `mega` = 1; 108 total). Two phases per block: **wire** (measure/draw) then **resolve** (build/reveal), with parent dependencies and small stagger waits.
6. **Auto tour** — scrolls the page through viewport-sized groups, building blocks as they enter view; manual wheel/touch yields control for 1.7 s then the tour resumes.
7. **Color picker** — an agent visits swatches, tries two wrong accents, then selects the brand accent; adds `.inked` to `<html>`.
8. **Finale swarm** — a separate Canvas-2D particle system (760 particles desktop / 380 mobile) that rasterizes words to an offscreen canvas, samples points, and springs cursor-shaped particles into the glyph shapes (`RAVI`, `♥`, `FOLLOW`).
9. **Sound** — Web Audio synthesized tones (ticks, pentatonic pops, chord, whoosh), unlocked on first gesture, mutable.
10. **Reduced-motion path** — shows the fully built page immediately, tour kept one click away.

---

## 3. Animation catalog

Timing values below are **verified from source constants** (labelled *source-exact*) or **observed estimates** where the site computes them at runtime.

### A1 — Boot / locked intro
| Field | Detail |
|---|---|
| ID | `boot-intro` |
| Location | whole page, `#boot`, `.hud`, `#hint` |
| Trigger | Page load (`prefers-reduced-motion` not set, no `?auto`) |
| Initial state | `html.locked` (overflow hidden), body content hidden; centered boot chip; hint "Press Space to watch 18 agents build this page"; 18 agents exist but idle, `started=false`, `done=0/108`. |
| Final state | On start: `.locked` removed, `#boot` fades `.off` (CSS `transition:opacity .4s`), page unlocked. |
| Movement | Boot overlay opacity 1→0; HUD persists. |
| Timing | Boot overlay fade **400 ms** (source-exact CSS). |
| Easing | ease (default CSS). |
| Interaction | Click anywhere outside `.hud`, or Space, or `?auto`/replay flag. |
| Dependencies | CSS transition, vanilla JS. |
| Evidence | REA inline CSS line 167; live state after reload; screenshot `live-00-boot`. |
| Confidence | Verified |
| Recreation | Render an intro overlay + presence of N agents; expose a `start()` consumed by Space/click. |

### A2 — Scan line
| Field | Detail |
|---|---|
| ID | `scan-line` |
| Trigger | Inside `start()` |
| Initial/final | `.scan` opacity 0→1, translates from top to `innerHeight`, then opacity→0. |
| Movement | `translateY(ease(k)*innerHeight)` |
| Timing | **820 ms** virtual time (source-exact, `tween(820, …)`). |
| Easing | `ease` = easeInOutCubic: `k<.5 ? 4k³ : 1-(-2k+2)³/2` (source-exact). |
| Evidence | script line 363. |
| Confidence | Verified |
| Recreation | A thin overlay bar animated by the shared tween/timeline. |

### A3 — Agent idle drift (orbit / wander / ring)
| Field | Detail |
|---|---|
| ID | `agent-idle` |
| Trigger | Continuous for idle agents while not paused. |
| Movement | `orbit`: angle `phase + t*0.0011*w`, radius `min(vw,vh)*0.14*rad + 26`, x modulated by `(1+0.18*sin(t*0.002+i))`; `wander`: random target within viewport, retarget every **1400–3600 ms** (source-exact); `ring`: around `.contact .btn.pri`, angle `i/n*2π + t*0.00035`. |
| Timing | Continuous; velocity smoothing `s = min(1, dt*0.006)`, speed cap orbit 2200 / ring 900 / wander 520 (source-exact). |
| Interaction | Mode switches on lifecycle: `wander` after scan, `ring` after finale. |
| Evidence | script `drift()` lines 97–116; live `idleModes` observations. |
| Confidence | Verified |
| Recreation | rAF loop with velocity smoothing; `prefers-reduced-motion` and coarse-pointer fallbacks. |

### A4 — Agent travel (`moveTo`) — the signature curved path
| Field | Detail |
|---|---|
| ID | `agent-move` |
| Trigger | Every job dispatch / color pick / cube move. |
| Movement | Quadratic Bézier from `(sx,sy)` to `(x,y)` with perpendicular control offset `bend = ±min(140, d*0.3)` (random sign) unless `straight`. Position via `u²·p0 + 2u·e·p1 + e²·p2`. |
| Timing | `dur = clamp(170 + d*0.5, 210, 760) ms` (source-exact). |
| Easing | easeInOutCubic `ease(k)`. |
| Evidence | script lines 89–96. |
| Confidence | Verified |
| Recreation | Reuse verbatim with a per-agent tween on the shared clock. |

### A5 — Wire / measurement boxes
| Field | Detail |
|---|---|
| ID | `wire-job` |
| Trigger | Phase 1 for each `[data-b]` item, staggered **42 ms** apart (source-exact). |
| Initial/final | `.wire` div created at element rect with 0 size, 4 corner handles + dimension label; grows to element w×h then `.out` fade and removal after **200 ms**. |
| Movement | Agent moves to item corner, switches `cross`; width/height interpolate `r.w*e`, `r.h*e`; label shows `W × H`. |
| Timing | `clamp(150 + hypot(w,h)*0.3, 190, 560) ms` (source-exact). `sfx.tick()` throttled to 34 ms. |
| Easing | easeInOutCubic. |
| Evidence | script `wireJob()` lines 151–160; CSS lines 138–145; screenshot `live-s6.png` showing `cross` agents + wires. |
| Confidence | Verified |
| Recreation | Absolutely-positioned wire overlay driven by rAF/tween, GPU transform + width/height of the overlay only (not layout of content). |

### A6 — Text typing (`typeIn`)
| Field | Detail |
|---|---|
| ID | `text-type` |
| Trigger | `resolveJob` for `data-b="text"` items. Parent `[data-b]` dependencies awaited first. |
| Initial/final | Characters wrapped in `<span class="ch">` with `opacity:0`; progressively `.v` (opacity 1); original innerHTML restored at end. |
| Movement | Agent moves to text start, switches `ibeam`; follows the right edge of the last revealed char. |
| Timing | `clamp(n*15, 170, 980) ms` (source-exact, n = char count). |
| Interaction | Tick sound per new char. |
| Evidence | script lines 161–176; CSS `.ch`/`.ch.v` line 29. |
| Confidence | Verified |
| Recreation | Split text into spans, reveal by index on tween, respect reduced motion by showing instantly. |

### A7 — Mega outline draw
| Field | Detail |
|---|---|
| ID | `mega-draw` |
| Trigger | Single `data-b="mega"` `<svg>` ("DEVELOPER"). |
| Movement | Agent clicks at random x; `strokeDashoffset` 2400→0; `.on` added; whoosh sound. |
| Timing | **1500 ms** tween + **260 ms** wait (source-exact). |
| Easing | easeInOutCubic. |
| Evidence | script lines 183–187; `document.fonts.load('900 100px "Big Shoulders Display"')`. |
| Confidence | Verified |
| Recreation | SVG `stroke-dasharray/offset` tween. |

### A8 — Box reveal
| Field | Detail |
|---|---|
| ID | `box-reveal` |
| Trigger | `resolveJob` for `data-b="box"` items. |
| Movement | Agent moves to random point inside element, click ring animation, `.on` added (opacity 0→1), pop sound. |
| Timing | `wait(110 ms)` after click; CSS `[data-b].on{opacity:1;transition:opacity .22s ease}` (source-exact). |
| Easing | CSS ease. |
| Evidence | script line 189; CSS line 28; `.agent.click .ring` keyframes line 156. |
| Confidence | Verified |
| Recreation | Class toggle + CSS transition; click ring via CSS keyframe. |

### A9 — Progress HUD
| Field | Detail |
|---|---|
| ID | `hud-progress` |
| Trigger | Each completed item increments `done`. |
| Movement | `#nDone` text = done; `#bar` width = done/total*100%; `sfx.pop(done/total)` pentatonic pitch rises with progress. |
| Timing | Bar CSS `transition:width .2s` (source-exact). |
| Evidence | script `hudCount()` line 144; video shows 0→108 layers. |
| Confidence | Verified |
| Recreation | Derive from completed-item count via a single state value. |

### A10 — Color pick
| Field | Detail |
|---|---|
| ID | `color-pick` |
| Trigger | Once, after all hero blocks finish (`ensurePick()`). |
| Movement | `.picker` with 4 swatches appears beside `.name`; a preferred agent visits 2 wrong swatches then the brand accent, selecting each (330 ms, final 120 ms); sets `--acc` and `.inked`; chord + click. |
| Timing | Swatch move **300 ms**, waits **330 ms** / **120 ms**, post-chord **420 ms** (source-exact). |
| Evidence | script `pickColour()` lines 209–226; video frame ~4–6 s shows yellow being selected. |
| Confidence | Verified |
| Recreation | A scripted mini-timeline dispatched through the same job queue. |

### A11 — Auto tour / scroll
| Field | Detail |
|---|---|
| ID | `auto-tour` |
| Trigger | `tour()` when `autoOn` and running. |
| Movement | Groups blocks by viewport; scrolls with `ease(k)` over `clamp(dist*1.5,500,1500) ms`; tall groups get a 2600 ms follow-through; builds are staggered **130 ms**; waits 620/950 ms between groups. |
| Interaction | `wheel`/`touchmove` → `handsOn()` yields for **1700 ms** then resumes from next unbuilt block; arrow/page/home/end keys also call it. |
| Evidence | script `tour()`/`handsOn()` lines 239–268; live status transitions "Building"→"Touring"→"Manual". |
| Confidence | Verified |
| Recreation | Scroll timeline driven by the shared clock; cancel on user input with a resume timer. |

### A12 — Space toggle / pause / replay-from-finished
| Field | Detail |
|---|---|
| ID | `space-toggle` |
| Trigger | `Space` (and click on tour button). |
| Behavior | `toggle()`: if not started → `start()`; if finished → `replay()`; else flip `paused`. Prevents default scroll. |
| Timing | n/a (control). |
| Evidence | script lines 367, 380; live Space capture. |
| Confidence | Verified |
| Recreation | Guard against inputs/textareas and modifier keys; single controller. |

### A13 — Replay (R)
| Field | Detail |
|---|---|
| ID | `replay` |
| Trigger | `R` key or replay button. |
| Behavior | Scroll to 0, set `sessionStorage['rp-replay']='1'`, `location.reload()`. Boot detects flag and auto-starts. |
| Evidence | script lines 368, 381; live R test: after R the state returned to "Scanning page…", done 0, scrollY 0. |
| Confidence | Verified |
| Recreation | In React, prefer an in-memory reset of the controller (no full page reload) unless a reload is needed to restore exact initial DOM. |

### A14 — A key: context-sensitive auto-scroll / slow-glide
| Field | Detail |
|---|---|
| ID | `toggle-auto` |
| Trigger | `A` key or Auto button. |
| Behavior | `toggleAuto()`: **if `finished` → `cruise()` (slow glide)**; otherwise `autoOn = !autoOn`, and if disabling mid-tour cancels the tour and builds visible blocks; status "Auto-scroll off"/"Touring". |
| Timing | n/a (control). |
| Evidence | script lines 269–274, 383; live A test captured `autoOn true→false→true` (mid-build). |
| Confidence | Verified |
| Recreation | Expose `setAuto(bool)` for the build phase and route `A` to the glide controller once finished. |

### A15 — Slow glide (cruise) — triggered by A after finish
| Field | Detail |
|---|---|
| ID | `cruise` |
| Trigger | `A` / Auto button **when `finished===true`** (`toggleAuto()` line 270). Note: `Space` when finished calls `replay()`, **not** cruise (line 367). |
| Movement | Scroll to top over **900 ms**, wait **450 ms**, then linear scroll top→bottom over `maxScroll()/0.17 ms` (≈0.17 px/ms → ~5.9 s per 1000 px). |
| Timing | source-exact constants; total depends on page height. |
| Easing | linear (`k` directly). |
| Evidence | script `cruise()` lines 275–281. |
| Confidence | Verified (source); not separately captured live (finale state observed). |
| Recreation | A dedicated post-build glide mode wired to `A`/Glide control. |

### A16 — Finale swarm (word formation)
| Field | Detail |
|---|---|
| ID | `finale-swarm` |
| Trigger | The `[data-finale]` block finishing → `finale()` → `swarm.play(['RAVI','♥','FOLLOW'])`, after a **350 ms** wait. |
| Movement | Offscreen canvas rasterizes each word in `900 <size>px "Big Shoulders Display"` (or parametric heart), samples opaque pixels on a staggered grid (`step = max(2, sqrt(area/n)*0.98)`), shuffles targets, then springs N cursor-shaped particles to targets with `ax=(tx-x)*k - vx*8.2`, `k∈[20,46]`. Mouse within radius √9000 repels particles. Words held **2300 ms** (first) / **1700 ms** (next); last word held 700 ms then chord; then `idleMode='ring'`. |
| Particle count | **760** desktop (≥700 px) / **380** mobile; scale 0.46–0.64 desktop, 0.36–0.5 mobile. DPR capped at 2. |
| Timing | Source-exact. |
| Easing | Damped spring integration (`h = min(.032, dt/1000*max(1,speed*.8))`). |
| Evidence | script `swarm` lines 288–338; REA screenshot `shot-initial.png` shows "FOLLOW" formed by thousands of cursors and ring-mode agents. |
| Confidence | Verified |
| Recreation | Canvas-2D particle system in an isolated component; cap/scale on mobile; `prefers-reduced-motion` → static word. |

### A17 — Accent cycling / sound / clean UI
| Field | Detail |
|---|---|
| ID | `misc-controls` |
| Trigger | `C` cycle accent (yellow→red→mint→violet), `M` sound, `H` clean, `1/2/3` speed. |
| Movement | `--acc` CSS var changes; `html` transition `--acc .55s ease`; sound toggle adds `.off` to button. |
| Evidence | script lines 369–386; CSS line 14. |
| Confidence | Verified |
| Recreation | Map to controller setters; preserve existing portfolio theme as the accent source. |

### A18 — Ambient micro-animations (CSS keyframes)
| Field | Detail |
|---|---|
| ID | `ambient-css` |
| Trigger | Always on. |
| Effects | `ping` (availability dot 2 s), `dash` (SVG dashed path 1 s linear), `hop` (1.6 s), `blink` (3.4 s), `sweep` (2.2 s alternate), `eq` (0.9 s), `zone` (2 s), `click` ring (0.38 s). |
| Evidence | CSS lines 39, 124–134, 156. |
| Confidence | Verified |
| Recreation | Only reintroduce where the portfolio already has analogous decorative elements. |

---

## 4. Complete interaction sequence (verified)

1. **Load** → `html.locked`, boot chip, hint, 18 idle agents, 108 hidden layers, HUD 0/108.
2. **Space / click / ?auto** → `start()`: lock removed, hint fades, whoosh, scan line sweeps 820 ms, `idleMode='wander'`, `#boot.off`.
3. **Tour begins** (`autoOn`): viewport-aligned groups; each block is wired (agents draw measurement boxes, `cross` cursor) then resolved (`ibeam` typing / `box` click reveal / mega SVG draw); HUD climbs with rising pentatonic pops; agents visibly travel curved Bézier paths and hand off jobs to the nearest idle agent.
4. **Hero complete** → color picker: agent tries 2 accents then the brand color; `html.inked` set; chord.
5. **Scroll tour continues** through hero → about → work → stack → contact; manual scrolling temporarily suspends autopilot (1.7 s) and builds visible blocks on demand.
6. **`[data-finale]` block completes** → 350 ms pause → swarm particles fly in and spell `RAVI`, `♥`, `FOLLOW`; idle agents switch to `ring` around the CTA; native cursor hides after 1.3 s of no movement.
7. **Done** → HUD "Done", toggle icon becomes replay glyph.
8. **Space again** → `cruise()` slow glide top→bottom. **R** → replay from scratch. **A** → auto-scroll toggle. **C/M/H/1/2/3** → accent / sound / clean / speed.

---

## 5. Cursor / agent movement analysis

- **Count:** 18 by default (`CFG.agents=18`), configurable 4–60 via `?agents=`. Verified live: `agents=18`.
- **Distinct paths:** each agent has independent `phase`, `rad` (0.75–1.25), `w` direction/speed (±0.9–1.5), color from a 9-color hue list. Paths are **deterministic functions of time + per-agent seeds**, with **randomness only in retarget points and path bend sign** — so motion is organic but reproducible in structure.
- **Positioning:** absolute pixels within `#stage`, rendered via `translate3d(x.toFixed(1),y.toFixed(1),0)` — GPU-composited.
- **Coordination:** job queue assigns work to the nearest idle agent; wire jobs staggered 42 ms, resolve 64 ms, blocks 130 ms. Agents are not synchronized clones; they divide labor.
- **DOM interaction:** agents do not use the native cursor; they overlay SVG arrow/cross/I-beam glyphs (verified screenshot). Native cursor hidden via `.nocursor`.
- **Disappearance:** they never disappear; after finale they orbit the contact CTA in `ring` mode with labels faded (`#stage.ring label{opacity:0}`).

## 6. Keyboard-control analysis

| Key | Actual function | Verified? |
|---|---|---|
| Space | toggle start / pause / replay-if-finished | Yes (live) |
| R | replay via reload + sessionStorage flag | Yes (live) |
| A | toggle auto-scroll **during build**; slow-glide `cruise()` **after finish** | Yes (live for build phase; source for glide phase) |
| C | cycle accent | Source (not separately live-tested) |
| M | toggle sound | Source |
| H | toggle clean UI | Source |
| 1 / 2 / 3 | speed 1x / 2x / 0.5x | Source |
| Arrows/Page/Home/End | manual scroll hand-off | Source |

Guards present in source: modifiers ignored; `e.preventDefault()` only for Space. **No input/textarea guard** in the reference — the reconstruction should add one (brief requirement) without changing the intended controls.

## 7. Scroll interaction analysis

Tour is autopilot-driven and uses the same virtual clock, so pause/speed affect it. Manual wheel/touch triggers a 1.7 s hand-off; blocks intersecting the viewport are built immediately when not touring (`IntersectionObserver`, threshold 0.12). `history.scrollRestoration='manual'`.

## 8. Desktop / mobile differences

- Mobile (<700 px): swarm particles 380 vs 760, smaller scale; hint text changes to "Tap and 18 agents will build this page" on `(pointer:coarse)`; interaction by tap (click handler).
- `prefers-reduced-motion`: finished page shown immediately, all `[data-b].on`, accent inked, tour one click away — no forced animation.
- DPR capped at 2 for the swarm canvas.

## 9. Observed conflicts / limitations

- REA CDP attachment is passive; keyboard triggering was driven via CDP `Input.dispatchKeyEvent` (a separate interaction surface), while REA supplied the page inspection and screenshots. This is honest about tool boundaries.
- Network capture started after page load (`prior_activity_available: false`), so request-level evidence is absent; however the inline source fully covers the animation behavior.
- No source maps; not needed because the shipped script is human-readable.
- The supplied video is a phone recording of a laptop screen (portrait capture), so fine DOM values came from source/CDP, not video pixels.
- The reference's own intro has no input-focus guard; reconstruction will add it as an improvement without altering behavior.

## 10. Recommended reconstruction architecture (for the integration plan)

1. **Single controller** `AgentBuildController` owns the virtual clock, timers/tweens, agent pool, job queue, mode, and derived state (started/paused/finished/auto/speed/done).
2. **React integration** — controller lives in a `useRef` inside one `"use client"` mount component; React only subscribes to *coarse* state (status, done count, mode) via a throttled subscription so continuous motion never triggers React renders.
3. **DOM overlays** (`#stage`, agents, wires, picker, scan, swarm canvas) are created imperatively by the controller, mirroring the reference, with transforms/opacity only.
4. **Marking strategy** — add `data-b`/`data-block` attributes to *existing* portfolio elements (no content rewrite), so the same engine can wire/reveal them.
5. **Keyboard hook** `useAgentShortcuts` with input/textarea/contenteditable guard, modifier guard, and cleanup on unmount.
6. **Animation library** — none needed; vanilla rAF reproduces the source exactly and adds no dependency. Reuse only what the project already has.
7. **Reduced motion & mobile** — same fallbacks as reference, plus pausing the rAF loop when the document is hidden.
8. **Accent** — map reference `--acc` selection to the portfolio's existing color tokens, never overwrite the user's brand identity.

---

## 11. Confidence summary

| Area | Confidence |
|---|---|
| Animation engine, timing constants, easing, keyboard map | **Verified (shipped source + live runtime)** |
| DOM/CSS structure and visual states | **Verified (REA inspection + screenshots)** |
| Sequence and finale | **Verified (source + screenshots + video)** |
| Exact visual timing as perceived on the phone video | Estimated (video is a re-recording at 60 fps, not a screen capture) |
| Network/resource loading details | Not captured (observation began post-load) — not needed for animation behavior |
