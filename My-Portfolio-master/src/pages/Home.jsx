import React, { useEffect } from 'react';
import CanvasScroll from '../components/CanvasScroll/CanvasScroll';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import FeaturedProjects from '../components/Projects/FeaturedProjects';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer/Footer';

export default function Home() {
  // Ensure title reflects homepage
  useEffect(() => {
    document.title = 'A. AHAD | Full Stack & Web Developer Portfolio';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page-container">
      {/* 240-Frame Canvas Scroll Viewport */}
      <CanvasScroll />

      {/* Main Content Layers */}
      <div className="content-wrapper" style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Skills />
        <FeaturedProjects />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
