import React from 'react';
import { useCanvasScrollEngine } from '../../hooks/useCanvasScrollEngine';
import './CanvasScroll.css';

export default function CanvasScroll() {
  const { canvasRef, loadPercent, isReady } = useCanvasScrollEngine();

  return (
    <>
      {/* Preloader Screen */}
      <div className={`loader-overlay ${isReady ? 'hidden' : ''}`} aria-hidden={isReady}>
        <div className="loader-bar-bg">
          <div
            className="loader-bar-fill"
            style={{ width: `${loadPercent}%` }}
          />
        </div>
        <div className="loader-text">
          Loading A. Ahad {loadPercent}%
        </div>
      </div>

      {/* Pinned 3D Canvas Background Viewport */}
      <div className="canvas-container">
        <canvas ref={canvasRef} id="cinemaCanvas" />
        <div className="canvas-vignette" />
      </div>
    </>
  );
}
