import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Direct mailto generation so the user's default email client can send it directly
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:ii0555431@gmail.com?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  return (
    <section className="section-container" id="contact">
      <div className="section-title-wrap">
        <div className="section-tag">CONTACT ME</div>
        <div className="section-sub">LET'S BUILD SOMETHING GREAT</div>
      </div>

      <div className="contact-main-grid">
        {/* Info Column */}
        <div className="contact-card-info">
          <a href="tel:+923038702170" className="contact-item-row">
            <div className="contact-icon-box">
              <FiPhone />
            </div>
            <span>+92 303 8702170</span>
          </a>

          <a href="mailto:ii0555431@gmail.com" className="contact-item-row">
            <div className="contact-icon-box">
              <FiMail />
            </div>
            <span>ii0555431@gmail.com</span>
          </a>

          <a
            href="https://wa.me/qr/6OEY44RSXBNHB1"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item-row"
          >
            <div className="contact-icon-box">
              <FaWhatsapp />
            </div>
            <span>WhatsApp Me</span>
          </a>

          <div className="contact-item-row">
            <div className="contact-icon-box">
              <FiMapPin />
            </div>
            <span>Lahore, PPB, Pakistan</span>
          </div>
        </div>

        {/* Contact Form Column */}
        <form className="contact-form-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="name"
              aria-label="Your Name"
              className="form-input"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              aria-label="Your Email"
              className="form-input"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            name="message"
            aria-label="Your Message"
            className="form-input"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="send-btn">
            <FiSend />
            <span>SEND MESSAGE</span>
          </button>

          {submitted && (
            <div className="contact-success-notice">
              <FiCheckCircle style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Ready! Opening your email client to dispatch the message.
            </div>
          )}
        </form>

        {/* Quote Column */}
        <div className="quote-box">
          <div className="quote-big-mark">“</div>
          <p className="quote-msg">
            Small steps every day lead to big results.
          </p>
          <div className="quote-signature-wrap">
            <div className="quote-script">Abdul Ahad</div>
          </div>
        </div>
      </div>
    </section>
  );
}
