import React, { useEffect, useRef, useState } from 'react';
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
  FiFastForward,
  FiCompass,
  FiX
} from 'react-icons/fi';
import { SelfBuildingEngine } from './SelfBuildingEngine';
import './SelfBuildingOverlay.css';

export default function SelfBuildingOverlay() {
  const stageRef = useRef(null);
  const engineRef = useRef(null);

  const [state, setState] = useState('ready'); // ready | building | paused | done
  const [statusText, setStatusText] = useState('Interactive Builder Ready');
  const [progressPercent, setProgressPercent] = useState(0);
  const [layersCount, setLayersCount] = useState({ done: 0, total: 0 });
  const [speed, setSpeed] = useState(1);
  const [sound, setSound] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [hudVisible, setHudVisible] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('sb-complete');
      return;
    }

    const engine = new SelfBuildingEngine({
      stage: stageRef.current,
      sound: true,
      onProgress: (done, total, ratio) => {
        setLayersCount({ done, total });
        setProgressPercent(Math.round(ratio * 100));
      },
      onStatus: (text) => setStatusText(text),
      onStateChange: (newState) => setState(newState),
      onLayersCount: (total) => setLayersCount((prev) => ({ ...prev, total }))
    });

    engineRef.current = engine;

    // Brief timeout then start building automatically, or user can press Space
    const timer = setTimeout(() => {
      if (!hasStarted) {
        setHasStarted(true);
        engine.start();
      }
    }, 1100);

    return () => {
      clearTimeout(timer);
      engine.destroy();
    };
  }, []);

  const handleStartOrToggle = () => {
    if (!hasStarted) {
      setHasStarted(true);
      engineRef.current?.start();
    } else {
      const isPaused = engineRef.current?.togglePause();
      setState(isPaused ? 'paused' : 'building');
    }
  };

  const handleReplay = () => {
    setHasStarted(true);
    engineRef.current?.replay();
  };

  const handleSkip = () => {
    engineRef.current?.skip();
    setHasStarted(true);
  };

  const handleToggleSound = () => {
    const isSound = engineRef.current?.toggleSound();
    setSound(isSound);
  };

  const handleCycleSpeed = () => {
    const nextSpeed = engineRef.current?.cycleSpeed();
    setSpeed(nextSpeed);
  };

  const handleToggleAuto = () => {
    const isAuto = engineRef.current?.toggleAutoScroll();
    setAutoScroll(isAuto);
  };

  return (
    <>
      {/* Dynamic Construction Stage for 18 Agents & Wireframes */}
      <div id="sb-stage" ref={stageRef} aria-hidden="true" />

      {/* Start Banner / Skip Chip for First-time visitors */}
      {!hasStarted && (
        <div className="sb-start-banner" role="status">
          <div className="sb-chip-monogram">A</div>
          <div className="sb-start-text">
            <strong>Self-Building Portfolio</strong>
            <span>18 Automated Agents Assembling Interface</span>
          </div>
          <button type="button" className="sb-btn-skip-intro" onClick={handleSkip}>
            SKIP INTRO
          </button>
        </div>
      )}

      {/* Floating Interactive Controls HUD */}
      {hudVisible && (
        <aside
          className={`sb-hud ${state === 'done' ? 'sb-hud-minimized' : ''}`}
          role="toolbar"
          aria-label="Self-Building Animation Controls"
        >
          {/* Agent Avatars Cluster */}
          <div className="sb-agent-dots" title="18 Autonomous Build Agents" aria-hidden="true">
            <span style={{ background: '#ff3348' }} />
            <span style={{ background: '#35e0c2' }} />
            <span style={{ background: '#1e90ff' }} />
            <span style={{ background: '#ffe14d' }} />
            <span style={{ background: '#ff7ac8' }} />
            <span style={{ background: '#7dff8f' }} />
          </div>

          {/* Progress Bar & Counter */}
          <div className="sb-hud-progress">
            <span className="sb-counter">
              {layersCount.done} / {layersCount.total || 42} layers
            </span>
            <div className="sb-progress-bar-bg">
              <div
                className="sb-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Status Label */}
          <span className="sb-status-badge">{statusText}</span>

          {/* Primary Play/Pause Button */}
          <button
            type="button"
            className="sb-hud-btn sb-btn-primary"
            onClick={handleStartOrToggle}
            title={state === 'building' ? 'Pause (Space)' : 'Play / Resume (Space)'}
            aria-label={state === 'building' ? 'Pause Animation' : 'Start Animation'}
          >
            {state === 'building' ? <FiPause /> : <FiPlay />}
          </button>

          {/* Auto Glide Toggle (A) */}
          <button
            type="button"
            className={`sb-hud-btn ${autoScroll ? 'active' : ''}`}
            onClick={handleToggleAuto}
            title="Auto-Scroll Glide (A)"
            aria-label="Toggle Auto-Scroll"
          >
            <FiCompass />
            <span className="sb-btn-sublabel">Auto</span>
          </button>

          {/* Speed Toggle (1x, 1.75x, 2.5x) */}
          <button
            type="button"
            className="sb-hud-btn sb-speed-btn"
            onClick={handleCycleSpeed}
            title="Cycle Playback Speed"
            aria-label={`Playback speed: ${speed}x`}
          >
            <FiFastForward />
            <span>{speed}x</span>
          </button>

          {/* Sound Toggle (M) */}
          <button
            type="button"
            className={`sb-hud-btn ${sound ? '' : 'muted'}`}
            onClick={handleToggleSound}
            title={sound ? 'Mute Sound (M)' : 'Unmute Sound (M)'}
            aria-label="Toggle Sound"
          >
            {sound ? <FiVolume2 /> : <FiVolumeX />}
          </button>

          {/* Replay Button (R) */}
          <button
            type="button"
            className="sb-hud-btn"
            onClick={handleReplay}
            title="Replay Build Animation (R)"
            aria-label="Replay Animation"
          >
            <FiRotateCcw />
          </button>

          {/* Skip Button (Esc) */}
          {state !== 'done' && (
            <button
              type="button"
              className="sb-hud-btn sb-skip-btn"
              onClick={handleSkip}
              title="Skip Animation (Esc)"
              aria-label="Skip Animation"
            >
              <span>Skip</span>
              <FiX />
            </button>
          )}
        </aside>
      )}
    </>
  );
}
