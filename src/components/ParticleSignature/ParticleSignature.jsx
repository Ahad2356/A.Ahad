import React, { useEffect, useRef } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';
import './ParticleSignature.css';

const LINKEDIN_URL = 'https://www.linkedin.com/in/abdul-ahad-45b369300/';

/*
 * Mechanics, ported from the reference implementation rather than from its look:
 *
 *  - Letter targets are not positioned by hand. A string is rasterised into an
 *    offscreen canvas the size of the stage, the pixels are read back, and the
 *    filled area is sampled on a staggered (hex) grid whose step is derived from
 *    sqrt(area / particleCount) — so the glyph density always matches the crowd
 *    size and the word stays legible at any width. The sample is shuffled so
 *    particles do not arrive in reading order, which would sweep instead of swarm.
 *  - Every particle is a spring-damper integrator: a = (target - p) * k - v * 8.2,
 *    with k randomised per particle, so the crowd converges at different rates and
 *    the letters assemble rather than snap.
 *  - The pointer applies a squared-distance repulsion inside its radius, gated on
 *    how recently it moved, so a still cursor stops carving and the word heals.
 *  - A shape change re-kicks every velocity, which is what throws the old form
 *    apart before the new one wins.
 *
 * On top of that, this build adds what the reference does not have: an attract
 * annulus outside the repel core (particles gather toward the cursor instead of
 * only fleeing it), travelling ripple wavefronts that shove particles as they
 * pass, and a ring of named cursors that roams the band, joins each composition
 * and then orbits the finished word.
 */

const WORD_NAME = 'ABDUL AHAD';
const WORD_CTA = 'HIRE ME';
const EMBLEM = 'emblem';

// Brand-weighted: the two hero reds/oranges appear more often than the cool tones.
const HUES = ['#ff2a4b', '#ff5500', '#ff2a4b', '#ff9f43', '#ff5500', '#35e0c2', '#70a1ff', '#a58bff'];

// The reference draws every particle as a mouse-pointer arrow with a white
// outline and its hotspot at the path origin — that is what makes a swarm of
// them read as cursors rather than as confetti.
const CURSOR = new Path2D('M0 0v15l4.2-3.8 2.8 6.6 2.4-1-2.8-6.5h5.6z');
const HOT_X = -3;
const HOT_Y = -5;
// The arrow is baked once per colour at this supersample factor and then blitted.
// Stroking fourteen hundred open paths is the most expensive thing this field does
// (150 ms a frame on the machine it was built on); blitting the same outlined arrow
// costs a fifth of that, and the white rim survives because the sprite keeps it.
const SPR_SS = 2;
const SPR_PAD = 3;
// Adaptive-guard sampling: SAMPLE frame times decide the crowd once, and any frame
// slower than STALL_MS is treated as a stall rather than as evidence about the
// machine. See the comment at the guard.
const SAMPLE = 120;
const STALL_MS = 250;

const cursorSprite = (color) => {
  const c = document.createElement('canvas');
  c.width = Math.ceil(12.2 * SPR_SS) + SPR_PAD * 2;
  c.height = Math.ceil(17.8 * SPR_SS) + SPR_PAD * 2;
  const x = c.getContext('2d');
  x.setTransform(SPR_SS, 0, 0, SPR_SS, SPR_PAD, SPR_PAD);
  x.fillStyle = color;
  x.fill(CURSOR);
  x.lineWidth = 1.1;
  x.strokeStyle = 'rgba(255,255,255,.85)';
  x.stroke(CURSOR);
  return c;
};


const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);

const REPULSE_R2 = 104 * 104; // squared radius of the hole the cursor carves
const REPULSE_MEMORY = 2200; // ms a motionless cursor keeps repelling
const ATTRACT_R2 = 250 * 250; // beyond the core, particles lean toward the pointer
const LEAD_IN = 900; // ms of roaming before the swarm commits to the name
const HOLD_NAME = 2300; // the reference's own cadence: name, shape, then the ask
const HOLD_EMBLEM = 1700;

// The named cursors are the crew that built the page; these are the jobs it can
// be hired for. The reference runs eighteen pointers and labels only the first six,
// which is what keeps the field reading as a crowd instead of as a legend.
const AGENT_ROLES = ['react', 'canvas', 'motion', 'ui', 'perf', 'api'];
const AGENT_N = 18;

/*
 * The technology symbol is this site's own emblem: a selection marquee with its four
 * corner handles, holding the A-monogram the navbar already wears. It is drawn as
 * well-separated masses because the medium is a crowd of cursors — every stroke is a
 * cursor footprint wider than the line it sits on, so hairlines merge into a blob.
 * The mark is deliberately wide: at the thirty square pixels of ink per cursor this
 * field budgets, a shape smaller than the swarm's coverage is overdraft, and the
 * first version of this stage came out as a lump for exactly that reason.
 */
const drawEmblem = (x, W, H) => {
  const s = Math.min((H * 0.88) / 200, (W * 0.62) / 320);
  const bw = 320 * s;
  const bh = 200 * s;
  x.save();
  x.translate(W / 2 - bw / 2, H / 2 - bh / 2);
  x.scale(s, s);
  x.strokeStyle = x.fillStyle = '#fff';
  x.lineWidth = 10;
  x.strokeRect(20, 10, 280, 180);
  [[20, 10], [300, 10], [20, 190], [300, 190]].forEach(([hx, hy]) => x.fillRect(hx - 9, hy - 9, 18, 18));
  x.beginPath();
  x.moveTo(160, 30);
  x.lineTo(262, 170);
  x.lineTo(58, 170);
  x.closePath();
  x.fill();
  // The counter and the space between the legs are cut back out of the mark, not
  // drawn thinner: what the swarm has to cover has to stay bigger than one cursor.
  x.globalCompositeOperation = 'destination-out';
  x.beginPath();
  x.moveTo(160, 58);
  x.lineTo(198, 118);
  x.lineTo(122, 118);
  x.closePath();
  x.fill();
  x.beginPath();
  x.moveTo(136, 172);
  x.lineTo(148, 140);
  x.lineTo(172, 140);
  x.lineTo(184, 172);
  x.closePath();
  x.fill();
  x.globalCompositeOperation = 'source-over';
  x.restore();
  return { x: W / 2 - bw / 2, y: H / 2 - bh / 2, w: bw, h: bh };
};

const fontString = (size) => `900 ${size.toFixed(1)}px Outfit, "Arial Black", sans-serif`;

function inkArea(data, W, H) {
  let area = 0;
  for (let py = 0; py < H; py += 2) {
    for (let px = 0; px < W; px += 2) if (data[(py * W + px) * 4 + 3] > 128) area += 4;
  }
  return area;
}

/**
 * Rasterise `kind` into the stage box and return one target point per particle,
 * plus the glyph bounding box so the DOM hit area can sit exactly on the word.
 */
function sampleTargets(kind, n, W, H, inkN) {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.fillStyle = x.strokeStyle = '#fff';
  let box;
  let data;
  let area = 0;

  // One cursor covers roughly its own footprint, so a shape bigger than the crowd
  // can blanket reads as a stencil with gaps rather than as solid type. The reference
  // keeps its word small enough for 760 pointers to fill it; the same rule here means
  // the type is sized to the swarm instead of to the band. The sizing swarm is the
  // designed crowd, not the live one: if the adaptive guard later thins the field, the
  // letters keep their size and only lose density.
  const budget = (inkN || n) * 30;

  if (kind === EMBLEM) {
    box = drawEmblem(x, W, H);
    data = x.getImageData(0, 0, W, H).data;
    area = inkArea(data, W, H);
  } else {
    // One line of "ABDUL AHAD" in a wide, short band squeezes the type into a 120px
    // strip; two lines let it fill the band the way the reference's word fills its
    // stage. On a phone the same rule keeps any word tall enough to read.
    const lines =
      kind === WORD_NAME ? ['ABDUL', 'AHAD'] : W >= 700 ? [kind] : ['HIRE', 'ME'];
    let fs = (H * 0.84) / lines.length;
    for (let guard = 0; ; guard++) {
      x.clearRect(0, 0, W, H);
      const setFont = () => {
        x.font = fontString(fs);
        if ('letterSpacing' in x) x.letterSpacing = (-fs * 0.018).toFixed(2) + 'px';
      };
      setFont();
      let widest = Math.max(...lines.map((l) => x.measureText(l).width));
      if (widest > W * 0.88) {
        fs *= (W * 0.88) / widest;
        setFont();
        widest = Math.max(...lines.map((l) => x.measureText(l).width));
      }
      x.textAlign = 'center';
      x.textBaseline = 'alphabetic';
      const m = x.measureText(lines[0]);
      const asc = m.actualBoundingBoxAscent || fs * 0.72;
      const desc = m.actualBoundingBoxDescent || 0;
      const lead = (asc + desc) * 1.02;
      const blockH = asc + desc + lead * (lines.length - 1);
      const top = H / 2 - blockH / 2;
      lines.forEach((l, i) => x.fillText(l, W / 2, top + asc + i * lead));
      box = { x: W / 2 - widest / 2, y: top, w: widest, h: blockH };
      data = x.getImageData(0, 0, W, H).data;
      area = inkArea(data, W, H);
      if (area <= budget || guard >= 2) break;
      fs *= Math.sqrt(budget / area) * 0.97;
    }
  }

  // Density follows the crowd: fewer particles means a coarser grid, never a
  // thinner word, which is what keeps the letters readable at every screen size.
  const step = Math.max(2, Math.sqrt(area / n) * 0.98);
  const pts = [];
  for (let py = step / 2, row = 0; py < H; py += step, row++) {
    for (let px = row % 2 ? step / 2 : 0; px < W; px += step) {
      if (data[((py | 0) * W + (px | 0)) * 4 + 3] > 128) pts.push([px, py]);
    }
  }
  for (let i = pts.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = pts[i];
    pts[i] = pts[j];
    pts[j] = t;
  }

  const out = new Array(n);
  const len = Math.max(1, pts.length);
  for (let i = 0; i < n; i++) {
    const p = pts[i % len] || [W / 2, H / 2];
    // The arrow's hotspot is its top-left corner, so the whole glyph is pulled back
    // onto the sampled pixel. Surplus particles beyond the sampled pixels jitter
    // around their duplicate target so a small glyph never stacks a pile in one spot.
    const jx = i < pts.length ? 0 : rnd(-3.4, 3.4);
    const jy = i < pts.length ? 0 : rnd(-3.4, 3.4);
    out[i] = [p[0] + HOT_X + jx, p[1] + HOT_Y + jy];
  }
  return { pts: out, box, filled: pts.length, step };
}

export default function ParticleSignature() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const ctaRef = useRef(null);

  // Every state class is applied through classList, never through React: the build
  // engine also writes `sb-resolved` onto this [data-block] element, and a re-render
  // that rewrites the className attribute would strip it and re-dim the whole panel.
  useEffect(() => {
    const root = rootRef.current;
    const stageEl = stageRef.current;
    const cv = canvasRef.current;
    if (!root || !stageEl || !cv) return undefined;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isReduced) root.classList.add('ps-reduced');
    if (isCoarse) root.classList.add('ps-coarse');

    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    // One baked arrow per brand colour, kept at the device's own resolution.
    const SPR = {};
    for (const h of HUES) if (!SPR[h]) SPR[h] = cursorSprite(h);
    const geom = { W: 0, H: 0 };
    const pointer = { x: -9999, y: -9999, t: -9999, in: false, lastRipple: 0 };
    const ripples = [];
    let ps = [];
    // The crowd the composition was sized for. It is deliberately not the live
    // crowd length: when the adaptive guard thins the field the word keeps its size
    // and only loses density, so a slow machine never watches the type resize itself.
    let design = 0;
    let stage = 0; // 0 cloud · 1 name · 2 emblem · 3 HIRE ME
    let stageAt = 0;
    let cache = new Map();
    let box = null;
    let lastPts = null;
    // The named cursors: DOM arrows so they can carry a label chip, moved by the
    // same velocity-spring idle logic the reference uses for its build crew.
    const agents = [];

    const count = () => (innerWidth < 700 ? 700 : innerWidth < 1100 ? 1000 : 1400);

    const size = () => {
      const r = stageEl.getBoundingClientRect();
      geom.W = Math.max(1, Math.round(r.width));
      geom.H = Math.max(1, Math.round(r.height));
      cv.width = geom.W * dpr;
      cv.height = geom.H * dpr;
      cache = new Map();
    };

    const targetsFor = (kind) => {
      const key = `${kind}|${geom.W}x${geom.H}|${ps.length}`;
      let hit = cache.get(key);
      if (!hit) {
        hit = sampleTargets(kind, ps.length, geom.W, geom.H, design);
        if (hit.filled === 0) return null; // font not ready — caller retries later
        cache.set(key, hit);
        if (cache.size > 6) cache.delete(cache.keys().next().value);
      }
      return hit;
    };

    const spawn = () => {
      const n = count();
      design = n;
      ps = new Array(n);
      for (let i = 0; i < n; i++) {
        const side = (Math.random() * 4) | 0;
        const x = side === 0 ? -24 : side === 1 ? geom.W + 24 : rnd(0, geom.W);
        const y = side === 2 ? -24 : side === 3 ? geom.H + 24 : rnd(0, geom.H);
        const s = innerWidth < 700 ? rnd(0.36, 0.5) : rnd(0.46, 0.64);
        ps[i] = {
          x,
          y,
          vx: 0,
          vy: 0,
          tx: x,
          ty: y,
          k: rnd(20, 46),
          c: HUES[i % HUES.length],
          s,
          f: s / SPR_SS,
          ph: Math.random() * 6.283,
          wx: rnd(0, geom.W),
          wy: rnd(0, geom.H),
          wUntil: rnd(600, 2600)
        };
      }
      // Both numbers are published on the stage: the crowd that is live and the
      // crowd the composition was sized for. Diagnostics need them because they are
      // not the same thing once the guard has thinned the field.
      stageEl.dataset.count = n;
      stageEl.dataset.design = n;
    };

    /* ---------- the named cursors that roam, sign and then orbit ---------- */
    const makeAgents = () => {
      for (let i = 0; i < AGENT_N; i++) {
        const color = HUES[i % HUES.length];
        const role = AGENT_ROLES[i];
        const el = document.createElement('div');
        el.className = 'ps-agent';
        el.style.color = color;
        el.innerHTML =
          '<svg viewBox="0 0 17 22" aria-hidden="true"><path d="M2 1.5v16l4.4-4 3 7 2.6-1.1-3-6.9h6z" fill="' +
          color +
          '" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></svg><span class="ps-ring"></span>' +
          (role ? '<label style="background:' + color + '">' + role + '</label>' : '');
        stageEl.appendChild(el);
        agents.push({
          x: rnd(30, geom.W - 30),
          y: rnd(20, Math.max(21, geom.H - 20)),
          vx: 0,
          vy: 0,
          tx: geom.W / 2,
          ty: geom.H / 2,
          wx: rnd(30, geom.W - 30),
          wy: rnd(20, Math.max(21, geom.H - 20)),
          wUntil: 0,
          signed: !!role,
          el
        });
      }
    };

    // The labelled crew signs the word; the rest of the field keeps working the band,
    // which is how the reference reads while its own name is being assembled.
    const assignAgents = (pts, all) => {
      const own = all ? agents : agents.filter((a) => a.signed);
      for (let i = 0; i < own.length; i++) {
        const p = pts[Math.floor(((i + 0.5) / own.length) * pts.length)];
        if (!p) continue;
        own[i].tx = p[0];
        own[i].ty = p[1];
        own[i].done = false;
      }
    };

    // The reference's crew confirms a move with a click ring; the same pulse here
    // marks the moment a cursor lands on the letter it is signing.
    const pulse = (a) => {
      a.el.classList.remove('ps-click');
      void a.el.offsetWidth;
      a.el.classList.add('ps-click');
    };

    const stepAgents = (dt, now) => {
      const W = geom.W;
      const H = geom.H;
      const pick = (a) => {
        if (now > a.wUntil || Math.hypot(a.wx - a.x, a.wy - a.y) < 12) {
          a.wx = rnd(26, W - 32);
          a.wy = rnd(16, Math.max(17, H - 22));
          a.wUntil = now + rnd(1400, 3600);
        }
      };
      for (let i = 0; i < agents.length; i++) {
        const a = agents[i];
        let tx;
        let ty;
        let k = 1.5;
        let max = 520;
        if (stage === 3 && box) {
          k = 5;
          max = 900;
          const ang = (i / agents.length) * Math.PI * 2 + now * 0.00035;
          tx = box.x + box.w / 2 + Math.cos(ang) * (box.w / 2 + 34) - 8;
          ty = box.y + box.h / 2 + Math.sin(ang) * (box.h / 2 + 16) - 11;
        } else if (stage > 0 && a.signed) {
          k = 5;
          max = 900;
          tx = a.tx;
          ty = a.ty;
        } else {
          pick(a);
          tx = a.wx;
          ty = a.wy;
        }
        let dvx = (tx - a.x) * k;
        let dvy = (ty - a.y) * k;
        const m = Math.hypot(dvx, dvy);
        if (m > max) {
          dvx *= max / m;
          dvy *= max / m;
        }
        const s = Math.min(1, dt * 0.006);
        a.vx += (dvx - a.vx) * s;
        a.vy += (dvy - a.vy) * s;
        a.x += (a.vx * dt) / 1000;
        a.y += (a.vy * dt) / 1000;
        if (stage > 0 && stage < 3 && a.signed && !a.done && Math.hypot(tx - a.x, ty - a.y) < 9) {
          a.done = true;
          pulse(a);
        }
        a.el.style.transform = `translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0)`;
      }
    };

    const applyShape = (kind) => {
      const hit = targetsFor(kind);
      if (!hit) return false;
      box = hit.box;
      lastPts = hit.pts;
      assignAgents(hit.pts);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.tx = hit.pts[i][0];
        p.ty = hit.pts[i][1];
        // The kick is the transition: the old form has to be destroyed before the
        // springs can pull the crowd into the new one.
        p.vx += rnd(-430, 430);
        p.vy += rnd(-430, 430);
      }
      if (kind === WORD_CTA && ctaRef.current) {
        const a = ctaRef.current;
        a.style.left = `${box.x}px`;
        a.style.top = `${box.y}px`;
        a.style.width = `${box.w}px`;
        a.style.height = `${box.h}px`;
      }
      return true;
    };

    const goStage = (next) => {
      const kind = next === 1 ? WORD_NAME : next === 2 ? EMBLEM : next === 3 ? WORD_CTA : null;
      if (kind && !applyShape(kind)) return;
      stage = next;
      stageAt = performance.now();
      if (next === 3) root.classList.add('ps-armed');
      else root.classList.remove('ps-armed');
      if (next === 1) root.classList.add('ps-signed');
    };

    /* ---------- one simulated frame ---------- */
    const step = (dt, now) => {
      const h = Math.min(0.032, (dt / 1000) * 1.15);
      const W = geom.W;
      const H = geom.H;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // destination-out instead of clearRect: the previous frame is dimmed rather
      // than erased, which is where the motion trails come from on a canvas that
      // still has to let the page background through.
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${stage === 0 ? 0.3 : 0.22})`;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.globalCompositeOperation = 'source-over';

      const fresh = now - pointer.t < REPULSE_MEMORY;
      const rSpeed = 0.62; // ripple wavefront, px per ms
      let rIdx = 0;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        let tx;
        let ty;
        let k;

        if (stage === 0) {
          // Loose field: each particle wanders to its own point inside the band,
          // re-picking when it arrives or when its window expires.
          if (now > p.wUntil || Math.hypot(p.wx - p.x, p.wy - p.y) < 14) {
            p.wx = rnd(8, W - 8);
            p.wy = rnd(8, H - 8);
            p.wUntil = now + rnd(1400, 3800);
          }
          tx = p.wx;
          ty = p.wy;
          k = 9;
        } else {
          tx = p.tx + Math.sin(now * 0.002 + p.ph) * 1.6;
          ty = p.ty + Math.cos(now * 0.0017 + p.ph) * 1.6;
          k = p.k;
        }

        let ax = (tx - p.x) * k - p.vx * 8.2;
        let ay = (ty - p.y) * k - p.vy * 8.2;

        if (pointer.in && fresh) {
          const mx = p.x - pointer.x;
          const my = p.y - pointer.y;
          const md = mx * mx + my * my;
          if (md < REPULSE_R2) {
            const f = ((REPULSE_R2 - md) * 0.9) / (Math.sqrt(md) + 1);
            ax += mx * f;
            ay += my * f;
          } else if (md < ATTRACT_R2) {
            // The annulus: everything just outside the hole leans in, so the cursor
            // drags a wake through the field instead of only punching a gap.
            const f = (0.16 * (ATTRACT_R2 - md)) / (ATTRACT_R2 - REPULSE_R2);
            ax -= mx * f;
            ay -= my * f;
          }
        }

        // Travelling wavefront: particles get shoved outward as the ring passes
        // through them, so the ripple reads as motion rather than as a drawn circle.
        for (rIdx = 0; rIdx < ripples.length; rIdx++) {
          const rp = ripples[rIdx];
          // rAF timestamps can predate the performance.now() a pointer event was
          // stamped with, so a freshly emitted ripple briefly reads as negative age.
          const age = Math.max(0, now - rp.t0);
          const rad = age * rSpeed;
          const dx = p.x - rp.x;
          const dy = p.y - rp.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const off = Math.abs(dist - rad);
          if (off < 38) {
            const f = rp.k * (1 - off / 38) * (1 - age / rp.life);
            ax += (dx / dist) * f;
            ay += (dy / dist) * f;
          }
        }

        p.vx += ax * h;
        p.vy += ay * h;
        p.x += p.vx * h;
        p.y += p.vy * h;

        // Fixed orientation, exactly as the reference draws them: an arrow that
        // turns with its own velocity stops reading as a cursor and starts reading
        // as a splinter. The white outline is what separates the swarm into
        // individual pointers once they overlap inside a letter — here it comes for
        // free, because it is part of the baked sprite.
        const f = p.f * dpr;
        const sp = SPR[p.c];
        ctx.drawImage(sp, p.x * dpr - SPR_PAD * f, p.y * dpr - SPR_PAD * f, sp.width * f, sp.height * f);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = Math.max(0, now - rp.t0);
        if (age > rp.life) {
          ripples.splice(i, 1);
          continue;
        }
        const a = (1 - age / rp.life) * 0.34;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, age * rSpeed, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,42,75,${a.toFixed(3)})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      // The word is selectable, so it gets the site's selection furniture: frame,
      // corner handles, and it snaps on as the CTA arms.
      if (stage === 3 && box) {
        const k = clamp((now - stageAt) / 420, 0, 1);
        const pad = 16 + (1 - k) * 12;
        const l = box.x - pad;
        const t = box.y - pad;
        const w = box.w + pad * 2;
        const hh = box.h + pad * 2;
        ctx.strokeStyle = `rgba(255,42,75,${(0.5 * k).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(l, t, w, hh);
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(255,42,75,${(0.85 * k).toFixed(3)})`;
        const hs = 6;
        [[l, t], [l + w, t], [l, t + hh], [l + w, t + hh]].forEach(([hx, hy]) => {
          ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
        });
      }
    };

    /* ---------- interaction ---------- */
    const localPoint = (ev) => {
      const r = stageEl.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    };

    const emitRipple = (x, y, k) => {
      if (ripples.length > 5) ripples.shift();
      ripples.push({ x, y, t0: performance.now(), k, life: 900 });
    };

    const onMove = (ev) => {
      const q = localPoint(ev);
      const dx = q.x - pointer.x;
      const dy = q.y - pointer.y;
      const moved = Math.hypot(dx, dy);
      const now = performance.now();
      pointer.x = q.x;
      pointer.y = q.y;
      pointer.in = true;
      pointer.t = now;

      if (moved > 26 && now - pointer.lastRipple > 120) {
        pointer.lastRipple = now;
        emitRipple(q.x, q.y, 26 + Math.min(70, moved * 1.4));
      }
    };

    const onDown = (ev) => {
      const q = localPoint(ev);
      pointer.x = q.x;
      pointer.y = q.y;
      pointer.in = true;
      pointer.t = performance.now();
      emitRipple(q.x, q.y, 150);
      // A tap is the replay affordance — the job the reference gives to R. The
      // link keeps its own click, so pressing HIRE ME still navigates.
      if (ev.target && ev.target.closest && ev.target.closest('a')) return;
      // A pointer inside the band is proof the visitor is looking at it. Without this,
      // one stale off-screen reading would turn the replay affordance into a dead click.
      if (!raf && !watching) { visible = true; start(); }
      goStage(1);
    };

    const onLeave = () => {
      pointer.in = false;
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointerleave', onLeave);

    /* ---------- lifecycle ---------- */
    size();
    spawn();
    makeAgents();

    if (isReduced) {
      // One composed frame, no loop: the name written in cursors, the crew parked
      // inside the letters, and the CTA as real text.
      const paint = () => {
        if (!applyShape(WORD_NAME)) {
          requestAnimationFrame(() => paint());
          return;
        }
        for (const p of ps) {
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
        }
        if (lastPts) assignAgents(lastPts, true);
        for (const a of agents) {
          a.x = a.tx;
          a.y = a.ty;
          a.el.style.transform = `translate3d(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px,0)`;
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        for (const p of ps) {
          const f = p.f * dpr;
          const sp = SPR[p.c];
          ctx.drawImage(sp, p.x * dpr - SPR_PAD * f, p.y * dpr - SPR_PAD * f, sp.width * f, sp.height * f);
        }
      };
      paint();
      root.classList.add('ps-armed');
      const roR = new ResizeObserver(() => {
        size();
        spawn();
        paint();
      });
      roR.observe(root);
      return () => {
        roR.disconnect();
        for (const a of agents) a.el.remove();
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerdown', onDown);
        root.removeEventListener('pointerleave', onLeave);
      };
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    let dts = [];
    let leadFrames = 0;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || !visible) {
        last = now;
        return;
      }
      // The integration step is capped so one long pause cannot fling a cursor
      // across the band; the raw gap is what the adaptive guard below looks at.
      // Capping first would turn every pause into a 50 ms frame, which reads as
      // chronic slowness and cost this field 40% of its crowd on a healthy machine.
      const gap = last ? now - last : 16;
      const dt = Math.min(50, gap);
      last = now;

      // Adaptive guard: if the field cannot hold ~60fps on this machine it is
      // thinned once rather than stuttering for the whole visit. Frames longer than
      // STALL_MS are dropped from the sample instead of counted: a screenshot, a
      // garbage collection or an occluded window can hold the renderer above twenty
      // milliseconds for hundreds of frames in a row, and that is one stall, not a
      // slow machine. A machine that is genuinely too slow for this crowd lands at a
      // steady thirty frames a second, which survives the filter.
      // Sampling waits for the first hold: page startup is full of work that says
      // nothing about this field (the intro engine, the frame sequence, the webfont
      // arriving, the first offscreen rasterise), and a guard that decides inside it
      // throws away forty percent of the crowd on a machine that was never slow.
      if (leadFrames < 20) leadFrames++;
      else if (stage === 0) { /* roaming: not yet a steady state to measure */ }
      else if (dts.length < SAMPLE) {
        if (gap <= STALL_MS) dts.push(gap);
        if (dts.length === SAMPLE) {
          dts.sort((a, b) => a - b);
          // The quarter of frames that went best decides. A machine that truly cannot
          // draw this crowd sits at thirty frames a second through its good frames
          // too, while a healthy one only needs its good frames to prove it.
          if (dts[SAMPLE >> 2] > 21 && ps.length > 340) {
            const keep = Math.round(ps.length * 0.6);
            // Fewer cursors must not mean a lighter word: each survivor inherits the
            // footprint of the ones it replaces, so a thinned field still reads as
            // solid type rather than as a stencil with holes in it.
            const grow = Math.sqrt(ps.length / keep);
            for (let i = ps.length - 1; i >= keep; i--) {
              // Spread the removals over the whole field instead of cutting the tail,
              // so no region of the word empties out all at once.
              const j = (Math.random() * (i + 1)) | 0;
              const t = ps[i];
              ps[i] = ps[j];
              ps[j] = t;
            }
            ps.length = keep;
            for (const p of ps) {
              p.s *= grow;
              p.f = p.s / SPR_SS;
            }
            cache = new Map();
            stageEl.dataset.count = keep;
            if (stage > 0) applyShape(stage === 1 ? WORD_NAME : stage === 2 ? EMBLEM : WORD_CTA);
          }
        }
      }

      step(dt, now);
      stepAgents(dt, now);

      // The reference runs its finale on a clock rather than on a gesture: the
      // field roams, then signs, then shapes, then asks. A click replays it.
      if (stage === 0 && now - stageAt > LEAD_IN) goStage(1);
      else if (stage === 1 && now - stageAt > HOLD_NAME) goStage(2);
      else if (stage === 2 && now - stageAt > HOLD_EMBLEM) goStage(3);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      // The lead-in clock starts when the band actually comes on screen, not when
      // the component mounted, so a visitor who scrolls down late still sees the
      // cursors roam before the name assembles.
      if (stage === 0) stageAt = performance.now();
      root.classList.remove('ps-stopped');
      raf = requestAnimationFrame(frame);
    };

    // Same reveal contract as the rest of the page: the field must not animate
    // while the build engine still has this block as a 12%-opacity wireframe.
    const revealed = () => {
      const html = document.documentElement.classList;
      if (html.contains('sb-complete') || !html.contains('sb-building')) return true;
      return root.classList.contains('sb-resolved');
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      // The cursors are DOM, so clearing the canvas is not enough: off screen they
      // have to be hidden too, or they freeze mid-flight over the next section.
      root.classList.add('ps-stopped');
    };
    let watching = !revealed();
    const gate = new MutationObserver(() => {
      if (revealed()) {
        watching = false;
        cache = new Map();
        if (stage > 0) applyShape(stage === 1 ? WORD_NAME : stage === 2 ? EMBLEM : WORD_CTA);
        if (visible) start();
      } else {
        watching = true;
        stop();
      }
    });
    gate.observe(root, { attributes: true, attributeFilter: ['class'] });
    gate.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !watching) start();
      else if (!visible) stop();
    });
    io.observe(root);

    const ro = new ResizeObserver(() => {
      size();
      // The word is re-sampled for the new box; particles keep their momentum, so a
      // resize reads as the letters being redrawn rather than as a jump.
      if (stage > 0) applyShape(stage === 1 ? WORD_NAME : stage === 2 ? EMBLEM : WORD_CTA);
      else if (!raf) spawn();
    });
    ro.observe(root);
    ro.observe(stageEl);

    if (!watching) start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gate.disconnect();
      for (const a of agents) a.el.remove();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      className="particle-signature"
      ref={rootRef}
      data-block
      aria-label="Interactive particle signature"
    >
      <div className="ps-stage" ref={stageRef}>
        <canvas className="ps-canvas" ref={canvasRef} aria-hidden="true" />
        <a
          className="ps-cta"
          ref={ctaRef}
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Abdul Ahad on LinkedIn in a new tab"
          aria-label="Hire Abdul Ahad — opens LinkedIn in a new tab"
          data-b="box"
        >
          <span className="ps-cta-label">HIRE ME</span>
          <FiArrowUpRight className="ps-cta-ico" />
        </a>
      </div>
      <p className="ps-hint" data-b="text">
        <span className="ps-hint-fine">THE CURSORS ROAM, CONVERGE AND SIGN — CLICK TO RUN IT AGAIN</span>
        <span className="ps-hint-coarse">TAP TO RUN THE SIGNATURE AGAIN</span>
      </p>
    </section>
  );
}
