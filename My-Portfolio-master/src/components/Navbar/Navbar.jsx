import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import './Navbar.css';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close drawer upon route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <>
      <header className="header-bar" role="banner">
        <Link to="/" className="brand-logo" aria-label="Abdul Ahad Portfolio Home">
          <span className="brand-icon">A</span>
          <span>A. AHAD</span>
        </Link>

        <nav aria-label="Primary Navigation">
          <ul className="nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
                PROJECTS
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>
                SERVICES
              </NavLink>
            </li>
            <li>
              <NavLink to="/weather-app" className={({ isActive }) => (isActive ? 'active' : '')}>
                WEATHER APP
              </NavLink>
            </li>
            <li>
              <NavLink to="/todo-app" className={({ isActive }) => (isActive ? 'active' : '')}>
                TODO APP
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>
                ABOUT
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <a
            href="https://wa.me/qr/6OEY44RSXBNHB1"
            target="_blank"
            rel="noopener noreferrer"
            className="talk-btn"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp style={{ fontSize: '15px' }} />
            <span>LET'S TALK</span>
          </a>

          <button
            className="mobile-nav-toggle"
            onClick={toggleMobile}
            aria-label={isMobileOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation Drawer */}
      <nav
        className={`mobile-drawer ${isMobileOpen ? 'active' : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!isMobileOpen}
      >
        <NavLink to="/" end onClick={() => setIsMobileOpen(false)}>
          HOME
        </NavLink>
        <NavLink to="/projects" onClick={() => setIsMobileOpen(false)}>
          PROJECTS
        </NavLink>
        <NavLink to="/services" onClick={() => setIsMobileOpen(false)}>
          SERVICES
        </NavLink>
        <NavLink to="/weather-app" onClick={() => setIsMobileOpen(false)}>
          WEATHER APP
        </NavLink>
        <NavLink to="/todo-app" onClick={() => setIsMobileOpen(false)}>
          TODO APP
        </NavLink>
        <NavLink to="/about" onClick={() => setIsMobileOpen(false)}>
          ABOUT
        </NavLink>
        <a
          href="https://wa.me/qr/6OEY44RSXBNHB1"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--bright-red)' }}
        >
          <span>WHATSAPP CHAT</span>
          <FiArrowUpRight />
        </a>
      </nav>
    </>
  );
}
