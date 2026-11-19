import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiAward } from 'react-icons/fi';
import { projects, certificates } from '../../data/projects';
import ProjectCard from './ProjectCard';
import './FeaturedProjects.css';

/**
 * The homepage "Selected Work" showcase: the three deployed client sites plus the
 * certificates column. `SHOWCASE_IDS` fixes the trio and its order independently of
 * the `featured` flag on `/projects`, and `filter(Boolean)` keeps the section alive
 * if a project is ever retired from the data file.
 *
 * The `data-block` / `data-b` attributes are the build-animation contract: the engine
 * discovers them, so anything added here is automatically constructed in stage 06/08.
 * Transient overlays (modals, hover layers) must stay untagged or they get counted as
 * buildable layers that are not on screen.
 */
export default function FeaturedProjects() {
  // The three real client showcase projects displayed in the Featured Projects section
  const SHOWCASE_IDS = ['lhs-cut', 'pioneer-solar', '32-dental'];
  const featuredList = SHOWCASE_IDS.map(id => projects.find(p => p.id === id)).filter(Boolean);

  return (
    <section className="section-container" id="projects">
      <div className="projects-cert-grid">
        {/* Left Column: Featured Projects Trio */}
        <div>
          <div className="section-title-wrap projects-head" data-block>
            <div className="projects-head-top">
              <div className="section-tag" data-b="text">SELECTED WORK</div>
              <div className="projects-count" data-b="box">
                <strong>{String(featuredList.length).padStart(2, '0')}</strong>
                <span>PROJECTS</span>
              </div>
            </div>

            <h2 className="projects-title" data-b="text">
              2026 — Building Digital Experiences That{' '}
              <span className="projects-title-accent">Matter.</span>
            </h2>

            <p className="projects-lede" data-b="text">
              Three client websites that are live right now: a barbershop and a beauty salon
              sharing one address, a solar equipment store, and a dental clinic with an
              interactive smile planner. Every preview here is captured from the deployed site.
            </p>
          </div>

          <div className="projects-trio" data-block>
            {featuredList.map((project) => (
              <ProjectCard key={project.id} project={project} mini={true} />
            ))}
          </div>

          <div className="featured-more-bar" data-block data-b="box">
            <Link to="/projects" className="btn-secondary" style={{ marginTop: '16px' }}>
              <span>EXPLORE ALL PROJECTS</span>
              <FiArrowUpRight />
            </Link>
          </div>
        </div>

        {/* Right Column: Certificates */}
        <div id="certificates">
          <div className="section-title-wrap certs-heading-wrap" data-block>
            <div className="section-tag" data-b="text">CERTIFICATES</div>
            <div className="section-sub" data-b="text">MY ACHIEVEMENTS</div>
          </div>

          <div className="certs-stack" data-block>
            {certificates.map((cert) => (
              <div key={cert.id} className="cert-tile" data-b="box">
                <div className="cert-icon">
                  <FiAward />
                </div>
                <div className="cert-info">
                  <h5>{cert.title}</h5>
                  <span>({cert.issuer}) — {cert.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
