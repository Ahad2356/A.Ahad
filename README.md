# Abdul Ahad — Full Stack Developer Portfolio

[![Vercel Deployment](https://img.shields.io/badge/Deployment-Vercel%20Ready-brightgreen?style=flat-square&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0.7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)](LICENSE)

Personal developer portfolio website of **Abdul Ahad**, Computer Science student and Full Stack Developer specialized in React, modern JavaScript, responsive interfaces, and interactive web experiences.

GitHub Profile: [https://github.com/Ahad2356/](https://github.com/Ahad2356/)  
GitHub Repository: [https://github.com/Ahad2356/A.Ahad](https://github.com/Ahad2356/A.Ahad)

---

## 🚀 Key Features

- **18-Agent Interactive Self-Building Animation:**
  - 18 autonomous agents with distinct hues, roles, and Bézier curved flight paths assemble the website live.
  - Section-by-section progressive reveals from the Navbar down through the Footer.
  - Interactive Start Experience (`Start Experience ↗`) and instant Skip Intro (`Skip Intro →`) controls.
  - Synthesized Web Audio API micro-tones (zero external audio files).
  - Keyboard shortcuts: <kbd>SPACE</kbd> (Start / Play / Pause), <kbd>R</kbd> (Replay), <kbd>A</kbd> (Auto-Glide), <kbd>ESC</kbd> (Skip Intro).

- **Featured Client Showcase:**
  - **LHS Cut (Hair & Beauty Salon):** Single project card featuring an interactive experience switcher between **Hair Experience** (`lhs_hair.webp`) and **Beauty Experience** (`lhs_beauty.webp`).
  - **Pioneer Solar Energy:** Clean energy web experience with solar capacity specs and preview (`pioneer.webp`).
  - **32 Dental Clinic & Implant Center:** Medical dental healthcare website showcase (`dental.webp`).

- **240-Frame Canvas Scroll Viewport:**
  - Smooth lerped 3D background animation synchronized with page scrolling.

- **Vercel-Ready Architecture:**
  - Root-level configuration with clean single-page app (SPA) rewrites via `vercel.json`.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, React Icons
- **Bundler & Tooling:** Vite 6
- **Graphics & Animation:** HTML5 Canvas, Web Audio API, CSS3 Glassmorphism
- **Hosting / Deployment:** Vercel (Production Ready)

---

## 📁 Project Structure

```
├── public/                     # Static assets
│   ├── frames/                 # 240 Canvas scroll animation frames
│   ├── images/
│   │   └── projects/           # Optimized WebP client screenshots
│   │       ├── lhs_hair.webp
│   │       ├── lhs_beauty.webp
│   │       ├── pioneer.webp
│   │       └── dental.webp
│   └── Abdul_Ahad_Resume.pdf
├── src/
│   ├── assets/                 # Icons & project thumbnail assets
│   ├── components/             # Reusable UI components
│   │   ├── About/
│   │   ├── CanvasScroll/
│   │   ├── Contact/
│   │   ├── DeveloperShowcase/
│   │   ├── Footer/
│   │   ├── Hero/
│   │   ├── Navbar/
│   │   ├── Projects/           # FeaturedProjects, ProjectCard, ExperienceSwitcher, ProjectModal
│   │   ├── SelfBuildingAnimation/ # 18-Agent engine, overlay, & controls
│   │   └── Skills/
│   ├── data/                   # Project metadata & certifications
│   ├── hooks/                  # Custom React hooks (useCanvasScrollEngine)
│   ├── pages/                  # Route views (Home, Projects, Services, Weather, Todo, About)
│   ├── styles/                 # Global styles, variables, typography
│   ├── App.jsx                 # Primary router definition
│   └── main.jsx                # Application mount point
├── index.html                  # HTML entry point with meta tags & Google Fonts
├── package.json                # Project dependencies and build scripts
├── vercel.json                 # Vercel SPA routing configuration
└── vite.config.js              # Vite server & route rewrite plugin
```

---

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ahad2356/A.Ahad.git

# Navigate into the project directory
cd A.Ahad

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
# Compile and optimize for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Vercel Deployment

This project is pre-configured for zero-config Vercel deployment:

1. Import this repository into [Vercel](https://vercel.com/new).
2. Framework Preset will automatically detect **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

All client-side routing is handled through the included `vercel.json`.

---

## 👤 Author

**Abdul Ahad**
- GitHub: [@Ahad2356](https://github.com/Ahad2356/)
- LinkedIn: [Abdul Ahad](https://www.linkedin.com/in/abdul-ahad-45b369300)
- WhatsApp: [+92 303 8702170](https://wa.me/qr/6OEY44RSXBNHB1)
- Email: [ii0555431@gmail.com](mailto:ii0555431@gmail.com)
