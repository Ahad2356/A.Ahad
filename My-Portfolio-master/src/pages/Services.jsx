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
      <section className="section-container page-hero">
        <div className="hero-tag">DEVELOPMENT SERVICES</div>
        <h1 className="hero-title">WHAT WE BUILD & DELIVER</h1>
        <p className="hero-subtext">
          Transforming complex digital requirements into high-performance, responsive web applications engineered with clean code and modern aesthetics.
        </p>

        <div style={{ marginTop: '24px' }}>
          <a
            href="/Abdul_Ahad_Resume.pdf"
            download="Abdul_Ahad_Resume.pdf"
            className="btn-cv"
          >
            <FiDownload />
            <span>DOWNLOAD MY CV / RESUME</span>
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-container" style={{ paddingTop: 0 }}>
        <div className="services-grid">
          {servicesData.map((svc) => (
            <div key={svc.id} className="service-card">
              <div>
                <div className="service-icon">💻</div>
                <h3 className="service-title">{svc.title}</h3>
                <p className="service-desc">{svc.description}</p>
              </div>
              <ul className="service-bullets">
                {svc.deliverables.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Development Process Workflow */}
      <section className="section-container">
        <div className="hero-tag">DEVELOPMENT PROCESS</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>
          HOW WE WORK TOGETHER
        </h2>

        <div className="workflow-grid">
          {workflowSteps.map((step) => (
            <div key={step.step} className="workflow-card">
              <div className="step-num">{step.step}</div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-container">
        <div className="cta-banner">
          <h2 className="cta-title">READY TO START YOUR NEXT PROJECT?</h2>
          <p className="cta-desc">
            Whether you need a full stack web application, a WordPress site, or a custom frontend tool, let's turn your vision into reality.
          </p>
          <a
            href="https://wa.me/qr/6OEY44RSXBNHB1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-action"
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
