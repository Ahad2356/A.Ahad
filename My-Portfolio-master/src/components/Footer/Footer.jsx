import React from 'react';
import { FiGithub, FiLinkedin, FiYoutube, FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp } from 'react-icons/fa6';
import './Footer.css';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-logo">
        <span className="brand-icon" style={{ width: '24px', height: '24px', fontSize: '11px' }}>
          A
        </span>
        <span>A. AHAD</span>
      </div>

      <ul className="social-links" aria-label="Social Media Links">
        <li>
          <a href="https://github.com/Ahad2356" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FiGithub />
            <span>GitHub</span>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/abdul-ahad-45b369300" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FiLinkedin />
            <span>LinkedIn</span>
          </a>
        </li>
        <li>
          <a href="https://youtube.com/@aahad2300?si=NTocVwvZBQEog1ra" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FiYoutube />
            <span>YouTube</span>
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/abdul36847?stkn=MXV6NmVjOHkxeWlkNA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FiInstagram />
            <span>Instagram</span>
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/share/1EVwwYp1iX/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FiFacebook />
            <span>Facebook</span>
          </a>
        </li>
        <li>
          <a href="http://t.me/AAhad32" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <FaTelegram />
            <span>Telegram</span>
          </a>
        </li>
        <li>
          <a href="https://wa.me/qr/6OEY44RSXBNHB1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>
        </li>
      </ul>

      <div className="copy-text">© 2025 Abdul Ahad. All rights reserved.</div>
    </footer>
  );
}
