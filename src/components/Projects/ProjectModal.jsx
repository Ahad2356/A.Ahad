import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiX, FiExternalLink, FiChevronRight } from 'react-icons/fi';
import ExperienceSwitcher from './ExperienceSwitcher';
import './ProjectModal.css';

/**
 * ProjectModal — a browser-window mockup used as the "Explore Details" preview for
 * every project card (homepage trio, /projects grid and case studies share it).
 *
 * What it shows:
 * - The fold capture of the actual deployed site, or a labelled screenshot of any
 *   section the project data exposes (`project.screenshots`, or the per-experience
 *   set when a project has `experiences`, e.g. LHS Cut Hair vs. Beauty).
 * - An opt-in full-page capture. That image can be 10k+ pixels tall, so it is only
 *   requested when the visitor asks for it and is then scrolled inside the window.
 *
 * Deliberate rules:
 * - Nothing here carries `data-b`: the construction engine counts tagged elements,
 *   and a transient overlay must never change those counts.
 * - The address bar only prints a URL that really is deployed. Local demos show a
 *   neutral label instead of a fabricated link.
 * - Accessibility: Escape closes, focus is trapped while open and restored to the
 *   opener on close, and background scrolling is locked.
 */
export default function ProjectModal({ project, activePreview, onSelectExperience, onClose }) {
  const experiences = project.experiences;
  const activeExperience = useMemo(
    () => (experiences ? experiences.find((e) => e.preview === activePreview) || experiences[0] : null),
    [experiences, activePreview]
  );
  const shots = (activeExperience ? activeExperience.screenshots : project.screenshots) || [];
  const fullCapture = (activeExperience ? activeExperience.fullCapture : project.fullCapture) || null;

  const [shot, setShot] = useState(null); // null = the card's current preview image
  const [showFull, setShowFull] = useState(false);

  // Reset to the preview the card was showing whenever the modal is opened or the
  // experience changes underneath it.
  useEffect(() => {
    setShot(null);
    setShowFull(false);
  }, [project.id, activePreview]);

  const overlayRef = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    const modal = overlayRef.current.querySelector('.pm-modal');
    const focusables = () => [...modal.querySelectorAll('button, a[href], [role="button"][tabindex]')];

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!modal.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    focusables()[0]?.focus();
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [onClose]);

  const mainSrc = showFull && fullCapture ? fullCapture : shot?.src || activePreview;
  const mainAlt = showFull
    ? `${project.title} full-page capture`
    : shot?.label || `${project.title} preview`;

  return (
    <div className="pm-overlay" ref={overlayRef} onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.title} Preview`}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Browser mockup chrome */}
        <div className="pm-header">
          <div className="pm-traffic-lights">
            <span className="pm-dot pm-red" onClick={onClose} title="Close (Esc)" />
            <span className="pm-dot pm-yellow" />
            <span className="pm-dot pm-green" />
          </div>

          <div className="pm-address-bar">
            <span className="pm-lock-icon">{project.liveUrl ? '🔒' : '◦'}</span>
            <span className="pm-url">
              {project.liveUrl || `${project.title} — local demo inside this portfolio`}
            </span>
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

        {experiences && (
          <div className="pm-switcher-bar">
            <ExperienceSwitcher
              experiences={experiences}
              onSelect={onSelectExperience}
              activePreview={activePreview}
            />
          </div>
        )}

        {/* One screenshot at a time; the full-page capture switches to scroll mode */}
        <div className={`pm-viewport${showFull ? ' pm-viewport--scroll' : ''}`}>
          <img
            key={mainSrc}
            src={mainSrc}
            alt={mainAlt}
            className={`pm-screenshot${showFull ? ' pm-screenshot--full' : ' pm-screenshot--panel'}`}
            loading={showFull ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>

        {/* Section screenshots + the opt-in full-page capture */}
        {(shots.length > 0 || fullCapture) && (
          <div className="pm-strip">
            {shots.length > 0 && (
              <div className="pm-thumbs" role="group" aria-label={`${project.title} section screenshots`}>
                <button
                  type="button"
                  className={`pm-thumb${shot === null && !showFull ? ' active' : ''}`}
                  onClick={() => { setShot(null); setShowFull(false); }}
                >
                  <span className="pm-thumb-label">Overview</span>
                </button>
                {shots.map((s) => (
                  <button
                    type="button"
                    key={s.src}
                    className={`pm-thumb${shot === s && !showFull ? ' active' : ''}`}
                    onClick={() => { setShot(s); setShowFull(false); }}
                  >
                    <span className="pm-thumb-label">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {fullCapture && (
              <button
                type="button"
                className={`pm-fulltoggle${showFull ? ' active' : ''}`}
                onClick={() => setShowFull((v) => !v)}
                aria-pressed={showFull}
              >
                <span>{showFull ? 'Close full page' : 'Full page capture'}</span>
                <FiChevronRight />
              </button>
            )}
          </div>
        )}

        <div className="pm-footer">
          <span className="pm-title">{project.title}</span>
          <span className="pm-hint">
            {showFull
              ? 'Full-page capture — scroll inside the window'
              : 'Captured from the live deployment · section shots load on selection'}
          </span>
        </div>
      </div>
    </div>
  );
}
