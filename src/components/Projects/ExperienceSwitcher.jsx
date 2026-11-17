import React from 'react';
import './ExperienceSwitcher.css';

/**
 * ExperienceSwitcher – renders tab buttons for multiple project experiences.
 * Props:
 *   experiences: Array of { id, label, preview }
 *   onSelect:    (previewUrl) => void – called when a tab is selected.
 *   activePreview: currently displayed preview URL (used to highlight active tab).
 */
export default function ExperienceSwitcher({ experiences, onSelect, activePreview }) {
  const handleClick = (preview) => {
    if (onSelect) onSelect(preview);
  };

  return (
    <div className="experience-switcher">
      {experiences.map((exp) => (
        <button
          key={exp.id}
          className={`exp-tab ${activePreview === exp.preview ? 'active' : ''}`}
          type="button"
          onClick={() => handleClick(exp.preview)}
        >
          {exp.label}
        </button>
      ))}
    </div>
  );
}
