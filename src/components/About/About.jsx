import React from 'react';
import { FiBookOpen, FiMapPin, FiCode, FiCpu } from 'react-icons/fi';
import './About.css';

export default function About() {
  return (
    <section className="section-container" id="about">
      <div className="section-title-wrap" data-block>
        <div className="section-tag" data-b="text">ABOUT ME</div>
        <div className="section-sub" data-b="text">MY JOURNEY & VISION</div>
      </div>

      <div className="about-grid" data-block>
        <div className="about-card large-vision" data-b="box">
          <div>
            <p className="vision-text" data-b="text">
              I'm Abdul Ahad, a passionate and dedicated Computer Science student based in Lahore. I love building
              modern websites and exploring new technologies. My goal is to become a skilled Full Stack Developer and
              create impactful digital solutions.
            </p>
          </div>
          <div className="script-signature" data-b="box">Abdul Ahad</div>
        </div>

        <div className="about-card" data-b="box">
          <div className="info-text">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiBookOpen />
              <span>EDUCATION</span>
            </label>
            <h5 data-b="text" style={{ fontSize: '15px', marginTop: '6px' }}>ICS — Computer Science</h5>
            <p data-b="text" style={{ marginTop: '4px', lineHeight: '1.4' }}>
              Govt MAO College Lahore-Lahore<br />
              <span style={{ color: 'var(--bright-red)', fontSize: '11px', fontWeight: '700' }}>
                (May 2024 — Present)
              </span>
            </p>
          </div>
        </div>

        <div className="about-card" data-b="box">
          <div className="info-text">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiMapPin />
              <span>LOCATION</span>
            </label>
            <h5 data-b="text" style={{ fontSize: '15px', marginTop: '6px' }}>Lahore, PPB, Pakistan</h5>
          </div>
        </div>

        <div className="about-card" data-b="box">
          <div className="info-text">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCode />
              <span>CURRENT FOCUS</span>
            </label>
            <h5 data-b="text" style={{ fontSize: '15px', marginTop: '6px' }}>Web Development</h5>
            <p data-b="text" style={{ marginTop: '4px' }}>(React · JavaScript · WordPress)</p>
          </div>
        </div>

        <div className="about-card" data-b="box">
          <div className="info-text">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCpu />
              <span>EXPLORING</span>
            </label>
            <h5 data-b="text" style={{ fontSize: '15px', marginTop: '6px' }}>AI · Security · Robotics</h5>
          </div>
        </div>
      </div>
    </section>
  );
}
