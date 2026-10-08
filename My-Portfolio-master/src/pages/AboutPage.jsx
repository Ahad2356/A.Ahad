import React, { useEffect } from 'react';
import { FiDownload, FiMapPin, FiBookOpen, FiAward, FiGithub, FiLinkedin, FiCode } from 'react-icons/fi';
import { FaBrain, FaShieldHalved, FaRobot } from 'react-icons/fa6';
import Footer from '../components/Footer/Footer';
import './AboutPage.css';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Me | A. AHAD - Full Stack & Web Developer';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page-wrapper">
      {/* Section 1: Hero */}
      <section className="section-container page-hero">
        <div className="hero-tag">GET TO KNOW ME</div>
        <h1 className="hero-title">ABOUT ABDUL AHAD</h1>
        <p className="hero-subtext">
          Computer Science student, Full Stack Developer, and passionate tech innovator focused on building modern, responsive digital web applications.
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

      {/* Section 2: Story & At a Glance */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div className="story-grid">
          <div className="story-card">
            <h2 style={{ fontSize: '22px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--bright-red)' }}>
              MY JOURNEY & PHILOSOPHY
            </h2>
            <p className="story-text">
              I'm Abdul Ahad, a dedicated Computer Science student based in Lahore, Pakistan. My journey into web engineering started with a curiosity for how complex digital interfaces are built behind the scenes.
            </p>
            <p className="story-text">
              Over the past 3+ years, I have honed my skills across React.js, JavaScript (ES6+), HTML5, CSS3, and WordPress customization. My mission is to merge engineering precision with modern visual design to deliver fast, secure, and user-centric web applications.
            </p>
            <div className="script-sign">Abdul Ahad</div>
          </div>

          <div className="story-card">
            <h2 style={{ fontSize: '22px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px', color: '#ffffff' }}>
              AT A GLANCE
            </h2>
            <div className="highlight-list">
              <div className="hl-item">
                <div className="hl-icon">
                  <FiMapPin />
                </div>
                <span>Based in Lahore, PPB, Pakistan</span>
              </div>
              <div className="hl-item">
                <div className="hl-icon">
                  <FiBookOpen />
                </div>
                <span>ICS Physics (2nd Year) @ Govt MAO College Lahore</span>
              </div>
              <div className="hl-item">
                <div className="hl-icon">
                  <FiCode />
                </div>
                <span>CSR @ Pets one.pk (Jan 2024 — Feb 2025)</span>
              </div>
              <div className="hl-item">
                <div className="hl-icon">
                  <FiAward />
                </div>
                <span>QuizOff 2026 AI Quiz Top Competitor</span>
              </div>
              <a
                href="https://github.com/Ahad2356"
                target="_blank"
                rel="noopener noreferrer"
                className="hl-item"
              >
                <div className="hl-icon">
                  <FiGithub />
                </div>
                <span>GitHub: github.com/Ahad2356</span>
              </a>
              <a
                href="https://www.linkedin.com/in/abdul-ahad-45b369300"
                target="_blank"
                rel="noopener noreferrer"
                className="hl-item"
              >
                <div className="hl-icon">
                  <FiLinkedin />
                </div>
                <span>LinkedIn: abdul-ahad-45b369300</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Milestones & Credentials */}
      <section className="section-container">
        <div className="hero-tag">ACADEMIC & WORK EXPERIENCE</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          MILESTONES & CREDENTIALS
        </h2>

        <div className="milestones-grid">
          <div className="ms-card">
            <div className="ms-date">JAN 2024 — FEB 2025</div>
            <div className="ms-title">CSR Experience</div>
            <div className="ms-desc">
              Pets one.pk-Lahore. Managed client communications & inquiry resolution.
            </div>
          </div>

          <div className="ms-card">
            <div className="ms-date">2024 — PRESENT</div>
            <div className="ms-title">ICS Computer Science</div>
            <div className="ms-desc">
              Govt MAO College Lahore-Lahore. 2nd year ICS physics.
            </div>
          </div>

          <div className="ms-card">
            <div className="ms-date">2021 — 2023</div>
            <div className="ms-title">Matriculation (Science)</div>
            <div className="ms-desc">
              Govt. Boys High school 531-A Gulshan E Ravi Lahore.
            </div>
          </div>

          <div className="ms-card">
            <div className="ms-date">2026 ACHIEVEMENT</div>
            <div className="ms-title">QuizOff 2026 AI Quiz</div>
            <div className="ms-desc">
              Competed against 5.25+ lakh students from 48,500+ institutions.
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Personal Interests */}
      <section className="section-container">
        <div className="hero-tag">BEYOND CODE</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          TECH INTERESTS & PASSIONS
        </h2>

        <div className="interests-grid">
          <div className="interest-box">
            <div className="ib-icon">
              <FaBrain />
            </div>
            <div className="ib-title">ARTIFICIAL INTELLIGENCE</div>
            <div className="ib-desc">
              Exploring generative AI, prompt engineering, and machine learning models.
            </div>
          </div>

          <div className="interest-box">
            <div className="ib-icon">
              <FaShieldHalved />
            </div>
            <div className="ib-title">CYBER SECURITY</div>
            <div className="ib-desc">
              Studying web vulnerability auditing, secure API authentication, and data privacy.
            </div>
          </div>

          <div className="interest-box">
            <div className="ib-icon">
              <FaRobot />
            </div>
            <div className="ib-title">ROBOTICS</div>
            <div className="ib-desc">
              Fascinated by hardware-software integration, automation, and IoT control systems.
            </div>
          </div>

          <div className="interest-box">
            <div className="ib-icon">
              <FiCode />
            </div>
            <div className="ib-title">FULL STACK DEV</div>
            <div className="ib-desc">
              Building scalable, user-first web applications that solve real-world problems.
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
