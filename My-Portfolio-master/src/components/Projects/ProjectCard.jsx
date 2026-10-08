import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import './ProjectCard.css';

export default function ProjectCard({ project, mini = false }) {
  if (mini) {
    return (
      <div className="project-card-mini">
        <div className="project-mini-img">
          <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
        </div>
        <div className="project-mini-body">
          <div>
            <div className="project-mini-title">{project.title}</div>
            <div className="project-mini-desc">{project.description}</div>
          </div>
          <div className="project-mini-footer">
            <div className="project-tags" style={{ marginBottom: 0 }}>
              {project.technologies.slice(0, 2).map((tech, i) => (
                <span key={i} className="project-tag-pill">
                  {tech}
                </span>
              ))}
            </div>
            <Link
              to={project.detailsPath}
              className="arrow-circle"
              aria-label={`View ${project.title} Details`}
            >
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`project-card ${project.featured ? 'featured-card' : ''}`}>
      {project.featured && (
        <div className="project-badge-featured">Featured</div>
      )}

      <div className="project-img-wrapper">
        <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
      </div>

      <div className="project-card-body">
        <div>
          <div className="project-category-tag">{project.category}</div>
          <h3 className="project-card-title">{project.title}</h3>
          <p className="project-card-desc">{project.description}</p>

          <div className="project-tags">
            {project.technologies.map((tech, i) => (
              <span key={i} className="project-tag-pill">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="project-card-actions">
          <Link to={project.detailsPath} className="project-view-btn">
            <span>EXPLORE PROJECT</span>
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
  );
}
