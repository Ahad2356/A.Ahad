import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiAward } from 'react-icons/fi';
import { projects, certificates } from '../../data/projects';
import ProjectCard from './ProjectCard';
import './FeaturedProjects.css';

export default function FeaturedProjects() {
  // Primary top 3 featured projects: InsiteVerse, Weather Pulse, TaskFlow Todo
  const featuredList = projects.slice(0, 3);

  return (
    <section className="section-container" id="projects">
      <div className="projects-cert-grid">
        {/* Left Column: Featured Projects Trio */}
        <div>
          <div className="section-title-wrap">
            <div className="section-tag">FEATURED PROJECTS</div>
            <div className="section-sub">SOME OF MY WORK</div>
          </div>

          <div className="projects-trio">
            {featuredList.map((project) => (
              <ProjectCard key={project.id} project={project} mini={true} />
            ))}
          </div>

          <div className="featured-more-bar">
            <Link to="/projects" className="btn-secondary" style={{ marginTop: '16px' }}>
              <span>EXPLORE ALL PROJECTS</span>
              <FiArrowUpRight />
            </Link>
          </div>
        </div>

        {/* Right Column: Certificates */}
        <div>
          <div className="section-title-wrap">
            <div className="section-tag">CERTIFICATES</div>
            <div className="section-sub">MY ACHIEVEMENTS</div>
          </div>

          <div className="certs-stack">
            {certificates.map((cert) => (
              <div key={cert.id} className="cert-tile">
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
