/**
 * SelfBuildingEngine.js
 * 
 * High-performance 18-Agent Collaborative Construction Engine.
 * Recreates the self-building website animation inspired by ravi-paribrajak.vercel.app.
 * 
 * Features:
 * - 18 independently animated intelligent agents with distinct hues, roles & flight physics
 * - Smooth quadratic Bézier curved flight trajectories with natural acceleration & deceleration
 * - Wireframe blueprint bounding boxes with live dimension tags & corner anchor handles
 * - Character-by-character typewriter compilation for headings & text
 * - Click shockwaves, element stamps & specialized LHS Cut Hair/Beauty demonstration
 * - Zero-asset Web Audio API micro-sound synthesis (tick, pop, whoosh, chords) with mute toggle
 * - Autopilot camera scrolling with manual touch/wheel override & slow-glide option
 * - Full keyboard controls: SPACE (Play/Pause), R (Replay), A (Auto-Glide), ESC (Skip), M (Mute)
 * - Zero CPU waste: pauses when tab is hidden, respects prefers-reduced-motion
 */

const HUES = [
  '#ff3348', '#ff6b5e', '#ff9f43', '#ffe14d', '#7dff8f', '#2ed573',
  '#35e0c2', '#1e90ff', '#70a1ff', '#a58bff', '#d07bff', '#ff7ac8',
  '#ff4757', '#ffa502', '#26de81', '#00d2d3', '#54a0ff', '#5f27cd'
];

const ROLES = [
  'Architect', 'Layout', 'Typography', 'Interface', 'React Eng', 'Motion',
  'Components', 'Styling', 'Assets', 'Canvas', 'Optimizer', 'State'
];

// Upper bound the signature card can hold the screen when nobody interacts with it.
const FINALE_AUTO_DISMISS_MS = 11000;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pad2 = (n) => String(n).padStart(2, '0');
const rnd = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const rectOf = (el) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
};

/**
 * Drives the construction animation over the *real* page: it never renders a
 * second fake copy of the site, it reads `[data-block]` / `[data-b]` from the live
 * DOM and reveals those same nodes. All scheduling goes through one virtual clock
 * (`vt`) advanced by a single `requestAnimationFrame` loop, so pause, speed and
 * replay affect the whole sequence uniformly.
 *
 * @typedef {Object} EngineOptions
 * @property {HTMLElement} stage            Layer the agents/wireframes are drawn into.
 * @property {HTMLElement} [container]      Content root, defaults to `#main-content`.
 * @property {(done:number,total:number,progress:number)=>void} [onProgress] Completed-item count per resolved element.
 * @property {(status:string)=>void} [onStatus]      Human-readable stage line for the HUD.
 * @property {(state:string)=>void} [onStateChange]  `building` | `review` | `paused` | `done`.
 * @property {(total:number)=>void} [onLayersCount]  Real tagged-item total for the current run.
 * @property {(controls:{sound:boolean,autoScroll:boolean,speed:number})=>void} [onControls]
 *   Fired whenever a keyboard shortcut changes a control, so the React HUD mirrors it.
 */
export class SelfBuildingEngine {
  /** @param {EngineOptions} [options] */
  constructor(options = {}) {
    this.stage = options.stage;
    this.container = options.container || document.getElementById('main-content') || document.body;
    this.onProgress = options.onProgress || (() => {});
    this.onStatus = options.onStatus || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.onLayersCount = options.onLayersCount || (() => {});
    // The keyboard drives the same controls as the HUD buttons, so every change
    // is reported back and the React HUD mirrors it instead of drifting.
    this.onControls = options.onControls || (() => {});

    this.numAgents = 18;
    this.agents = [];
    this.blocks = [];
    this.groups = [];
    this.itemOf = new Map();
    this.totalItems = 0;
    this.completedItems = 0;

    // Time & Playback Controls
    this.speed = options.speed || 1;
    this.paused = false;
    this.autoOn = true;
    this.touring = false;
    this.finished = false;
    this.disposed = false;
    this.vt = 0; // Virtual timeline clock in ms
    this.tourGen = 0; // Invalidates in-flight tours after replay/skip
    this.agentGen = 0; // Invalidates old agent workers after replay
    this.rafId = 0;
    this.lastRealTime = performance.now();

    this.timers = new Set();
    this.tweens = new Set();
    this.queue = [];
    this.waiters = [];
    // Ending state: the ring holds agents still (see the loop's drift guard) and the
    // dismiss is idempotent because CTA, ESC and the safety timer can race each other.
    this.formationOn = false;
    this.endingDone = true;
    this.endingTimer = 0;

    // Sound Synthesizer via Web Audio API (Zero external assets needed)
    this.soundEnabled = options.sound !== undefined ? options.sound : true;
    this.audioCtx = null;
    this.audioOut = null;
    this.lastTickTime = 0;

    // Accessibility
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initSound();
    this.setupKeyListeners();
    this.setupScrollWatcher();
  }

  /* =========================================================================
     AUDIO SYNTHESIS (Clean, subtle micro-sounds)
     ========================================================================= */
  initSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.audioOut = this.audioCtx.createGain();
        this.audioOut.gain.value = 0.35;
        this.audioOut.connect(this.audioCtx.destination);
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  unlockAudio() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  tone(freq, dur = 0.12, type = 'triangle', vol = 0.05, when = 0) {
    if (!this.soundEnabled || !this.audioCtx || this.audioCtx.state !== 'running') return;
    try {
      const t = this.audioCtx.currentTime + when;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain);
      gain.connect(this.audioOut);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    } catch {}
  }

  tick() {
    const now = performance.now();
    if (now - this.lastTickTime < 32) return;
    this.lastTickTime = now;
    this.tone(rnd(1800, 2400), 0.022, 'square', 0.009);
  }

  pop(progress = 0) {
    const scale = [0, 2, 4, 7, 9];
    const step = Math.floor(progress * 14) + Math.floor(rnd(3));
    const semis = scale[step % 5] + 12 * Math.floor(step / 5);
    this.tone(260 * Math.pow(2, semis / 12), 0.15, 'triangle', 0.045);
  }

  chord() {
    [0, 4, 7, 12, 16].forEach((s, i) => {
      this.tone(330 * Math.pow(2, s / 12), 0.8, 'triangle', 0.04, i * 0.06);
    });
  }

  whoosh() {
    this.tone(160, 0.45, 'sawtooth', 0.015);
    this.tone(85, 0.55, 'sine', 0.04);
  }

  /* =========================================================================
     VIRTUAL CLOCK & ANIMATION LOOP
     ========================================================================= */
  wait(ms) {
    return new Promise((res) => this.timers.add({ t: this.vt + ms, res }));
  }

  tween(dur, fn) {
    return new Promise((res) => this.tweens.add({ t0: this.vt, dur: Math.max(1, dur), fn, res }));
  }

  startLoop() {
    // Guard against stacked loops: replay() calls start() again, and a second
    // rAF loop would double-advance the virtual clock (2x speed) and double the
    // per-frame agent rendering work.
    if (this.rafId) cancelAnimationFrame(this.rafId);

    const loop = (now) => {
      if (this.disposed) return;
      const realDt = Math.min(100, now - this.lastRealTime);
      this.lastRealTime = now;

      if (!this.paused && !document.hidden) {
        const dt = realDt * this.speed;
        this.vt += dt;

        // Advance timers
        for (const timer of this.timers) {
          if (this.vt >= timer.t) {
            this.timers.delete(timer);
            timer.res();
          }
        }

        // Advance tweens
        for (const tw of this.tweens) {
          const progress = clamp((this.vt - tw.t0) / tw.dur, 0, 1);
          tw.fn(progress);
          if (progress >= 1) {
            this.tweens.delete(tw);
            tw.res();
          }
        }

        // Drift idle agents & render all agents
        for (const agent of this.agents) {
          if (agent.idle && !this.formationOn) {
            agent.drift(dt, this.vt);
          }
          agent.render();
        }
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.lastRealTime = performance.now();
    this.rafId = requestAnimationFrame(loop);
  }

  /* =========================================================================
     18 AGENT ROSTER INITIALIZATION
     ========================================================================= */
  createAgents() {
    if (!this.stage) return;
    this.stage.innerHTML = '';
    this.agents = [];
    // New generation: any worker still parked from a previous run exits on wake.
    this.agentGen++;

    const arrowSvg = (c) => `
      <svg class="sb-arrow" viewBox="0 0 17 22">
        <path d="M2 1.5v16l4.4-4 3 7 2.6-1.1-3-6.9h6z" fill="${c}" stroke="#ffffff" stroke-width="1.3" stroke-linejoin="round"/>
      </svg>
    `;

    const crossSvg = `
      <svg class="sb-cross" viewBox="0 0 18 18">
        <path d="M9 1v16M1 9h16" stroke="#060508" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M9 1v16M1 9h16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;

    const ibeamSvg = `
      <svg class="sb-ibeam" viewBox="0 0 18 18">
        <path d="M5.5 1.5h7M5.5 16.5h7M9 1.5v15" stroke="#060508" stroke-width="4.2" stroke-linecap="round"/>
        <path d="M5.5 1.5h7M5.5 16.5h7M9 1.5v15" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    `;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < this.numAgents; i++) {
      const color = HUES[i % HUES.length];
      const role = ROLES[i] || null;

      const el = document.createElement('div');
      el.className = 'sb-agent';
      el.style.color = color;

      let html = arrowSvg(color) + crossSvg + ibeamSvg + '<span class="sb-ring"></span>';
      if (role) {
        html += `<span class="sb-role-badge" style="background:${color}">${role}</span>`;
      }
      el.innerHTML = html;
      this.stage.appendChild(el);

      const agent = {
        i,
        color,
        role,
        el,
        x: centerX + rnd(-60, 60),
        y: centerY + rnd(-60, 60),
        vx: 0,
        vy: 0,
        idle: true,
        phase: rnd(Math.PI * 2),
        rad: rnd(0.7, 1.3),
        w: rnd(0.8, 1.4) * (Math.random() < 0.5 ? 1 : -1),
        wt: null,
        wUntil: 0,

        mode: (m) => {
          el.dataset.mode = m;
        },

        click: () => {
          // Restart the CSS shockwave animation: removing then re-adding the class in
          // the same frame is a no-op unless the pending style change is flushed.
          el.classList.remove('click');
          void el.offsetWidth;
          el.classList.add('click');
        },

        /**
         * Quadratic Bézier flight to (x, y). The control point is offset
         * perpendicular to the travel vector by a random bend, which is what makes
         * paths read as hand-drawn instead of linear; `straight: true` skips it (used
         * by the review pass, where deliberate lines look like inspection). Duration
         * grows with distance so short hops stay snappy. Scheduled on the virtual
         * clock, so pausing freezes every agent mid-flight together.
         */
        moveTo: (x, y, o = {}) => {
          const sx = agent.x;
          const sy = agent.y;
          const dx = x - sx;
          const dy = y - sy;
          const dist = Math.hypot(dx, dy) || 1;
          const dur = o.dur ?? clamp(90 + dist * 0.22, 100, 340);
          const bend = o.straight ? 0 : rnd(-1, 1) * Math.min(130, dist * 0.28);
          const cx = (sx + x) / 2 - (dy / dist) * bend;
          const cy = (sy + y) / 2 + (dx / dist) * bend;

          agent.vx = 0;
          agent.vy = 0;

          return this.tween(dur, (k) => {
            const e = ease(k);
            const u = 1 - e;
            agent.x = u * u * sx + 2 * u * e * cx + e * e * x;
            agent.y = u * u * sy + 2 * u * e * cy + e * e * y;
          });
        },

        /**
         * Idle behaviour: orbit the viewport centre on a spring instead of freezing,
         * so unused agents still feel alive. Driven from the shared loop with the
         * frame's `dt`, so there is no per-agent timer to leak or clean up.
         */
        drift: (dt, t) => {
          const c = { x: window.scrollX + window.innerWidth / 2, y: window.scrollY + window.innerHeight / 2 };
          const R = Math.min(window.innerWidth, window.innerHeight) * 0.16 * agent.rad + 32;
          const a = agent.phase + t * 0.001 * agent.w;
          const tx = c.x + Math.cos(a) * R * (1 + 0.16 * Math.sin(t * 0.002 + agent.i));
          const ty = c.y + Math.sin(a) * R;

          const k = 4.2;
          const maxVel = 950;
          let dvx = (tx - agent.x) * k;
          let dvy = (ty - agent.y) * k;
          const m = Math.hypot(dvx, dvy);
          if (m > maxVel) {
            dvx *= maxVel / m;
            dvy *= maxVel / m;
          }
          const s = Math.min(1, (dt * 0.0055));
          agent.vx += (dvx - agent.vx) * s;
          agent.vy += (dvy - agent.vy) * s;
          agent.x += (agent.vx * dt) / 1000;
          agent.y += (agent.vy * dt) / 1000;
        },

        render: () => {
          el.style.transform = `translate3d(${agent.x.toFixed(1)}px, ${agent.y.toFixed(1)}px, 0)`;
        }
      };

      this.agents.push(agent);
    }
  }

  /* =========================================================================
     JOB DISPATCHER: Idle agents grab nearest task
     ========================================================================= */
  enqueue(job, at, prefer) {
    if (this.waiters.length) {
      let bestIndex = 0;
      let bestDist = Infinity;
      this.waiters.forEach((w, i) => {
        const d = prefer === w.agent ? -1 : at ? Math.hypot(w.agent.x - at.x, w.agent.y - at.y) : 0;
        if (d < bestDist) {
          bestDist = d;
          bestIndex = i;
        }
      });
      const waiter = this.waiters.splice(bestIndex, 1)[0];
      waiter.res(job);
    } else {
      this.queue.push(job);
    }
  }

  /**
   * Hand a job to the next free agent, preferring the one nearest `at` (or the
   * explicitly preferred agent). Returns a promise for that single job, so a caller
   * can await one element without knowing which agent drew it. Job bodies are wrapped
   * so a throw in one element cannot strand the agent or the caller.
   */
  dispatch(fn, at, prefer) {
    return new Promise((res) => {
      this.enqueue(
        async (agent) => {
          try {
            await fn(agent);
          } catch (err) {
            console.error('Agent job error:', err);
          }
          res();
        },
        at,
        prefer
      );
    });
  }

  async runAgentWorker(agent, gen) {
    while (!this.disposed && gen === this.agentGen) {
      const job = this.queue.shift() || (await new Promise((res) => this.waiters.push({ agent, res })));
      if (this.disposed) break;
      agent.idle = false;
      await job(agent);
      agent.mode('arrow');
      agent.idle = true;
    }
  }

  /* =========================================================================
     PAGE BLOCKS & ITEM EXTRACTION (ALL 8 SECTIONS ACROSS COMPLETE PORTFOLIO)
     ========================================================================= */
  /**
   * Read the live DOM and turn it into the build plan.
   *
   * Blocks are `[data-block]` elements sorted by `getSectionScore()` so the tour
   * follows semantic portfolio order (navbar → hero → … → footer) rather than raw
   * document order; an item only belongs to its innermost block, which keeps a
   * nested `[data-b]` from being built twice. Also resets the counters the HUD
   * reads and applies `html.sb-building`, so nothing is visible until built.
   */
  discoverBlocks() {
    this.itemOf.clear();
    
    // Discover all data-blocks across both the navbar and page body
    const allBlocks = [...document.querySelectorAll('[data-block]')];

    /*
     * Order blocks semantically by the homepage's portfolio flow:
     * 10 Navbar · 20 Hero · 30 About · 40 Skills · 50 Certificates ·
     * 60 Featured Projects · 70 Contact · 75 Particle signature · 80 Footer.
     * Every other route gets one identical score, which leaves the stable sort in
     * DOM order — navbar, that page's own sections, footer — because the homepage
     * anchors above simply are not on those pages and would build the footer second.
     */
    const isHome = window.location.pathname === '/';
    const getSectionScore = (el) => {
      if (!isHome) return 100;
      if (el.matches('header.header-bar, .header-bar') || el.closest('.header-bar')) return 10;
      if (el.closest('.hero-section')) return 20;
      if (el.closest('#about')) return 30;
      if (el.closest('.three-panel-grid') || el.matches('.panel-card')) return 40;
      if (el.matches('.certs-heading-wrap, .certs-stack') || el.closest('#certificates')) return 50;
      if (el.closest('#projects')) return 60;
      if (el.closest('#contact')) return 70;
      if (el.closest('.particle-signature')) return 75;
      if (el.matches('footer#footer, footer') || el.closest('footer')) return 80;
      return 90;
    };

    allBlocks.sort((a, b) => getSectionScore(a) - getSectionScore(b));

    this.blocks = allBlocks.map((el) => {
      const itemEls = [el, ...el.querySelectorAll('[data-b]')].filter(
        (x) => x.hasAttribute('data-b') && x.closest('[data-block]') === el
      );

      const items = itemEls.map((e) => {
        const it = { el: e, wire: null, fin: false };
        it.done = new Promise((r) => (it.finish = r));
        this.itemOf.set(e, it);
        return it;
      });

      return { el, score: getSectionScore(el), items, promise: null, fin: false };
    });

    /*
     * Camera stops ("groups"): consecutive blocks of the same section score that
     * fit within one viewport of the group's first block are built together, so a
     * tall section becomes several stops instead of one impossible jump. Computed
     * once here — the tour iterates these instead of re-deriving boundaries, so the
     * `0X/0Y ·` status numbering is the same numbering the director actually uses.
     * Non-homepage routes all score 100, which is exactly why this has to be
     * structural rather than a hardcoded eight-item list.
     */
    const vh = window.innerHeight;
    this.groups = [];
    for (const block of this.blocks) {
      const r = rectOf(block.el);
      const last = this.groups[this.groups.length - 1];
      if (last && last.score === block.score && r.y + r.h <= last.top + vh - 40) {
        last.blocks.push(block);
        continue;
      }
      this.groups.push({ score: block.score, top: r.y, blocks: [block] });
    }

    this.totalItems = this.itemOf.size;
    this.completedItems = 0;
    this.onLayersCount(this.totalItems);

    // Initial state: hide building elements so they can be constructed progressively
    document.documentElement.classList.add('sb-building');
  }

  /* =========================================================================
     WIREFRAME & RESOLUTION WORKERS
     ========================================================================= */
  makeWireframe(r) {
    const w = document.createElement('div');
    w.className = 'sb-wire' + (r.w < 50 ? ' sm' : '');
    w.innerHTML = '<u></u><u></u><u></u><u></u><em></em>';
    w.style.cssText = `left:${r.x}px;top:${r.y}px;width:0px;height:0px;`;
    this.stage.appendChild(w);
    return w;
  }

  async wireJob(agent, item) {
    const r = rectOf(item.el);
    await agent.moveTo(r.x, r.y);
    agent.mode('cross');

    const wire = (item.wire = this.makeWireframe(r));
    const dim = wire.querySelector('em');
    const sx = agent.x;
    const sy = agent.y;

    await this.tween(clamp(70 + Math.hypot(r.w, r.h) * 0.13, 80, 240), (k) => {
      const e = ease(k);
      agent.x = sx + r.w * e;
      agent.y = sy + r.h * e;
      wire.style.width = `${r.w * e}px`;
      wire.style.height = `${r.h * e}px`;
      if (dim) {
        dim.textContent = `${Math.round(r.w * e)} × ${Math.round(r.h * e)}`;
      }
    });

    this.tick();
    agent.mode('arrow');
  }

  /**
   * Typewriter reveal for one text element, on the real node.
   *
   * Walks text nodes with a TreeWalker and wraps each character in `.sb-char`, so
   * nested markup (`<span>`, `<br>`, links) survives and only the characters are
   * scheduled. The I-beam cursor is repositioned from the last revealed character's
   * rect, which is what makes the agent look like it is actually typing.
   * `innerHTML` is restored from the original string afterwards, leaving the DOM
   * byte-identical to what the component rendered — the animation never mutates content.
   */
  async splitAndType(el, agent) {
    const origHTML = el.innerHTML;
    const spans = [];
    const textNodes = [];
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (tw.nextNode()) textNodes.push(tw.currentNode);

    for (const tn of textNodes) {
      const frag = document.createDocumentFragment();
      for (const ch of tn.textContent) {
        const s = document.createElement('span');
        s.className = 'sb-char';
        s.textContent = ch;
        frag.appendChild(s);
        spans.push(s);
      }
      tn.replaceWith(frag);
    }

    el.classList.add('sb-resolved');
    const totalChars = spans.length;
    let revealed = 0;

    await this.tween(clamp(totalChars * 5, 70, 340), (k) => {
      const upto = Math.round(k * totalChars);
      if (upto <= revealed) return;
      for (let i = revealed; i < upto; i++) {
        spans[i].classList.add('v');
      }
      revealed = upto;
      const lastSpan = spans[upto - 1];
      if (lastSpan) {
        const r = lastSpan.getBoundingClientRect();
        if (r.height) {
          agent.x = r.right + window.scrollX + 2;
          agent.y = r.top + r.height / 2 + window.scrollY;
        }
      }
      this.tick();
    });

    el.innerHTML = origHTML;
  }

  /**
   * Second phase for one item: turn its wireframe into the real element.
   * `data-b="text"` types itself, `data-b="box"` gets a click and a stamp. The
   * LHS Cut card is the one scripted interaction — the agent presses both
   * Hair/Beauty tabs so the switcher is demonstrated with the real handler, not
   * a fake preview. Always ends by advancing the progress counters and resolving
   * `item.done`, which is what `buildBlock()` waits on.
   */
  async resolveJob(agent, item) {
    const el = item.el;
    const kind = el.dataset.b;
    const r = rectOf(el);

    if (kind === 'text') {
      await agent.moveTo(r.x + 3, r.y + Math.min(r.h / 2, 14));
      agent.mode('ibeam');
      if (item.wire) item.wire.classList.add('edit');
      await this.splitAndType(el, agent);
    } else {
      await agent.moveTo(r.x + r.w * rnd(0.25, 0.75), r.y + r.h * rnd(0.3, 0.7));
      agent.click();
      el.classList.add('sb-resolved');

      // Special interaction: If building the LHS Cut card, trigger Hair/Beauty tabs to demonstrate dual experience!
      const tabs = el.querySelectorAll('.exp-tab');
      if (tabs.length === 2) {
        await this.wait(100);
        const beautyTab = tabs[1];
        const btRect = rectOf(beautyTab);
        await agent.moveTo(btRect.x + btRect.w / 2, btRect.y + btRect.h / 2, { dur: 170 });
        agent.click();
        beautyTab.click();
        this.pop(0.7);
        await this.wait(200);

        const hairTab = tabs[0];
        const htRect = rectOf(hairTab);
        await agent.moveTo(htRect.x + htRect.w / 2, htRect.y + htRect.h / 2, { dur: 160 });
        agent.click();
        hairTab.click();
        this.pop(0.75);
      } else {
        await this.wait(50);
      }
    }

    if (item.wire) {
      const w = item.wire;
      w.classList.add('out');
      setTimeout(() => w.remove(), 220);
      item.wire = null;
    }

    this.completedItems++;
    const progress = this.totalItems ? this.completedItems / this.totalItems : 1;
    this.onProgress(this.completedItems, this.totalItems, progress);
    this.pop(progress);
    item.finish();
  }

  /**
   * Build one block: every wireframe first, then every resolve, each stage fanned
   * out across whichever agents are free (small `wait()` gaps stagger the jobs so
   * the section reads as a team, not a queue). The memoized `block.promise` makes a
   * second call a no-op, so overlapping section groups cannot double-build a block.
   */
  buildBlock(block) {
    if (block.promise) return block.promise;

    return (block.promise = (async () => {
      const at = (it) => {
        const r = rectOf(it.el);
        return { x: r.x, y: r.y };
      };

      // Phase 1: Draw wireframes
      const p1 = [];
      for (const it of block.items) {
        p1.push(this.dispatch((a) => this.wireJob(a, it), at(it)));
        await this.wait(14);
      }
      await Promise.all(p1);
      await this.wait(70);

      // Phase 2: Resolve and build items
      const p2 = [];
      for (const it of block.items) {
        p2.push(this.dispatch((a) => this.resolveJob(a, it), at(it)));
        await this.wait(20);
      }
      await Promise.all(p2);
      block.fin = true;
      block.el.classList.add('sb-resolved');

      // NOTE: completion is never triggered from markup (no data-attribute hook on
      // the footer). runTour() owns the ending so the review pass and the signature
      // sequence always run, even when blocks finish out of order.
    })());
  }

  /* =========================================================================
     AUTOPILOT TOUR & SCROLL DIRECTOR
     ========================================================================= */
  /**
   * Autopilot camera move. The `gen` argument is the tour generation captured by
   * the caller: every frame of the tween writes scroll position only while that
   * generation is still current, so `skip()`/`replay()`/`sb:handoff` (which all
   * bump `tourGen`) instantly stop the camera instead of fighting the user's scroll.
   * @returns {Promise<void>} resolves when the glide finishes or is a no-op.
   */
  scrollToY(targetY, dur, gen) {
    const fromY = window.scrollY;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const toY = clamp(targetY, 0, maxScroll);
    if (Math.abs(toY - fromY) < 3) return Promise.resolve();

    return this.tween(dur, (k) => {
      if (gen === this.tourGen) {
        window.scrollTo(0, fromY + (toY - fromY) * ease(k));
      }
    });
  }

  /**
   * The tour director. Iterates the camera stops `discoverBlocks()` prepared (one per
   * viewport-sized slice of a section), then per stop: update status → glide → dispatch
   * the blocks in parallel → short gap. `isAlive()` is checked after every await, which
   * is what makes a mid-run skip return immediately rather than keep building behind
   * the finished page. Ends with `runReview()` and only then `runFinale()`, so the
   * review and the signature ending always play regardless of block completion order.
   */
  async runTour() {
    const myGen = ++this.tourGen;
    const isAlive = () => myGen === this.tourGen && !this.disposed;
    this.touring = true;
    this.onStateChange('building');

    for (let g = 0; g < this.groups.length; g++) {
      if (!isAlive()) return;
      const currentScore = this.groups[g].score;
      const firstEl = this.groups[g].blocks[0].el;
      const top = rectOf(firstEl).y;

      // Calculate camera scroll target for current section
      let targetY = 0;
      if (currentScore <= 20) {
        targetY = 0;
      } else if (currentScore === 30) {
        const aboutEl = document.getElementById('about');
        targetY = aboutEl ? Math.max(0, rectOf(aboutEl).y - 70) : top - 40;
      } else if (currentScore === 40) {
        const skillsEl = document.querySelector('.three-panel-grid') || firstEl;
        targetY = Math.max(0, rectOf(skillsEl).y - 70);
      } else if (currentScore === 50) {
        const certsEl = document.getElementById('certificates') || firstEl;
        targetY = Math.max(0, rectOf(certsEl).y - 80);
      } else if (currentScore === 60) {
        const projEl = document.querySelector('.projects-trio') || document.getElementById('projects');
        targetY = projEl ? Math.max(0, rectOf(projEl).y - 80) : top - 50;
      } else if (currentScore === 70) {
        const contactEl = document.getElementById('contact');
        targetY = contactEl ? Math.max(0, rectOf(contactEl).y - 70) : top - 40;
      } else if (currentScore === 80) {
        targetY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      } else {
        // Unregistered content, and every block on a non-homepage route: stop the
        // camera at the block itself instead of guessing a homepage anchor that is
        // not on this page.
        targetY = Math.max(0, top - 40);
      }

      const group = this.groups[g].blocks.filter((b) => !b.fin);

      if (group.length) {
        this.updateSectionStatus(firstEl, {
          index: g + 1,
          total: this.groups.length,
          // The whole stop, not just its first block: a section heading can live in
          // a sibling block, and naming it beats the generic fallback line.
          els: this.groups[g].blocks.map((b) => b.el)
        });

        let scrollPromise = Promise.resolve();
        if (this.autoOn) {
          const dist = Math.abs(targetY - window.scrollY);
          scrollPromise = this.scrollToY(targetY, clamp(dist * 0.55, 200, 560), myGen);
        }

        await this.wait(g === 0 ? 0 : 100);
        if (!isAlive()) return;

        const buildPromises = group.map((b, idx) =>
          this.wait(idx * 45).then(() => this.buildBlock(b))
        );

        await Promise.all([scrollPromise, ...buildPromises]);
        if (!isAlive()) return;

        await this.wait(g === 0 ? 220 : 150);
        if (!isAlive()) return;
      }
    }

    if (isAlive()) {
      await this.runReview();
    }
    if (isAlive()) {
      this.runFinale();
    }
  }

  /* =========================================================================
     REVIEW STAGE
     A short inspection pass over the finished viewport: a scan line sweeps
     the composition while three agents fly deliberate inspection paths. This
     is the "review" beat of the reference, kept under a second so it reads as
     a quality check rather than dead time.
     ========================================================================= */
  async runReview() {
    if (!this.stage) return;
    this.onStateChange('review');
    this.onStatus('Reviewing layout, spacing & interactions…');

    const scan = document.createElement('div');
    scan.className = 'sb-review-scan';
    this.stage.appendChild(scan);

    const vh = window.innerHeight;
    const scrollTop = window.scrollY;
    const inspectors = this.agents.slice(0, 3);

    // Take the inspectors out of idle drift so the tween owns their position.
    inspectors.forEach((a) => { a.idle = false; });

    const sweep = this.tween(820, (k) => {
      scan.style.transform = `translate3d(0, ${scrollTop + vh * ease(k)}px, 0)`;
    });

    const flights = inspectors.map((agent, i) =>
      agent.moveTo(
        window.scrollX + window.innerWidth * (0.15 + i * 0.35),
        scrollTop + vh * (0.55 - i * 0.12),
        { dur: 700, straight: true }
      )
    );

    await Promise.all([sweep, ...flights]);

    inspectors.forEach((a) => { a.idle = true; });
    scan.remove();
    this.whoosh();
  }

  /**
   * HUD status line for a camera stop. `0X/0Y` always comes from `ctx` — the stop
   * number and the stop total that `discoverBlocks()` prepared for THIS route — so
   * the counter can never claim sections the page does not have. The eight curated
   * lines below name the homepage's real sections and are gated to the homepage;
   * everywhere else the label is the first heading inside the block being built, so
   * a page the engine has never heard of still reports something true.
   */
  updateSectionStatus(el, ctx) {
    const stop = ctx ? `${pad2(ctx.index)}/${pad2(ctx.total)} · ` : '';
    const isHome = window.location.pathname === '/';
    const inNavbar = el.matches('header.header-bar, .header-bar') || !!el.closest('.header-bar');
    const inFooter = el.matches('footer#footer, footer') || !!el.closest('footer');

    if (inNavbar) this.onStatus(stop + 'Assembling Navbar & Navigation...');
    else if (isHome && el.closest('.hero-section')) this.onStatus(stop + 'Constructing Hero & Identity...');
    else if (isHome && el.closest('#about')) this.onStatus(stop + 'Building About & Journey...');
    else if (isHome && (el.closest('.three-panel-grid') || el.matches('.panel-card'))) {
      this.onStatus(stop + 'Assembling Tech Arsenal & Skills...');
    } else if (isHome && (el.matches('.certs-heading-wrap, .certs-stack') || el.closest('#certificates'))) {
      this.onStatus(stop + 'Validating Certifications & Credentials...');
    } else if (isHome && el.closest('#projects')) {
      this.onStatus(stop + 'Building Showcase: LHS Cut, Pioneer & 32 Dental...');
    } else if (isHome && el.closest('#contact')) {
      this.onStatus(stop + 'Connecting Contact Gateway & Socials...');
    } else if (inFooter) {
      this.onStatus(stop + (isHome ? 'Finalizing Complete Portfolio...' : 'Finalizing Footer & Social Links...'));
    } else if (ctx) {
      const headingEl = (ctx.els || [el])
        .map((e) => (e.matches('h1, h2, .section-tag') ? e : e.querySelector('h1, h2, .section-tag')))
        .find((h) => h && h.textContent.trim());
      const label = (headingEl?.textContent || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 34);
      this.onStatus(stop + (label || 'Assembling this page…'));
    } else {
      this.onStatus('Assembling Portfolio...');
    }
  }

  /* =========================================================================
     FINALE: SIGNATURE ENDING (symbol → name → HIRE ME)
     The engine only owns the physical part of the ending: finish the page, pull
     every agent into a ring around the centre and hold it while React renders the
     emblem card. Nothing about the symbol, the name or the call-to-action lives
     here, so the ending stays declarative, focusable and accessible.
     ========================================================================= */

  /**
   * Resolve the whole real page: used by Skip and by the start of the finale.
   * The completion classes are removed again after 1.2 s so the page ends up
   * governed by its own CSS (hover, transforms) rather than by `!important`s.
   */
  revealFinishedPage() {
    document.documentElement.classList.remove('sb-building');
    document.documentElement.classList.add('sb-complete');
    document.querySelectorAll('[data-block], [data-b]').forEach((el) => el.classList.add('sb-resolved'));
    setTimeout(() => {
      document.documentElement.classList.remove('sb-complete');
      document.querySelectorAll('.sb-resolved').forEach((el) => el.classList.remove('sb-resolved'));
    }, 1200);
  }

  /**
   * Fly all 18 agents onto an ellipse around the viewport centre — the same
   * straight-line flight mode the review pass uses, staggered by index so the ring
   * closes like a forming crew rather than snapping. Each agent clicks on arrival,
   * which is the 18-shockwave signature beat under the emblem.
   */
  async convergeAgents(gen) {
    if (!this.agents.length) return;
    const cx = window.scrollX + window.innerWidth / 2;
    const cy = window.scrollY + window.innerHeight / 2;
    const rx = Math.min(window.innerWidth * 0.36, 430);
    const ry = Math.min(window.innerHeight * 0.3, 230);

    await Promise.all(
      this.agents.map((agent, i) => {
        const angle = (i / this.agents.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        return this.dispatch(
          (a) => a.moveTo(x, y, { dur: 300 + i * 14, straight: true }).then(() => a.click()),
          { x, y },
          agent
        );
      })
    );

    if (gen !== this.tourGen || this.disposed) return;
    // Freeze idle orbiting so the ring holds while the card animates; the main loop
    // checks this instead of the per-agent idle flag, which workers keep toggling.
    this.formationOn = true;
  }

  /**
   * Enter the ending state. Everything is already resolved, so the finished site is
   * live behind the card and the card is an overlay, not a gate. The auto-dismiss is
   * a safety timeout, not a countdown the visitor has to watch.
   */
  async runFinale() {
    const gen = this.tourGen;
    this.finished = true;
    this.started = true;
    this.touring = false;
    this.endingDone = false;
    this.revealFinishedPage();
    this.onStatus('Signature — A. AHAD');
    this.onStateChange('finale');

    await this.convergeAgents(gen);
    if (gen !== this.tourGen || this.disposed || this.endingDone) return;
    this.chord();
    clearTimeout(this.endingTimer);
    this.endingTimer = setTimeout(() => this.completeEnding(), FINALE_AUTO_DISMISS_MS);
  }

  /**
   * Leave the ending: dismissed by the CTA, by "Enter portfolio", by ESC (which
   * routes through `skip()`) or by the safety timer. Idempotent, because all four
   * can happen in any order — including the timer firing after a click.
   */
  completeEnding() {
    if (this.endingDone) return;
    this.endingDone = true;
    this.formationOn = false;
    clearTimeout(this.endingTimer);
    this.onStatus('Done — Portfolio Ready');
    this.onStateChange('done');
    if (this.stage) this.stage.classList.add('sb-fade-out');
  }

  /* =========================================================================
     START, PAUSE, REPLAY & SKIP CONTROLS
     ========================================================================= */
  /**
   * Begin (or re-begin) a construction run: discover → agents → clock → workers →
   * tour. Idempotent while a run is in flight (`started && !finished`), which is what
   * stops a double SPACE from starting a second tour. `replay()` clears the flag to
   * get a fresh run. Called from a user gesture so the AudioContext can unlock.
   */
  async start() {
    if (this.started && !this.finished) return;
    this.started = true;
    this.finished = false;
    this.paused = false;
    this.unlockAudio();
    this.discoverBlocks();
    this.createAgents();
    this.startLoop();

    // Safety net armed on start (not on mount): a visitor may read the intro card
    // for minutes before pressing Start, and the run must never self-complete
    // before it has actually begun. If frame scheduling stalls mid-run, finish.
    clearTimeout(this.safetyTimer);
    this.safetyTimer = setTimeout(() => {
      if (!this.finished) this.skip();
    }, 55000);

    // Spawn agent worker loops for this generation only
    for (const agent of this.agents) {
      this.runAgentWorker(agent, this.agentGen);
    }

    this.whoosh();
    await this.wait(150);
    this.runTour();
  }

  togglePause() {
    this.paused = !this.paused;
    this.onStateChange(this.paused ? 'paused' : 'building');
    if (!this.paused) {
      this.lastRealTime = performance.now();
      this.unlockAudio();
    }
    return this.paused;
  }

  /**
   * Restart the whole build from the top of the page. Tears the current run down
   * first (generation bump + timer/tween/queue clear + parked workers released),
   * strips every resolved/complete class, resets the clock to 0, then clears
   * `started` so `start()` actually runs — without that line a replay after a
   * finished or skipped run silently no-ops, because `start()` refuses to overlap.
   * There is exactly one engine instance per mount, so replay can never create a
   * second set of agents or a second rAF loop.
   */
  replay() {
    clearTimeout(this.safetyTimer);
    clearTimeout(this.endingTimer);
    this.tourGen++;
    this.formationOn = false;
    this.endingDone = true;
    this.timers.clear();
    this.tweens.clear();
    this.queue = [];
    // Release parked workers with a no-op job so they can observe the new
    // generation and exit instead of being retained forever.
    this.waiters.forEach((w) => w.res(async () => {}));
    this.waiters = [];

    // Remove any remaining wires
    if (this.stage) {
      this.stage.querySelectorAll('.sb-wire').forEach((w) => w.remove());
      this.stage.classList.remove('sb-fade-out');
    }

    // Reset resolved elements
    document.documentElement.classList.remove('sb-complete');
    document.documentElement.classList.remove('sb-gliding');
    document.querySelectorAll('.sb-resolved').forEach((el) => {
      el.classList.remove('sb-resolved');
    });

    window.scrollTo(0, 0);
    this.finished = false;
    this.paused = false;
    // start() refuses to run while a build is in flight; clearing the flag is
    // what turns this into "build again" instead of "start() no-ops and the
    // page just sits reset".
    this.started = false;
    this.vt = 0;

    this.start();
  }

  /**
   * End the show immediately and leave a *complete* site. Same teardown as
   * `replay()`, then every `[data-block]`/`[data-b]` is force-resolved and reported
   * as done — including when skip is pressed before the build ever started, where
   * `discoverBlocks()` never ran, hence the DOM-count fallback for the total. The
   * completion classes are dropped again after 1.2 s so normal hover/transform CSS
   * takes back over; nothing stays hidden or greyed. Also the handler for
   * `sb:handoff`: any in-page camera jump can dispatch it, since the autopilot
   * would otherwise rewrite `window.scrollTo` every frame.
   */
  skip() {
    clearTimeout(this.safetyTimer);
    clearTimeout(this.endingTimer);
    this.tourGen++;
    this.formationOn = false;
    // A skip during the ending must retire the card as well as the tour, otherwise
    // the dismiss timer can fire later and rewrite the HUD state of a new run.
    this.endingDone = true;
    this.timers.clear();
    this.tweens.clear();
    this.queue = [];
    this.waiters.forEach((w) => w.res(async () => {}));
    this.waiters = [];

    // Immediately resolve all blocks
    document.querySelectorAll('.sb-wire').forEach((w) => w.remove());
    document.documentElement.classList.remove('sb-building');
    document.documentElement.classList.remove('sb-gliding');
    document.documentElement.classList.add('sb-complete');
    document.querySelectorAll('[data-block], [data-b]').forEach((el) => el.classList.add('sb-resolved'));

    // After a brief settle, remove animation classes entirely so normal CSS takes over
    setTimeout(() => {
      document.documentElement.classList.remove('sb-complete');
      document.querySelectorAll('.sb-resolved').forEach(el => el.classList.remove('sb-resolved'));
    }, 1200);

    if (this.stage) {
      this.stage.classList.add('sb-fade-out');
    }

    this.finished = true;
    this.started = true;
    this.touring = false;
    // Skipping before the build ever started means discoverBlocks() never ran,
    // so report the real tagged-item count from the DOM instead of 0/0.
    const total = this.itemOf.size || document.querySelectorAll('[data-b]').length;
    this.onLayersCount(total);
    this.onProgress(total, total, 1);
    this.onStatus('Portfolio Ready');
    this.onStateChange('done');
    // ESC, the Skip button and a navbar hand-off all land here, so this event is the
    // single signal the shell uses to persist "don't play the intro again" — which
    // keeps the keyboard path and the button path from disagreeing.
    window.dispatchEvent(new CustomEvent('sb:skip'));
  }

  /**
   * Post-build slow glide, reconstructed from the reference's `cruise()`:
   * a single unhurried top-to-bottom camera pass once the page is finished.
   *
   * The reference's A key is context-sensitive — during the build it toggles the
   * auto-scroll tour, but once `finished` it runs the glide. Mirroring that here
   * makes the HUD's "Slow Glide" affordance truthful after completion. Runs on the
   * shared virtual clock (so pause/speed still apply), is invalidated by replay /
   * skip through the tour generation token, and never leaves the page mid-scroll.
   */
  async runGlide() {
    if (this.disposed) return;
    const gen = ++this.tourGen;
    const alive = () => gen === this.tourGen && !this.disposed;
    this.touring = false;
    // Take direct control of the camera: disable CSS smooth scroll so each
    // tweened scrollTo() lands on the exact frame the engine writes it.
    document.documentElement.classList.add('sb-gliding');
    this.onStatus('Gliding through the finished portfolio…');
    this.onStateChange('gliding');

    // Return to the top, pause, then descend at a steady ~0.17 px/ms — the
    // reference's own rate (cruise uses d / 0.17 as the tween duration).
    await this.scrollToY(0, 900, gen);
    if (!alive()) return;
    await this.wait(450);
    if (!alive()) return;

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const dist = Math.max(0, maxScroll - window.scrollY);
    const dur = Math.max(1, dist / 0.17);
    await this.tween(dur, (k) => {
      if (alive()) window.scrollTo(0, maxScroll - dist * (1 - k));
    });
    document.documentElement.classList.remove('sb-gliding');
    if (alive()) {
      this.onStatus('Done — Portfolio Ready');
      this.onStateChange('done');
    }
  }

  toggleAutoScroll() {
    // Context-sensitive like the reference: A is the slow-glide once the build
    // is finished, and the ordinary auto-scroll toggle while it is running.
    if (this.finished) {
      this.runGlide();
      return this.autoOn;
    }
    // An explicit toggle wins over the pending "resume glide after the user
    // scrolled" timer, otherwise a wheel interrupt could switch glide back on.
    clearTimeout(this.scrollTimeout);
    this.autoOn = !this.autoOn;
    this.emitControls();
    return this.autoOn;
  }

  cycleSpeed() {
    if (this.speed === 1) this.speed = 1.75;
    else if (this.speed === 1.75) this.speed = 2.5;
    else this.speed = 1;
    this.emitControls();
    return this.speed;
  }

  emitControls() {
    this.onControls({ sound: this.soundEnabled, autoScroll: this.autoOn, speed: this.speed });
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.emitControls();
    return this.soundEnabled;
  }

  /* =========================================================================
     KEYBOARD SHORTCUTS & INTERACTION LISTENERS
     ========================================================================= */
  /**
   * SPACE (start/pause/replay), R (replay), A (slow-glide), M (mute), ESC (skip).
   * The guards below exist so a global shortcut never steals input from something
   * that needs the key more; every accepted shortcut calls `preventDefault()` so
   * SPACE cannot scroll the page mid-sequence, and every control change goes through
   * `emitControls()` so the HUD buttons mirror what the keyboard just did.
   */
  setupKeyListeners() {
    this.keyHandler = (e) => {
      const target = e.target;

      // Typing a space in the contact form must never pause the tour.
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ctrl/Meta/Alt combinations belong to the browser (Ctrl+R reload, Cmd+A
      // select-all); a bare-key shortcut table must never swallow them.
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // An open modal owns the keyboard (it traps focus and handles Escape).
      // Rebuilding or skipping the page behind it would be invisible chaos.
      if (document.querySelector('[aria-modal="true"]')) return;

      const key = e.key.toLowerCase();

      if (e.code === 'Space') {
        // SPACE is the activation key of a focused control, so it may not be
        // hijacked while one has focus (a HUD button, a modal screenshot tab).
        if (target?.closest?.('button, a[href], select, [role="button"], [tabindex]')) return;
        e.preventDefault();
        if (!this.started || this.finished) {
          if (this.finished) {
            this.replay();
          } else {
            this.start();
          }
        } else {
          this.togglePause();
        }
      } else if (key === 'r') {
        e.preventDefault();
        this.replay();
      } else if (key === 'a') {
        e.preventDefault();
        this.toggleAutoScroll();
      } else if (key === 'm') {
        e.preventDefault();
        this.toggleSound();
      } else if (key === 'escape') {
        this.skip();
      }
    };

    window.addEventListener('keydown', this.keyHandler);
  }

  setupScrollWatcher() {
    // If the user scrolls manually with wheel or touch, pause auto-scroll temporarily
    // for ~2.2 s so their own reading position is respected, then hand the camera back.
    // Both transitions go through emitControls() so the HUD glide button never lies.
    this.wheelHandler = () => {
      if (this.touring && this.autoOn) {
        this.autoOn = false;
        this.emitControls();
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.autoOn = true;
          this.emitControls();
        }, 2200);
      }
    };
    window.addEventListener('wheel', this.wheelHandler, { passive: true });
    window.addEventListener('touchmove', this.wheelHandler, { passive: true });
  }

  /**
   * Unmount cleanup (React StrictMode double-invokes effects, so this runs early in dev).
   * Kills the rAF loop and every timer, removes all listeners, and strips both the
   * building and complete classes plus the agent stage — otherwise a route change
   * would leave the page greyed at 12% opacity with nobody left to fix it.
   */
  destroy() {
    this.disposed = true;
    clearTimeout(this.safetyTimer);
    clearTimeout(this.endingTimer);
    this.formationOn = false;
    this.endingDone = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('wheel', this.wheelHandler);
    window.removeEventListener('touchmove', this.wheelHandler);
    clearTimeout(this.scrollTimeout);

    document.documentElement.classList.remove('sb-building');
    document.documentElement.classList.remove('sb-complete');
    document.documentElement.classList.remove('sb-gliding');

    if (this.stage) {
      this.stage.innerHTML = '';
    }
  }
}
