import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiDownload, FiMapPin, FiAward, FiBookOpen, FiCode, FiCpu } from 'react-icons/fi';
import { FaReact, FaJs, FaWordpress, FaHtml5, FaCss3Alt, FaRobot } from 'react-icons/fa6';
import DeveloperShowcase from '../DeveloperShowcase/DeveloperShowcase';
import './Hero.css';

export default function Hero() {
  return (
    <section className="section-container hero-section">
      <div className="hero-grid">
        {/* Left Hero Content */}
        <div className="hero-left">
          <div className="script-intro">Hello, I am</div>
          <h1 className="hero-name">ABDUL <span className="hero-name-accent">AHAD</span></h1>
          <div className="hero-subtitle-bar">
            FULL STACK DEVELOPER | WEB DEVELOPER | WORDPRESS DEVELOPER
          </div>
          <p className="hero-bio">
            I'm Abdul Ahad, a Computer Science student and aspiring Full Stack Developer focused on building responsive,
            modern and user-friendly digital experiences.
          </p>

          <div className="floating-lines-container" aria-hidden="true">
            <div className="floating-line line-1" />
            <div className="floating-line line-2" />
            <div className="floating-line line-3" />
          </div>

          <div className="hero-cta-btns">
            <Link to="/projects" className="btn-primary">
              <span>EXPLORE MY WORK</span>
              <FiArrowUpRight style={{ fontSize: '14px' }} />
            </Link>
            <a
              href="https://www.linkedin.com/in/abdul-ahad-45b369300"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <span>LET'S CONNECT</span>
              <FiArrowUpRight style={{ fontSize: '14px' }} />
            </a>
            <a
              href="/Abdul_Ahad_Resume.pdf"
              download="Abdul_Ahad_Resume.pdf"
              className="btn-cv"
            >
              <FiDownload style={{ fontSize: '14px' }} />
              <span>DOWNLOAD CV</span>
            </a>
          </div>

          <div className="tech-badges-row">
            <div className="tech-pill">
              <FaReact style={{ color: '#61dafb', fontSize: '14px' }} />
              <span>React</span>
            </div>
            <div className="tech-pill">
              <FaJs style={{ color: '#f7df1e', fontSize: '14px' }} />
              <span>JavaScript</span>
            </div>
            <div className="tech-pill">
              <FaWordpress style={{ color: '#21759b', fontSize: '14px' }} />
              <span>WordPress</span>
            </div>
            <div className="tech-pill">
              <FaHtml5 style={{ color: '#e34f26', fontSize: '14px' }} />
              <span>HTML5</span>
            </div>
            <div className="tech-pill">
              <FaCss3Alt style={{ color: '#1572b6', fontSize: '14px' }} />
              <span>CSS3</span>
            </div>
          </div>

          <div className="hero-location">
            <FiMapPin style={{ color: 'var(--bright-red)' }} />
            <span>LAHORE, PAKISTAN</span>
          </div>

          {/* Tasteful Developer 3D / Code Showcase */}
          <DeveloperShowcase />
        </div>

        {/* Right Hero: Quick Info Panel */}
        <div className="quick-info-card">
          <div className="quick-info-header">QUICK INFO</div>

          <div className="info-item">
            <div className="info-icon">
              <FiBookOpen />
            </div>
            <div className="info-text">
              <label>EDUCATION</label>
              <h5>ICS (2nd Year)</h5>
              <p>
                Govt MAO College Lahore-Lahore<br />
                Lahore Board / BISE Lahore
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FiMapPin />
            </div>
            <div className="info-text">
              <label>LOCATION</label>
              <h5>Lahore, PPB, Pakistan</h5>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FiCode />
            </div>
            <div className="info-text">
              <label>CURRENT FOCUS</label>
              <h5>Web Development</h5>
              <p>(React · JavaScript · WordPress)</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaRobot />
            </div>
            <div className="info-text">
              <label>EXPLORING</label>
              <h5>AI · Security · Robotics</h5>
            </div>
          </div>

          <div className="achievement-card">
            <div className="achievement-header">
              <FiAward style={{ fontSize: '14px' }} />
              <span>ACHIEVEMENT</span>
            </div>
            <div className="achievement-title">QuizOff 2026</div>
            <div className="achievement-desc">
              Successfully completed QuizOff 2026 (India's biggest AI quiz). Competed against 5.25+ lakh students from
              48,500+ institutions.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
