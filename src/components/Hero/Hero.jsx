import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiDownload, FiMapPin, FiAward, FiBookOpen, FiCode } from 'react-icons/fi';
import { FaReact, FaJs, FaWordpress, FaHtml5, FaCss3Alt, FaRobot } from 'react-icons/fa6';
import DeveloperShowcase from '../DeveloperShowcase/DeveloperShowcase';
import './Hero.css';

export default function Hero() {
  return (
    <section className="section-container hero-section">
      <div className="hero-grid">
        {/* Left Hero Content */}
        <div className="hero-left" data-block>
          <div className="script-intro" data-b="text">Hello, I am</div>
          <h1 className="hero-name" data-b="box">ABDUL <span className="hero-name-accent">AHAD</span></h1>
          <div className="hero-subtitle-bar" data-b="text">
            FULL STACK DEVELOPER | WEB DEVELOPER | WORDPRESS DEVELOPER
          </div>
          <p className="hero-bio" data-b="text">
            I'm Abdul Ahad, a Computer Science student and aspiring Full Stack Developer focused on building responsive,
            modern and user-friendly digital experiences.
          </p>

          <div className="floating-lines-container" aria-hidden="true" data-b="box">
            <div className="floating-line line-1" />
            <div className="floating-line line-2" />
            <div className="floating-line line-3" />
          </div>

          <div className="hero-cta-btns" data-b="box">
            <Link to="/projects" className="btn-primary" data-b="box">
              <span>EXPLORE MY WORK</span>
              <FiArrowUpRight style={{ fontSize: '14px' }} />
            </Link>
            <a
              href="https://www.linkedin.com/in/abdul-ahad-45b369300"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary" data-b="box"
            >
              <span>LET'S CONNECT</span>
              <FiArrowUpRight style={{ fontSize: '14px' }} />
            </a>
            <a
              href="/Abdul_Ahad_Resume.pdf"
              download="Abdul_Ahad_Resume.pdf"
              className="btn-cv" data-b="box"
            >
              <FiDownload style={{ fontSize: '14px' }} />
              <span>DOWNLOAD CV</span>
            </a>
          </div>

          <div className="tech-badges-row" data-b="box">
            <div className="tech-pill" data-b="box">
              <FaReact style={{ color: '#61dafb', fontSize: '14px' }} />
              <span>React</span>
            </div>
            <div className="tech-pill" data-b="box">
              <FaJs style={{ color: '#f7df1e', fontSize: '14px' }} />
              <span>JavaScript</span>
            </div>
            <div className="tech-pill" data-b="box">
              <FaWordpress style={{ color: '#21759b', fontSize: '14px' }} />
              <span>WordPress</span>
            </div>
            <div className="tech-pill" data-b="box">
              <FaHtml5 style={{ color: '#e34f26', fontSize: '14px' }} />
              <span>HTML5</span>
            </div>
            <div className="tech-pill" data-b="box">
              <FaCss3Alt style={{ color: '#1572b6', fontSize: '14px' }} />
              <span>CSS3</span>
            </div>
          </div>

          <div className="hero-location" data-b="box">
            <FiMapPin style={{ color: 'var(--bright-red)' }} />
            <span>LAHORE, PAKISTAN</span>
          </div>

          {/* Tasteful Developer 3D / Code Showcase */}
          <DeveloperShowcase />
        </div>

        {/* Right Hero: Quick Info Panel + animated Hire Me signature */}
        <div className="hero-right">
        <div className="quick-info-card" data-block data-b="box">
          <div className="quick-info-header" data-b="text">QUICK INFO</div>

          <div className="info-item" data-b="box">
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

          <div className="info-item" data-b="box">
            <div className="info-icon">
              <FiMapPin />
            </div>
            <div className="info-text">
              <label>LOCATION</label>
              <h5>Lahore, PPB, Pakistan</h5>
            </div>
          </div>

          <div className="info-item" data-b="box">
            <div className="info-icon">
              <FiCode />
            </div>
            <div className="info-text">
              <label>CURRENT FOCUS</label>
              <h5>Web Development</h5>
              <p>(React · JavaScript · WordPress)</p>
            </div>
          </div>

          <div className="info-item" data-b="box">
            <div className="info-icon">
              <FaRobot />
            </div>
            <div className="info-text">
              <label>EXPLORING</label>
              <h5>AI · Security · Robotics</h5>
            </div>
          </div>

          <div className="achievement-card" data-b="box">
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

        {/* The signature animation belongs to the band above the footer
            (ParticleSignature); the earlier Hero copy is unmounted, its files kept. */}
        </div>
      </div>
    </section>
  );
}
