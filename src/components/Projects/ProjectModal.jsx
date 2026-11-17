import React, { useEffect } from 'react';
import { FiX, FiExternalLink, FiMaximize2 } from 'react-icons/fi';
import ExperienceSwitcher from './ExperienceSwitcher';
import './ProjectModal.css';

export default function ProjectModal({ project, activePreview, onSelectExperience, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="pm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.title} Preview`}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Browser Mockup Window Header */}
        <div className="pm-header">
          <div className="pm-traffic-lights">
            <span className="pm-dot pm-red" onClick={onClose} title="Close (Esc)" />
            <span className="pm-dot pm-yellow" />
            <span className="pm-dot pm-green" />
          </div>

          <div className="pm-address-bar">
            <span className="pm-lock-icon">🔒</span>
            <span className="pm-url">{project.liveUrl || `https://${project.id}.vercel.app`}</span>
          </div>

          <div className="pm-actions">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pm-btn-live"
                title="Visit Live Website"
              >
                <span>VISIT LIVE</span>
                <FiExternalLink />
              </a>
            )}
            <button type="button" className="pm-btn-close" onClick={onClose} aria-label="Close modal">
              <FiX />
            </button>
          </div>
        </div>

        {/* Experience Switcher inside modal if available */}
        {project.experiences && (
          <div className="pm-switcher-bar">
            <ExperienceSwitcher
              experiences={project.experiences}
              onSelect={onSelectExperience}
              activePreview={activePreview}
            />
          </div>
        )}

        {/* Scrollable Screenshot Container */}
        <div className="pm-viewport">
          <img
            src={activePreview}
            alt={`${project.title} Full Page Preview`}
            className="pm-screenshot"
            loading="eager"
          />
        </div>

        {/* Footer info */}
        <div className="pm-footer">
          <span className="pm-title">{project.title}</span>
          <span className="pm-hint">Scroll inside window to view full page screenshot</span>
        </div>
      </div>
    </div>
  );
}
