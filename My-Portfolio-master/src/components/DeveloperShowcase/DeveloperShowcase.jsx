import React, { useState, useRef } from 'react';
import { FiCode, FiCpu, FiTerminal } from 'react-icons/fi';
import './DeveloperShowcase.css';

export default function DeveloperShowcase() {
  const [activeTab, setActiveTab] = useState('react');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Subtle tilt: max 6 degrees
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="dev-showcase-wrap">
      <div
        ref={cardRef}
        className="dev-terminal-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
        }}
      >
        <div className="dev-terminal-topbar">
          <div className="dev-traffic-lights">
            <span className="dev-light red" />
            <span className="dev-light yellow" />
            <span className="dev-light green" />
          </div>

          <div className="dev-tabs">
            <button
              className={`dev-tab-btn ${activeTab === 'react' ? 'active' : ''}`}
              onClick={() => setActiveTab('react')}
              type="button"
            >
              <FiCode />
              <span>FullStack.jsx</span>
            </button>
            <button
              className={`dev-tab-btn ${activeTab === 'engine' ? 'active' : ''}`}
              onClick={() => setActiveTab('engine')}
              type="button"
            >
              <FiCpu />
              <span>ScrollEngine.js</span>
            </button>
          </div>

          <div className="dev-status-tag">
            <span>LIVE 60FPS</span>
          </div>
        </div>

        <div className="dev-terminal-body">
          {activeTab === 'react' ? (
            <>
              <div className="dev-code-line">
                <span className="dev-line-num">1</span>
                <span className="dev-code-content">
                  <span className="syntax-keyword">const</span> <span className="syntax-fn">developer</span> = &#123;
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">2</span>
                <span className="dev-code-content" style={{ paddingLeft: '16px' }}>
                  <span className="syntax-prop">name</span>: <span className="syntax-string">"Abdul Ahad"</span>,
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">3</span>
                <span className="dev-code-content" style={{ paddingLeft: '16px' }}>
                  <span className="syntax-prop">role</span>: <span className="syntax-string">"Full Stack & Web Developer"</span>,
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">4</span>
                <span className="dev-code-content" style={{ paddingLeft: '16px' }}>
                  <span className="syntax-prop">coreStack</span>: [<span className="syntax-string">"React"</span>, <span className="syntax-string">"JavaScript"</span>, <span className="syntax-string">"WordPress"</span>],
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">5</span>
                <span className="dev-code-content" style={{ paddingLeft: '16px' }}>
                  <span className="syntax-prop">specialty</span>: <span className="syntax-string">"Cinematic Responsive UI/UX"</span>,
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">6</span>
                <span className="dev-code-content">&#125;;</span>
              </div>
            </>
          ) : (
            <>
              <div className="dev-code-line">
                <span className="dev-line-num">1</span>
                <span className="dev-code-content">
                  <span className="syntax-comment">// Smooth Canvas LERP Interpolation</span>
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">2</span>
                <span className="dev-code-content">
                  <span className="syntax-keyword">const</span> <span className="syntax-prop">LERP_FACTOR</span> = <span className="syntax-num">0.085</span>;
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">3</span>
                <span className="dev-code-content">
                  currentProgress += (targetProgress - currentProgress) * <span className="syntax-prop">LERP_FACTOR</span>;
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">4</span>
                <span className="dev-code-content">
                  <span className="syntax-keyword">const</span> frameIndex = Math.round(currentProgress * <span className="syntax-num">239</span>);
                </span>
              </div>
              <div className="dev-code-line">
                <span className="dev-line-num">5</span>
                <span className="dev-code-content">
                  ctx.<span className="syntax-fn">drawImage</span>(frames[frameIndex], <span className="syntax-num">0</span>, <span className="syntax-num">0</span>, cw, ch);
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
