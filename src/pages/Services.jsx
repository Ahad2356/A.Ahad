import React, { useEffect } from 'react';
import { FiDownload, FiArrowUpRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { servicesData, workflowSteps } from '../data/projects';
import Footer from '../components/Footer/Footer';
import './Services.css';

export default function Services() {
  useEffect(() => {
    document.title = 'Services | A. AHAD - Full Stack & Web Developer';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="services-page-wrapper">
      {/* Page Hero */}
      <section className="section-container page-hero" data-block>
        <div className="hero-tag" data-b="text">DEVELOPMENT SERVICES</div>
        <h1 className="hero-title" data-b="text">WHAT WE BUILD & DELIVER</h1>
        <p className="hero-subtext" data-b="text">
          Transforming complex digital requirements into high-performance, responsive web applications engineered with clean code and modern aesthetics.
        </p>

        <div style={{ marginTop: '24px' }}>
          <a
            href="/Abdul_Ahad_Resume.pdf"
            download="Abdul_Ahad_Resume.pdf"
            className="btn-cv"
            data-b="box"
          >
            <FiDownload />
            <span>DOWNLOAD MY CV / RESUME</span>
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div className="services-grid" data-block>
          {servicesData.map((svc) => (
            <div key={svc.id} className="service-card" data-b="box">
              <div>
                <div className="service-icon">💻</div>
                <h3 className="service-title" data-b="text">{svc.title}</h3>
                <p className="service-desc" data-b="text">{svc.description}</p>
              </div>
              <ul className="service-bullets" data-b="box">
                {svc.deliverables.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Development Process Workflow */}
      <section className="section-container" data-block>
        <div className="hero-tag" data-b="text">DEVELOPMENT PROCESS</div>
        <h2 data-b="text" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          HOW WE WORK TOGETHER
        </h2>

        <div className="workflow-grid">
          {workflowSteps.map((step) => (
            <div key={step.step} className="workflow-card" data-b="box">
              <div className="step-num" data-b="box">{step.step}</div>
              <div className="step-title" data-b="text">{step.title}</div>
              <div className="step-desc" data-b="text">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-container">
        <div className="cta-banner" data-block data-b="box">
          <h2 className="cta-title" data-b="text">READY TO START YOUR NEXT PROJECT?</h2>
          <p className="cta-desc" data-b="text">
            Whether you need a full stack web application, a WordPress site, or a custom frontend tool, let's turn your vision into reality.
          </p>
          <a
            href="https://wa.me/qr/6OEY44RSXBNHB1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action"
            data-b="box"
          >
            <FaWhatsapp style={{ fontSize: '16px' }} />
            <span>CHAT ON WHATSAPP</span>
            <FiArrowUpRight />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
