# Architecture

How the portfolio is put together: entry points, routes, component tree, data flow and assets.

## Entry points

| File | Role |
| --- | --- |
| `index.html` | Document shell: meta tags, Google Fonts (Outfit + Caveat), SVG favicon, `<div id="root">`. |
| `src/main.jsx` | Mounts `<App />` into `#root` under `React.StrictMode`, imports `styles/global.css`. |
| `src/App.jsx` | `BrowserRouter`, the route-keyed `<SelfBuildingOverlay />`, global `<Navbar />`, `<main id="main-content">` and the route table. |
| `vite.config.js` | React plugin + a dev-only middleware that rewrites legacy `/projects`, `/services`, `/weather-app`, `/todo-app` HTML requests to `index.html` so the React routes are not shadowed. |

`styles/global.css` imports `variables.css`, so the design tokens (`--bright-red`, `--bg-dark`,
`--radius-*`, `--transition-*`) are available to every component stylesheet. Every component owns a
co-located CSS file next to its JSX.

## Routes

| Path | Component | Notes |
| --- | --- | --- |
| `/` | `pages/Home` | The animated homepage. |
| `/projects` | `pages/Projects` | All projects with category filter, tech matrix and stats. |
| `/projects/:id` | `pages/ProjectDetails` | Case study; unknown ids render an in-page 404. |
| `/services` | `pages/Services` | Service packages from `servicesData` + `workflowSteps`. |
| `/weather-app` | `pages/WeatherAppPage` | Interactive weather demo. |
| `/todo-app` | `pages/TodoAppPage` | Interactive todo demo. |
| `/about` | `pages/AboutPage` | Long-form about page. |
| `*` | `<Navigate to="/" replace />` | Catch-all. |

`ScrollToTop` in `App.jsx` resets scroll position on every pathname change.

Every one of those routes is built by the animation. `App.jsx` renders
`<SiteAnimationLayer />`, which is `<SelfBuildingOverlay key={pathname} />`: the key remounts the
component on navigation, its effect cleanup calls `engine.destroy()`, and the new instance discovers
the new page's real DOM. That is why the overlay lives in `App` and not in `Home` — a per-page mount
would leave `/services`, `/about` and the case-study pages with a static reveal or no controls at all,
and mounting two engines would stack two rAF loops on the same page.

## Homepage composition

```
Home
├── CanvasScroll          240-frame background canvas + loader overlay
└── .content-wrapper      z-index 10, above the canvas
    ├── Hero
    ├── About
    ├── Skills            3 panels: Technologies, Interests, Languages
    ├── FeaturedProjects  projects trio (LHS Cut, Pioneer, 32 Dental) + Certificates column
    ├── Contact
    └── Footer
```

The `Navbar`, the `Footer` and the construction stage all live above the route in `App.jsx`, because
the stage has to build the shared chrome too — which is why the engine discovers blocks across the
whole document rather than only inside the page component.

### Hero columns

`Hero.jsx` is a two-column grid. The left column carries the name lockup, bio, CTAs, tech badges and the
`DeveloperShowcase` terminal; the right column is `.hero-right`, a flex stack of the `quick-info-card`
and `HireMeSignature`. That stack is what closes the band that used to end ~200px above the terminal —
the signature panel fills it without resizing the quick-info card.

`HireMeSignature` is self-contained: one `requestAnimationFrame` loop, six labelled cursors that orbit the
`HIRE ME` button and periodically tighten into a squircle formation around it, velocity-derived trails,
and a magnetic pointer response that is only bound when the device reports `(hover: hover) and
(pointer: fine)`. Cursor count drops to four and the labels are hidden at ≤640px; under
`prefers-reduced-motion` it paints one static formation and never starts the loop. The crew labels are
capability names already used elsewhere on the site (React, Full Stack, WordPress, UI/UX, Web Dev, AI),
not invented collaborators. The button is a real anchor to LinkedIn — `LINKEDIN_URL` is exported from the
component and used with `target="_blank" rel="noopener noreferrer"`.

## Data flow

`src/data/projects.js` is the single source of truth. It exports:

- `projects` — array of project objects.
- `certificates` — used by the Certificates column on the homepage.
- `servicesData` — used by `pages/Services`.
- `workflowSteps` — used by `pages/Services`.

Project object shape (fields are optional unless used by a card):

```js
{
  id, title, tagline, subtitle, category, description, overview, image,
  featured,          // shown under the FEATURED filter on /projects
  liveUrl,           // renders the Live Site / VISIT LIVE actions
  sourceUrl,         // renders the GitHub action on the case-study page
  detailsPath,       // /projects/:id
  interactiveRoute,  // in-portfolio demo instead of an external site
  role, timeline, status,
  location,          // "LOCATION SERVED" meta item on the case-study page (client projects)
  technologies: [],  // rendered as pills; mini cards show the first two
  features: [],      // case-study highlight list
  screenshots: [],   // section captures shown as a strip in the modal
  fullCapture,       // optional opt-in full-page capture (scrollable in the mockup)
  experiences: []    // optional [{ id, label, preview, screenshots, fullCapture }] → ExperienceSwitcher
}
```

Images are referenced two ways, deliberately:

- **`/images/projects/*.webp`** (in `public/`) — the client showcase captures. Per project there is a
  `-fold` image (above-the-fold, used on the card), one image per section (used in the modal strip)
  and a full-page image (the opt-in full capture). They are referenced by URL so they are not inlined
  into the JS bundle.
- **imported JPGs from `src/assets/images/`** — smaller in-repo screenshots; Vite hashes them at build
  time.

## Projects module

| Component | Responsibility |
| --- | --- |
| `FeaturedProjects` | Three-card homepage showcase + certificates. Card ids are fixed in `SHOWCASE_IDS`. |
| `ProjectCard` | Two renders: `mini` (homepage trio, 16:9 uncropped) and full (the `/projects` grid). Owns `previewSrc` and modal state. |
| `ExperienceSwitcher` | Tabs for multi-experience projects; calls `onSelect(previewUrl)`. Used by the card, the modal and the case-study page. |
| `ProjectModal` | Browser-chrome mockup. Shows the current preview, a strip of real section screenshots and an opt-in full-page capture (`.pm-viewport--scroll` makes the viewport scrollable instead of fitted). Esc closes, focus is trapped and restored, body scroll is locked, no iframe is loaded. |

**LHS Cut** is one project with `experiences: [Hair, Beauty]`, each carrying its own `preview`,
`screenshots` and `fullCapture`. The selected tab only changes which set of captures is shown — the
live site is untouched and no reload happens. During the build animation an agent clicks both tabs in
turn to demonstrate the switcher.

## Self-building animation

The stage, agents and timeline are described in [`ANIMATION-SYSTEM.md`](ANIMATION-SYSTEM.md). The only
contract between the animation and the rest of the app is markup:

- `[data-block]` — a section-level unit the engine reveals.
- `[data-b="text" | "box"]` — an individual element inside a block; `text` gets the typewriter reveal,
  `box` gets a click/stamp.

Adding a new section therefore requires no engine changes: mark it up and it joins the sequence, the
camera stop numbering and the status line.

Three integration points beyond markup:

- **Camera hand-off.** Navigating away from a running build (for example through the navbar's
  `PROJECTS` route) dispatches `window.dispatchEvent(new CustomEvent('sb:handoff'))` from the
  `SelfBuildingOverlay` navigation listener. The engine's autopilot rewrites the scroll position
  every frame, so the overlay calls `skip()` to finalise the page and stop that tween before React
  Router swaps the route. This applies to every in-app navigation, not to a special navbar anchor.
- **HUD state sync.** The engine owns sound, slow-glide and speed. It reports changes back through the
  `onControls` callback, so shortcuts (`A`, `M`, speed) and HUD buttons can never disagree about what
  is currently on.
- **The ending is React's.** The engine finishes the page, flies the 18 agents into a ring and fires
  `onStateChange('finale')`; the emblem, the `ABDUL AHAD` reveal and the `HIRE ME` / `Enter portfolio`
  actions are ordinary JSX in `SelfBuildingOverlay.jsx`, so they are focusable and localisable without
  touching the engine. `HIRE ME` reuses the same anchor as the navbar: `#contact` on the homepage,
  offset by the fixed header, and `/` first when the ending plays on another route. `skip()` likewise
  dispatches `sb:skip`, which is how the Skip button, `ESC` and a navbar hand-off all reach the same
  `localStorage['sb.intro.skipped']` decision. See
  [`ANIMATION-SYSTEM.md`](ANIMATION-SYSTEM.md#the-ending).

## Scroll background

`CanvasScroll` + `hooks/useCanvasScrollEngine.js` drive a 240-frame WebP sequence pinned behind the
content. The playhead follows scroll progress with lerp smoothing, and only a bounded window of
`PREFETCH_WINDOW = 16` frames around it is requested (4 concurrent loads, nearest frame first). The
window slides as you scroll, so a visit that stays in the hero transfers ~1.4 MB rather than the full
~15 MB, and `backgroundEnabled` plus the reduced-motion path keep the canvas at frame 0 when it should
not run.

## Assets

| Path | Contents |
| --- | --- |
| `public/frames/ezgif-frame-001..240.webp` | The scroll background. Filenames are computed in `useCanvasScrollEngine`, so they must keep that exact zero-padded pattern. |
| `public/images/projects/` | Real captures from the deployed client sites: `*-fold` (card), per-section images (modal strip), full-page images (opt-in capture). |
| `src/assets/images/` | Screenshots imported by `data/projects.js`. |
| `public/Abdul_Ahad_Resume.pdf` | Served by the CV buttons in the hero and on `/projects`. |

The unversioned duplicates that previously sat in `public/` (root-level `ezgif-frame-*.webp` and
redundant JPG copies) are gone; `public/frames/` and `src/assets/images/` are the only live copies.

## Styling conventions

- Class names are component-scoped (`.project-card`, `.sb-hud`, `.hero-*`) with a handful of shared
  helpers in `global.css` (`.section-container`, `.section-tag`, `.btn-primary`, `.btn-secondary`).
- Layout is CSS Grid/Flexbox; breakpoints are `1200 / 1100 / 1024 / 820 / 768 / 640 / 580 / 480`px.
- Motion uses `transform` and `opacity` only, so animation stays on the compositor.
