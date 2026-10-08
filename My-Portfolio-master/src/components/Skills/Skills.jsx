import React from 'react';
import { FaReact, FaJs, FaHtml5, FaWordpress, FaGitAlt, FaBrain, FaShieldHalved, FaRobot } from 'react-icons/fa6';
import { FiLayers, FiCode } from 'react-icons/fi';
import './Skills.css';

export default function Skills() {
  return (
    <section className="section-container">
      <div className="three-panel-grid">
        {/* Panel 1: Technologies & Tools */}
        <div className="panel-card">
          <div className="section-tag">SKILLS</div>
          <div className="section-sub">TECHNOLOGIES & TOOLS</div>

          <div className="skills-cards-grid">
            <div className="skill-tile">
              <FaReact className="skill-tile-icon" style={{ color: '#61dafb' }} />
              <span>React.js</span>
            </div>
            <div className="skill-tile">
              <FaJs className="skill-tile-icon" style={{ color: '#f7df1e' }} />
              <span>JavaScript</span>
            </div>
            <div className="skill-tile">
              <FaHtml5 className="skill-tile-icon" style={{ color: '#e34f26' }} />
              <span>HTML & CSS</span>
            </div>
            <div className="skill-tile">
              <FaWordpress className="skill-tile-icon" style={{ color: '#21759b' }} />
              <span>WordPress</span>
            </div>
            <div className="skill-tile">
              <FaGitAlt className="skill-tile-icon" style={{ color: '#f05032' }} />
              <span>Git & GitHub</span>
            </div>
            <div className="skill-tile">
              <FiLayers className="skill-tile-icon" style={{ color: '#ff1e3c' }} />
              <span>Responsive UI</span>
            </div>
          </div>
        </div>

        {/* Panel 2: Interests */}
        <div className="panel-card">
          <div className="section-tag">INTERESTS</div>
          <div className="section-sub">WHAT I LOVE</div>

          <div className="interests-list">
            <div className="interest-item">
              <div className="interest-icon">
                <FaBrain />
              </div>
              <span>Artificial Intelligence</span>
            </div>
            <div className="interest-item">
              <div className="interest-icon">
                <FaShieldHalved />
              </div>
              <span>Cyber Security</span>
            </div>
            <div className="interest-item">
              <div className="interest-icon">
                <FaRobot />
              </div>
              <span>Robotics & IoT</span>
            </div>
            <div className="interest-item">
              <div className="interest-icon">
                <FiCode />
              </div>
              <span>Web Development</span>
            </div>
          </div>
        </div>

        {/* Panel 3: Languages */}
        <div className="panel-card">
          <div className="section-tag">LANGUAGES</div>
          <div className="section-sub">FLUENCY LEVEL</div>

          <div className="lang-list">
            <div className="lang-item">
              <div className="lang-item-header">
                <label>Urdu</label>
                <span>Native (100%)</span>
              </div>
              <div className="lang-bar-bg">
                <div className="lang-bar-fill" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="lang-item">
              <div className="lang-item-header">
                <label>Punjabi</label>
                <span>Fluent (90%)</span>
              </div>
              <div className="lang-bar-bg">
                <div className="lang-bar-fill" style={{ width: '90%' }} />
              </div>
            </div>

            <div className="lang-item">
              <div className="lang-item-header">
                <label>English</label>
                <span>Fluent (85%)</span>
              </div>
              <div className="lang-bar-bg">
                <div className="lang-bar-fill" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
