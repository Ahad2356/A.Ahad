import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink, FiMaximize2 } from 'react-icons/fi';
import ExperienceSwitcher from './ExperienceSwitcher';
import ProjectModal from './ProjectModal';
import './ProjectCard.css';

export default function ProjectCard({ project, mini = false }) {
  const [previewSrc, setPreviewSrc] = useState(
    project.experiences ? project.experiences[0].preview : project.image
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExperienceSelect = (preview) => {
    setPreviewSrc(preview);
  };

  // Mini version used in the Featured Projects trio on Homepage
  if (mini) {
    return (
      <>
        <div className="project-card-mini" data-block data-b="box">
          {/* Image preview with expand overlay */}
          <div
            className="project-mini-img"
            data-b="box"
            onClick={() => setIsModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label={`Expand full preview of ${project.title}`}
            onKeyDown={(e) => { if (e.key === 'Enter') setIsModalOpen(true); }}
          >
            <img src={previewSrc} alt={project.title} loading="lazy" decoding="async" />
            <div className="project-img-overlay">
              <span className="expand-badge">
                <FiMaximize2 />
                <span>EXPAND PREVIEW</span>
              </span>
            </div>
          </div>

          {/* Experience switcher sits OUTSIDE the image container so it is never clipped */}
          {project.experiences && (
            <div className="project-mini-switcher">
              <ExperienceSwitcher
                experiences={project.experiences}
                onSelect={handleExperienceSelect}
                activePreview={previewSrc}
              />
            </div>
          )}

          <div className="project-mini-body">
            <div>
              <div className="project-mini-title" data-b="text">
                {project.title}
              </div>
              <div className="project-mini-desc" data-b="text">
                {project.description}
              </div>
            </div>

            <div className="project-mini-footer" data-b="box">
              <div className="project-tags" style={{ marginBottom: 0 }}>
                {project.technologies.slice(0, 2).map((tech, i) => (
                  <span key={i} className="project-tag-pill">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-mini-actions">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arrow-circle"
                    aria-label={`Open ${project.title} live website`}
                    title="Visit Live Website"
                  >
                    <FiExternalLink />
                  </a>
                )}
                <Link
                  to={project.detailsPath}
                  className="arrow-circle"
                  aria-label={`View ${project.title} Details`}
                  title="View Case Study"
                >
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <ProjectModal
            project={project}
            activePreview={previewSrc}
            onSelectExperience={handleExperienceSelect}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  }

  // Full card used on the /projects page
  return (
    <>
      <div className={`project-card ${project.featured ? 'featured-card' : ''}`} data-block data-b="box">
        {project.featured && <div className="project-badge-featured">Featured</div>}
        <div
          className="project-img-wrapper"
          data-b="box"
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`Expand full preview of ${project.title}`}
          onKeyDown={(e) => { if (e.key === 'Enter') setIsModalOpen(true); }}
        >
          <img src={previewSrc} alt={project.title} loading="lazy" decoding="async" />
          <div className="project-img-overlay">
            <span className="expand-badge">
              <FiMaximize2 />
              <span>EXPAND PREVIEW</span>
            </span>
          </div>
        </div>

        {/* Experience switcher sits cleanly between image and body */}
        {project.experiences && (
          <div className="project-card-switcher">
            <ExperienceSwitcher
              experiences={project.experiences}
              onSelect={handleExperienceSelect}
              activePreview={previewSrc}
            />
          </div>
        )}

        <div className="project-card-body" data-b="box">
          <div>
            <div className="project-category-tag" data-b="text">
              {project.category}
            </div>
            <h3 className="project-card-title" data-b="text">
              {project.title}
            </h3>
            <p className="project-card-desc" data-b="text">
              {project.description}
            </p>
            <div className="project-tags" data-b="box">
              {project.technologies.map((tech, i) => (
                <span key={i} className="project-tag-pill">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="project-card-actions" data-b="box">
            <Link to={project.detailsPath} className="project-view-btn">
              <span>EXPLORE CASE STUDY</span>
              <FiArrowRight />
            </Link>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-external-link"
                title="Open Live Site"
                aria-label={`Open ${project.title} live website`}
              >
                <FiExternalLink />
              </a>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          project={project}
          activePreview={previewSrc}
          onSelectExperience={handleExperienceSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
