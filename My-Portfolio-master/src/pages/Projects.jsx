import React, { useState, useEffect } from 'react';
import { FiDownload } from 'react-icons/fi';
import { projects } from '../data/projects';
import ProjectCard from '../components/Projects/ProjectCard';
import Footer from '../components/Footer/Footer';
import './Projects.css';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    document.title = 'Projects | A. AHAD - Full Stack & Web Developer';
    window.scrollTo(0, 0);
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'FEATURED') return p.featured;
    if (activeCategory === 'REACT') return p.technologies.some((t) => t.toLowerCase().includes('react'));
    if (activeCategory === 'FULL STACK') return p.category.toLowerCase().includes('full stack');
    return true;
  });

  return (
    <div className="projects-page-wrapper">
      {/* Page Hero */}
      <section className="section-container page-hero">
        <div className="hero-tag">OUR PORTFOLIO</div>
        <h1 className="hero-title">FEATURED PROJECTS & WORK</h1>
        <p className="hero-subtext">
          Explore our collection of modern full stack applications, interactive web tools, and custom digital experiences
          engineered with React, JavaScript, and WordPress.
        </p>

        <div style={{ marginTop: '24px' }}>
          <a
            href="/Abdul_Ahad_Resume.pdf"
            download="Abdul_Ahad_Resume.pdf"
            className="btn-cv"
          >
            <FiDownload />
            <span>DOWNLOAD MY CV / RESUME</span>
          </a>
        </div>
      </section>

      {/* Projects Grid Section with Filter Bar */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div className="projects-filter-bar">
          {['ALL', 'FEATURED', 'REACT', 'FULL STACK'].map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Engineering Specs & Tech Matrix */}
      <section className="section-container">
        <div className="hero-tag">ENGINEERING SPECS</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          TECHNOLOGY MATRIX
        </h2>

        <div className="tech-matrix-grid">
          <div className="matrix-card">
            <div className="matrix-title">FRONTEND</div>
            <ul className="matrix-list">
              <li>React.js & Hooks</li>
              <li>JavaScript (ES6+)</li>
              <li>HTML5 & CSS3</li>
              <li>Responsive Design</li>
            </ul>
          </div>

          <div className="matrix-card">
            <div className="matrix-title">BACKEND & CMS</div>
            <ul className="matrix-list">
              <li>Node.js Essentials</li>
              <li>WordPress Customization</li>
              <li>Elementor Pro</li>
              <li>REST API Integration</li>
            </ul>
          </div>

          <div className="matrix-card">
            <div className="matrix-title">TOOLS & DEVOPS</div>
            <ul className="matrix-list">
              <li>Git & GitHub</li>
              <li>VS Code Studio</li>
              <li>Local Storage & Cache</li>
              <li>Vercel & Netlify</li>
            </ul>
          </div>

          <div className="matrix-card">
            <div className="matrix-title">UI/UX & PERFORMANCE</div>
            <ul className="matrix-list">
              <li>Figma & Layout Mockups</li>
              <li>SEO Optimization</li>
              <li>Cross-Browser Testing</li>
              <li>Smooth Scroll Motion</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-container">
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-number">100%</div>
            <div className="stat-label">Responsive Precision</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">5.25L+</div>
            <div className="stat-label">QuizOff Participants</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">3+</div>
            <div className="stat-label">Years Learning & Building</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Dedicated Commitment</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
