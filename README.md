# Abdul Ahad — Personal Portfolio

[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

## Project overview

Personal portfolio of **Abdul Ahad**, Computer Science student and Full Stack Developer working with
React, modern JavaScript and WordPress. This repository contains the complete source of the deployed
site — a responsive, animated React single-page application.

### Links

- Live portfolio: [https://aahad-buddy.vercel.app/](https://aahad-buddy.vercel.app/)
- GitHub profile: [@Ahad2356](https://github.com/Ahad2356/)
- Repository: [Ahad2356/A.Ahad](https://github.com/Ahad2356/A.Ahad)

---

## What this project is

A single-page React portfolio with a cinematic **self-building intro**: 18 animated agents draw
wireframes, "type" real headlines and stamp real components into place, section by section, from the
navbar down to the footer. When the sequence ends the page is the normal, fully interactive
portfolio — nothing is replaced with placeholder content and nothing stays hidden.

The self-building concept is inspired by [ravi-paribrajak.vercel.app](https://ravi-paribrajak.vercel.app/);
the implementation, visual identity, palette, typography and copy are this project's own.

## Features

- **Self-building animation on every route** — the construction layer is mounted once in `App.jsx`
  keyed by pathname, so `/`, `/projects`, a case-study page, `/services`, `/about` and both demo pages
  are each assembled from their own real DOM. The homepage walks its 8 sections; any other page is
  grouped into camera stops automatically and labelled from its own headings (`02/03 · MILESTONES &
  CREDENTIALS`), with an explicit review pass before the ending.
- **Signature ending** — the 18 agents fly into a ring around the centre, an original emblem draws
  itself in the engine's own selection language (frame, corner handles, measurement rule, cursor dart),
  then `ABDUL AHAD` appears letter by letter and `HIRE ME ↗` scrolls to the real contact section. The
  card retires on `HIRE ME`, `Enter portfolio`, `ESC` or after 11 s, whichever comes first.
- **Animated Hire Me area** — in the hero's right column, six labelled cursors (React, Full Stack,
  WordPress, UI/UX, Web Dev, AI) orbit a `HIRE ME ↗` button in the site's own red/orange palette,
  periodically tightening into a formation around it and leaving short velocity trails. The button is a
  real link that opens `https://www.linkedin.com/in/abdul-ahad-45b369300/` in a new tab
  (`rel="noopener noreferrer"`). Cursors never overlap the button text or the name lockup, the swarm
  freezes while the build animation still has the block as a wireframe, and it holds one static
  composition under `prefers-reduced-motion`. Note the two `HIRE ME` buttons are different by design:
  the ending card scrolls to `#contact`, the hero panel goes to LinkedIn.
- **Controls** — `Start Experience ↗`, `Skip Intro →`, play/pause, replay, slow-glide auto scroll,
  playback speed (1x / 1.75x / 2.5x), mute, live layer counter and section status. The counter always
  prints the number of tagged elements that really exist in the DOM.
- **Skip is remembered** — pressing Skip (button, `ESC` or a navbar hand-off) stores
  `localStorage['sb.intro.skipped']`, so the intro does not replay on another route or on the next
  visit. A discreet `Replay Build Animation ↻` chip clears the decision and rebuilds the page.
- **Keyboard** — `SPACE` start/pause (or replay once finished), `R` replay, `A` slow-glide toggle,
  `M` mute, `ESC` skip. Shortcuts step aside when they would break something else: while typing in an
  input, textarea or contenteditable, while a modal dialog owns the keyboard, while a focused control
  needs `SPACE` to activate it, and for any `Ctrl`/`Cmd`/`Alt` combination.
- **Synthesized audio** — Web Audio API micro-tones generated at runtime; no audio files shipped.
- **240-frame scroll background** — a WebP frame sequence drawn to `<canvas>`, lerped against scroll
  position. Only a ±16-frame window around the playhead is fetched (4 concurrent requests), and the
  window slides as you scroll, so a visit that never leaves the hero transfers ~1.4 MB instead of the
  whole ~15 MB sequence.
- **Client showcase** — LHS Cut (one card, Hair/Beauty experiences), Pioneer Solar Energy and
  32 Dental Clinic, each with a real fold capture, verified live link, section screenshots and an
  opt-in full-page capture inside a browser-window mockup. Every number, price and address shown is
  quoted from the deployed site; none of it is invented.
- **Navigation** — every navbar item is a React Router route, including `PROJECTS` → `/projects`
  (the full catalogue page). The active state follows the URL, so Back/Forward, refreshes and direct
  links all agree with what is rendered. The homepage still has its Featured Projects section,
  reachable by scrolling or through "EXPLORE ALL PROJECTS".
- **Accessibility & performance** — `prefers-reduced-motion` renders the finished site immediately,
  with no intro card, HUD, replay chip or ending card for an animation that cannot run; touch targets
  on the intro buttons meet the site's 44 px minimum; `requestAnimationFrame` loops are suspended while
  the tab is hidden; listeners, tweens and timers are cleaned up on unmount; GPU-friendly transforms
  only.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 18.3, React Router 6.28, react-icons 5.4 |
| Build | Vite 6 with `@vitejs/plugin-react` |
| Graphics | HTML5 Canvas, CSS transforms, Web Audio API |
| Hosting | Vercel (SPA rewrites in `vercel.json`) |

No animation library is used — the engine is ~1.3k lines of plain JavaScript on `requestAnimationFrame`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build locally
```

Node 18+ and npm are enough. The project has no environment variables and no secrets.

## Project structure

```
.
├── public/
│   ├── frames/                 # 240 scroll-animation WebP frames (ezgif-frame-001..240)
│   ├── images/projects/        # optimised project screenshots (WebP)
│   └── Abdul_Ahad_Resume.pdf
├── src/
│   ├── assets/images/          # screenshots imported by the data layer
│   ├── components/
│   │   ├── About/              # About section
│   │   ├── CanvasScroll/       # pinned 240-frame canvas background
│   │   ├── Contact/            # contact cards + mailto form
│   │   ├── DeveloperShowcase/  # hero code/terminal showcase
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── HireMeSignature/     # hero cursor-swarm panel + LinkedIn Hire Me button
│   │   ├── Navbar/             # desktop nav + mobile drawer
│   │   ├── Projects/           # FeaturedProjects, ProjectCard, ExperienceSwitcher, ProjectModal
│   │   ├── SelfBuildingAnimation/  # engine, overlay, HUD, ending card
│   │   └── Skills/             # skills / interests / languages panels
│   ├── data/projects.js        # projects, certificates, services, workflow
│   ├── hooks/useCanvasScrollEngine.js
│   ├── pages/                  # Home, Projects, ProjectDetails, Services, About, Weather, Todo
│   ├── styles/                 # global.css, variables.css
│   ├── App.jsx                 # router, navbar, route-keyed animation layer
│   └── main.jsx
├── documentation/
│   ├── ARCHITECTURE.md
│   ├── ANIMATION-SYSTEM.md
│   ├── reference-animation-audit.md
│   ├── portfolio-animation-integration-plan.md
│   ├── COMPLETION-REPORT.md
│   └── AUDIT-COMPLETION-REPORT.md
├── index.html
├── vercel.json
└── vite.config.js
```

## Documentation

- [`documentation/ARCHITECTURE.md`](documentation/ARCHITECTURE.md) — components, routes, data flow, assets.
- [`documentation/ANIMATION-SYSTEM.md`](documentation/ANIMATION-SYSTEM.md) — how the self-building
  engine works, how to tune it, and which performance decisions matter.
- [`documentation/reference-animation-audit.md`](documentation/reference-animation-audit.md) —
  evidence-driven audit of the reference site's animations.
- [`documentation/portfolio-animation-integration-plan.md`](documentation/portfolio-animation-integration-plan.md)
  — how those behaviours map onto this portfolio.
- `COMPLETION-REPORT.md` and `AUDIT-COMPLETION-REPORT.md` — implementation, QA and verification records.

## Deployment

This repository is prepared for Vercel; the site is **not** deployed by this repository update itself.
`vercel.json` rewrites every path to `index.html` so client-side routes survive a refresh and direct
URL access. Expected Vercel settings for this Vite SPA:

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

The application uses **no environment variables** and contains no secrets, so no Vercel environment
configuration is required. Pushing to a Vercel-connected branch may trigger an automatic deployment;
that behaviour belongs to the existing Vercel project integration and is not changed here.

## Author

**Abdul Ahad** — Lahore, Pakistan
[GitHub](https://github.com/Ahad2356/) · [LinkedIn](https://www.linkedin.com/in/abdul-ahad-45b369300) ·
[Email](mailto:ii0555431@gmail.com)
