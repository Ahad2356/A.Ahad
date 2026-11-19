import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiVolume2,
  FiVolumeX,
  FiFastForward,
  FiCompass,
  FiArrowUpRight
} from 'react-icons/fi';
import { SelfBuildingEngine } from './SelfBuildingEngine';
import './SelfBuildingOverlay.css';

/*
 * A visitor who presses Skip Intro has answered the question "do you want to watch
 * this?" — making them answer it again on every route and every visit is the
 * difference between a signature and a loading screen. The choice persists; the
 * replay affordance is the documented way to take it back.
 */
const SKIP_PREF_KEY = 'sb.intro.skipped';

const NAME_LETTERS = 'ABDUL AHAD'.split('');

/** @returns {boolean} whether this browser permanently dismissed the intro */
function readSkipPref() {
  try {
    return window.localStorage.getItem(SKIP_PREF_KEY) === '1';
  } catch {
    // Private mode or disabled storage: show the intro. The preference is a
    // courtesy, not a dependency.
    return false;
  }
}

/**
 * React shell around `SelfBuildingEngine`: it owns the stage element, mirrors the
 * engine's coarse state into React (never per frame) and renders the intro card, the
 * control HUD and the signature ending. The engine instance is created once per mount and destroyed on
 * unmount, so a route change or a StrictMode double-invoke cannot stack two tours.
 * App mounts it with `key={pathname}`, so exactly one engine exists per page and each
 * one builds that page's real DOM.
 *
 * State contract: `state` mirrors `onStateChange` (`ready | building | review |
 * paused | finale | done`); `hasStarted` decides whether the intro card or the HUD is on
 * screen, and is set from the callback as well as from the buttons so a keyboard- or
 * safety-net-triggered run can never leave the page with no controls at all.
 */
export default function SelfBuildingOverlay() {
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Read once, before the first paint: under prefers-reduced-motion the engine
   * is never instantiated, so the intro card and the HUD would be controls for
   * an animation that cannot run. The page renders finished and static instead.
   */
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  // Snapshot of the persisted Skip choice, read before the first paint so a
  // returning visitor never sees the intro card flash.
  const [skipRemembered, setSkipRemembered] = useState(readSkipPref);

  const [state, setState] = useState('ready'); // ready | building | review | paused | finale | done
  const [statusText, setStatusText] = useState('Interactive Builder Ready');
  const [progressPercent, setProgressPercent] = useState(0);
  const [layersCount, setLayersCount] = useState({ done: 0, total: 0 });
  const [speed, setSpeed] = useState(1);
  const [sound, setSound] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
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
      onStateChange: (newState) => {
        setState(newState);
        // Any active, ending or finished run must surface the HUD. Without this, a
        // skip triggered from the keyboard or the engine's safety net (rather than a
        // button click) would hide the intro card *and* the controls, leaving a
        // finished page with no way to replay it.
        if (newState === 'building' || newState === 'review' || newState === 'gliding' || newState === 'finale' || newState === 'done') {
          setHasStarted(true);
        }
      },
      onLayersCount: (total) => setLayersCount((prev) => ({ ...prev, total })),
      // Keyboard-only changes (A, M, speed) must reach the HUD too.
      onControls: ({ sound: isSound, autoScroll: isAuto, speed: nextSpeed }) => {
        setSound(isSound);
        setAutoScroll(isAuto);
        setSpeed(nextSpeed);
      }
    });

    engineRef.current = engine;

    // The engine arms its own safety timer inside start(), so a visitor who never
    // presses Start is never auto-completed.
    return () => {
      engine.destroy();
    };
  }, [reducedMotion]);

  // "review" is still an active run, so the HUD must treat it like playing.
  const isRunning = state === 'building' || state === 'review';
  const isFinale = state === 'finale';

  /*
   * Generic camera hand-off for in-page jumps. Any code that moves the viewport
   * itself while a build is running (for example a future anchor-style CTA) can
   * dispatch 'sb:handoff'; skip() then stops the autopilot's per-frame scrollTo
   * so the camera is not dragged back to the block under construction. Ordinary
   * route changes do not need it — App.jsx keys this overlay by pathname, so
   * unmounting already destroys the engine and its rAF loop.
   */
  useEffect(() => {
    const isBuildingRun =
      state === 'building' || state === 'review' || state === 'paused' || state === 'finale';
    if (!isBuildingRun) return undefined;

    const onHandoff = () => {
      handleSkip();
    };

    window.addEventListener('sb:handoff', onHandoff);
    return () => window.removeEventListener('sb:handoff', onHandoff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

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

  /*
   * Choosing to watch the build again is the explicit reset of the skip
   * preference, so the chip clears the stored decision before replaying — from
   * now on the intro behaves as if it had never been dismissed.
   */
  const handleReplayFromChip = () => {
    try {
      window.localStorage.removeItem(SKIP_PREF_KEY);
    } catch {
      // Storage unavailable: the in-memory state still flips for this page.
    }
    setSkipRemembered(false);
    handleReplay();
  };

  /*
   * The engine announces every skip — the Skip button, the ESC key and an in-page
   * navigation hand-off all end in `skip()` — so the durable decision is recorded
   * here once instead of in each click handler. Without this, ESC would reveal the
   * site yet leave the intro waiting on the next route and the next visit.
   */
  useEffect(() => {
    const rememberSkip = () => {
      setSkipRemembered(true);
      try {
        window.localStorage.setItem(SKIP_PREF_KEY, '1');
      } catch {
        // Ignore: the preference is best-effort, the skip itself already happened.
      }
    };

    window.addEventListener('sb:skip', rememberSkip);
    return () => window.removeEventListener('sb:skip', rememberSkip);
  }, []);

  /**
   * Skip is final for this browser: stop the show, reveal the real page and let the
   * `sb:skip` listener remember the decision so no other route replays it.
   */
  const handleSkip = () => {
    engineRef.current?.skip();
    setHasStarted(true);
  };

  /**
   * HIRE ME is a real navigation action, not decoration: it dismisses the ending and
   * lands on the actual contact section, offset by the fixed header. On any other
   * route it mounts the homepage first, because `#contact` only exists there, and
   * waits two frames for layout before measuring.
   */
  const handleHireMe = () => {
    engineRef.current?.completeEnding();

    const jump = () => {
      const target = document.getElementById('contact');
      if (!target) return;
      const header = document.querySelector('.header-bar');
      const offset = (header?.offsetHeight || 64) + 20;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    };

    if (location.pathname !== '/') {
      navigate('/');
      requestAnimationFrame(() => requestAnimationFrame(jump));
    } else {
      jump();
    }
  };

  const handleEnterPortfolio = () => {
    engineRef.current?.completeEnding();
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

      {/* Intro Experience Card (Option A: Start Experience ↗ | Option B: Skip Intro →) */}
      {!reducedMotion && !skipRemembered && !hasStarted && state !== 'done' && (
        <div className="sb-intro-card" role="dialog" aria-label="Website Animation Introduction">
          <div className="sb-intro-header">
            <div className="sb-intro-monogram">A</div>
            <div className="sb-intro-headings">
              <strong className="sb-intro-title">Self-Building Experience</strong>
              <span className="sb-intro-desc">18 automated agents assemble this portfolio live</span>
            </div>
          </div>

          <div className="sb-intro-actions">
            <button
              type="button"
              className="sb-btn-start-exp"
              onClick={handleStartOrToggle}
              title="Start Full Website Animation (Space)"
            >
              <span>Start Experience</span>
              <FiArrowUpRight style={{ fontSize: '13px' }} />
            </button>

            <button
              type="button"
              className="sb-btn-skip-intro"
              onClick={handleSkip}
              title="Skip Directly to Portfolio (Esc)"
            >
              <span>Skip Intro</span>
              <span>→</span>
            </button>
          </div>

          <div className="sb-intro-hints" aria-hidden="true">
            <span><kbd>SPACE</kbd> Start</span>
            <span className="sb-hint-dot">·</span>
            <span><kbd>R</kbd> Replay</span>
            <span className="sb-hint-dot">·</span>
            <span><kbd>A</kbd> Slow Glide</span>
            <span className="sb-hint-dot">·</span>
            <span><kbd>ESC</kbd> Skip</span>
          </div>
        </div>
      )}

      {/* Floating Interactive Controls HUD — hidden during the ending so the
          signature sequence reads as one composition instead of a dashboard. */}
      {!reducedMotion && hasStarted && !isFinale && (
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
              {layersCount.done} / {layersCount.total} layers
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
            title={isRunning ? 'Pause (Space)' : 'Play / Resume (Space)'}
            aria-label={isRunning ? 'Pause Animation' : 'Start Animation'}
          >
            {isRunning ? <FiPause /> : <FiPlay />}
          </button>

          {/* Auto Glide Toggle (A) */}
          <button
            type="button"
            className={`sb-hud-btn ${autoScroll ? 'active' : ''}`}
            onClick={handleToggleAuto}
            title="Slow-Glide Auto Scroll (A)"
            aria-label="Toggle slow-glide auto scroll"
          >
            <FiCompass />
            <span className="sb-btn-sublabel">Glide</span>
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
              <span>Skip Intro</span>
              <span style={{ fontSize: '12px' }}>→</span>
            </button>
          )}
        </aside>
      )}

      {/*
        * Discreet replay affordance: shown whenever the stored Skip decision has
        * suppressed the intro, on every route. Deliberately low-contrast and only
        * reachable by keyboard or hover focus so it never competes with the content.
        */}
      {!reducedMotion && skipRemembered && !hasStarted && (
        <button
          type="button"
          className="sb-replay-chip"
          onClick={handleReplayFromChip}
          title="Watch the 18-agent build again"
        >
          <FiRotateCcw />
          <span>Replay Build Animation</span>
        </button>
      )}

      {/*
        * Signature ending. Deliberately NOT aria-modal: the real site is already
        * finished behind this card, focus must be able to leave it, and the engine's
        * keyboard guard treats aria-modal="true" as "a dialog owns the keys" — which
        * would stop ESC from retiring the card.
        */}
      {isFinale && !reducedMotion && (
        <div className="sb-finale" role="dialog" aria-label="Build complete — Abdul Ahad">
          <svg className="sb-emblem" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
            <rect className="sb-emblem-frame" x="46" y="36" width="108" height="128" rx="3" />
            {[
              [41, 31],
              [149, 31],
              [41, 159],
              [149, 159]
            ].map(([hx, hy], index) => (
              <rect
                key={`handle-${hx}-${hy}`}
                className="sb-emblem-handle"
                x={hx}
                y={hy}
                width="10"
                height="10"
                style={{ '--delay': `${0.68 + index * 0.06}s` }}
              />
            ))}
            <path className="sb-emblem-leg" d="M100 64 L68 148" style={{ '--delay': '0.62s' }} />
            <path className="sb-emblem-leg" d="M100 64 L132 148" style={{ '--delay': '0.7s' }} />
            <path className="sb-emblem-rule" d="M78 122 H122" />
            <path className="sb-emblem-tick" d="M78 115 V129" />
            <path className="sb-emblem-tick" d="M122 115 V129" style={{ '--delay': '1.32s' }} />
            <path className="sb-emblem-dart" d="M100 28 L118 60 L100 50 L82 60 Z" />
          </svg>

          {/* The letters are decoration; the accessible name is the real string. */}
          <div className="sb-finale-name" role="img" aria-label="Abdul Ahad">
            {NAME_LETTERS.map((character, index) => (
              <span key={`${character}-${index}`} style={{ '--i': index }}>
                {character}
              </span>
            ))}
          </div>

          <p className="sb-finale-sub">Assembled live · 18 agents</p>

          <div className="sb-finale-actions">
            <button type="button" className="sb-finale-hire" onClick={handleHireMe}>
              <span>HIRE ME</span>
              <FiArrowUpRight style={{ fontSize: '14px' }} />
            </button>
            <button type="button" className="sb-finale-enter" onClick={handleEnterPortfolio}>
              <span>Enter portfolio</span>
              <span className="sb-finale-arrow">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
