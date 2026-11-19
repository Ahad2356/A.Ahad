import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Services from './pages/Services';
import WeatherAppPage from './pages/WeatherAppPage';
import TodoAppPage from './pages/TodoAppPage';
import AboutPage from './pages/AboutPage';
import SelfBuildingOverlay from './components/SelfBuildingAnimation/SelfBuildingOverlay';

// Auto scroll to top upon navigating to a new route
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/*
 * The construction animation is mounted here, not inside Home, so it covers every
 * route: it discovers `[data-block]` markup in the live document, which means each
 * page is built from its own real content. `key={pathname}` remounts the layer per
 * route, and the unmount destroys the previous engine — so navigation can never
 * leave two tours, two agent rosters or two rAF loops running at once.
 */
function SiteAnimationLayer() {
  const { pathname } = useLocation();
  return <SelfBuildingOverlay key={pathname} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SiteAnimationLayer />
      <Navbar />
      <main id="main-content" tabIndex="-1">
        {/*
         * Single source of truth for navigation. Every navbar destination has a
         * real route here (including /projects), so URLs, active states, deep links
         * and Back/Forward stay in sync. /projects/:id renders a case study and
         * handles unknown ids itself; the catch-all redirects to home. Order does
         * not matter in v6 — the most specific path always wins.
         */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/weather-app" element={<WeatherAppPage />} />
          <Route path="/todo-app" element={<TodoAppPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
