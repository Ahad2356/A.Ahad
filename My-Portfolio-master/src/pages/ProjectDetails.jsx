import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiCheckCircle, FiExternalLink, FiGithub, FiPlay } from 'react-icons/fi';
import { projects } from '../data/projects';
import Footer from '../components/Footer/Footer';
import './ProjectDetails.css';

export default function ProjectDetails() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) {
      document.title = `${project.title} | Case Study | A. AHAD`;
    }
  }, [project]);

  if (!project) {
    return (
      <div className="details-page-wrapper">
        <section className="section-container" style={{ paddingTop: '160px', textAlign: 'center' }}>
          <div className="hero-tag" style={{ justifyContent: 'center' }}>PROJECT NOT FOUND</div>
          <h1 className="details-main-title">404 — CASE STUDY UNAVAILABLE</h1>
          <p className="hero-subtext" style={{ margin: '20px auto' }}>
            The requested project details could not be found. Please browse our portfolio catalog.
          </p>
          <Link to="/projects" className="btn-primary" style={{ marginTop: '20px' }}>
            <FiArrowLeft />
            <span>BACK TO ALL PROJECTS</span>
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="details-page-wrapper">
      {/* Hero Header */}
      <section className="section-container details-hero">
        <div className="details-breadcrumb">
          <Link to="/">HOME</Link>
          <span>/</span>
          <Link to="/projects">PROJECTS</Link>
          <span>/</span>
          <span style={{ color: '#ffffff' }}>{project.title}</span>
        </div>

        <div className="details-title-row">
          <div>
            <div className="hero-tag">{project.category}</div>
            <h1 className="details-main-title">{project.title}</h1>
          </div>
        </div>

        <div className="details-tagline">{project.tagline}</div>

        {/* Project Metadata Ribbon */}
        <div className="details-meta-bar">
          <div className="meta-item">
            <label>ROLE / CONTRIBUTION</label>
            <span>{project.role}</span>
          </div>
          <div className="meta-item">
            <label>TIMELINE</label>
            <span>{project.timeline}</span>
          </div>
          <div className="meta-item">
            <label>STATUS</label>
            <span style={{ color: 'var(--bright-red)' }}>{project.status}</span>
          </div>
        </div>

        {/* Big Showcase Image */}
        <div className="details-image-showcase">
          <img src={project.image} alt={project.title} loading="eager" decoding="async" />
        </div>

        {/* Main Content & Specs Grid */}
        <div className="details-content-grid">
          {/* Left Column: Narrative & Features */}
          <div className="details-left">
            <div className="details-overview-card">
              <h2 className="details-section-title">PROJECT OVERVIEW</h2>
              <p className="details-overview-text">{project.overview}</p>
              <p className="details-overview-text">{project.description}</p>
            </div>

            <div className="details-overview-card">
              <h2 className="details-section-title">KEY HIGHLIGHTS & ARCHITECTURE</h2>
              <div className="details-features-list">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="details-feature-item">
                    <FiCheckCircle className="feature-check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Tech Specs & Primary CTA */}
          <div className="details-right">
            <div className="details-sidebar-card">
              <div>
                <label className="section-sub" style={{ display: 'block', marginBottom: '8px' }}>
                  TECHNOLOGY STACK
                </label>
                <div className="tech-stack-pills">
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-badge-large">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="details-cta-box">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-open-site"
                  >
                    <span>OPEN SITE</span>
                    <FiArrowUpRight style={{ fontSize: '15px' }} />
                  </a>
                )}

                {project.interactiveRoute && (
                  <Link to={project.interactiveRoute} className="btn-open-site">
                    <FiPlay style={{ fontSize: '14px' }} />
                    <span>TRY LIVE DEMO</span>
                  </Link>
                )}

                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-source-code"
                  >
                    <FiGithub style={{ fontSize: '15px' }} />
                    <span>GITHUB REPOSITORY</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="details-bottom-nav">
          <Link to="/projects" className="btn-secondary">
            <FiArrowLeft />
            <span>BACK TO ALL PROJECTS</span>
          </Link>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--bright-red)',
                fontSize: '12px',
                fontWeight: '800',
                letterSpacing: '1px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>VISIT LIVE DEPLOYMENT</span>
              <FiExternalLink />
            </a>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
