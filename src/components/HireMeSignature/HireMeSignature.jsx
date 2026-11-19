import React, { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiMousePointer, FiNavigation2 } from 'react-icons/fi';
import { FaArrowPointer, FaLocationArrow, FaPaperPlane, FaRegHandPointer } from 'react-icons/fa6';
import './HireMeSignature.css';

export const LINKEDIN_URL = 'https://www.linkedin.com/in/abdul-ahad-45b369300/';

/*
 * Six cursors, six silhouettes, six labels. Every label is copy that already lives
 * elsewhere on the page (the subtitle bar, the tech badges row, QUICK INFO, the code
 * showcase), so the signature names the real skill set instead of inventing
 * collaborators or roles. Hues come from the build animation's own palette, biased to
 * the red/orange brand side plus the two cool tones the hero lighting already carries.
 */
const CREW = [
  { label: 'REACT', hue: '#ff2a4b', Icon: FiMousePointer },
  { label: 'FULL STACK', hue: '#ff5500', Icon: FaArrowPointer },
  { label: 'WORDPRESS', hue: '#ff9f43', Icon: FaLocationArrow },
  { label: 'UI/UX', hue: '#70a1ff', Icon: FiNavigation2 },
  { label: 'WEB DEV', hue: '#35e0c2', Icon: FaRegHandPointer },
  { label: 'AI', hue: '#a58bff', Icon: FaPaperPlane }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
// Rounding the resting value to exactly zero keeps `resolve` on its cheap path.
const approach = (v, target, k) => {
  const next = v + (target - v) * Math.min(1, k);
  return target === 0 && Math.abs(next) < 0.05 ? 0 : next;
};

// How long the crew holds its formation around the CTA before drifting back.
const FLOURISH_PERIOD = 11;
const FLOURISH_RISE = 0.9;
const FLOURISH_HOLD = 1.0;
const FLOURISH_FALL = 0.7;

const mixOf = (cycle) => {
  const c = cycle % FLOURISH_PERIOD;
  if (c < FLOURISH_RISE) return easeInOut(c / FLOURISH_RISE);
  if (c < FLOURISH_RISE + FLOURISH_HOLD) return 1;
  if (c < FLOURISH_RISE + FLOURISH_HOLD + FLOURISH_FALL) {
    return 1 - easeInOut((c - FLOURISH_RISE - FLOURISH_HOLD) / FLOURISH_FALL);
  }
  return 0;
};

// Push a point out of a reserved box along whichever side it is nearest.
const avoid = (x, y, hw, hh, box) => {
  if (x + hw <= box.l || x - hw >= box.r || y + hh <= box.t || y - hh >= box.b) return [x, y];
  const depths = [x + hw - box.l, box.r - (x - hw), y + hh - box.t, box.b - (y - hh)];
  const side = depths.indexOf(Math.min(...depths));
  if (side === 0) return [box.l - hw, y];
  if (side === 1) return [box.r + hw, y];
  if (side === 2) return [x, box.t - hh];
  return [x, box.b + hh];
};

export default function HireMeSignature() {
  const rootRef = useRef(null);
  const headRef = useRef(null);
  const btnRef = useRef(null);
  const cursorRefs = useRef([]);
  const trailRefs = useRef([]);
  const [count, setCount] = useState(() => (window.innerWidth <= 640 ? 4 : CREW.length));

  useEffect(() => {
    const onResize = () => setCount(window.innerWidth <= 640 ? 4 : CREW.length);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const geom = { W: 0, H: 0, cx: 0, cy: 0, rx: 90, ry: 18, fx: 100, fy: 30, boxes: [] };
    // Declared here because `resolve` below reads them: the CTA moves under the pointer,
    // so the keep-out box measured at rest is wrong by exactly that offset.
    let mx = 0;
    let my = 0;
    let mxT = 0;
    let myT = 0;
    // Gutters between name tags widen while the pointer is close: the swarm moves
    // faster and tighter when it is excited, which is exactly when labels would smear.
    let sepPad = 4;

    const boxOf = (el, padX, padY, r) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        l: b.left - r.left - padX,
        r: b.right - r.left + padX,
        t: b.top - r.top - padY,
        b: b.bottom - r.top + padY
      };
    };

    const measure = () => {
      const r = root.getBoundingClientRect();
      geom.W = r.width;
      geom.H = r.height;
      const btn = boxOf(btnRef.current, 0, 0, r);
      geom.cx = (btn.l + btn.r) / 2;
      geom.cy = (btn.t + btn.b) / 2;
      geom.rx = clamp(geom.W * 0.3, 60, geom.W / 2 - 34);
      geom.ry = clamp(geom.H * 0.13, 12, 22);
      geom.fx = clamp(geom.rx * 1.25, 96, geom.W / 2 - 46);
      geom.fy = clamp(geom.ry * 1.6, 26, 42);
      // Re-read every cursor box here, not once at mount: before the label pills have
      // laid out their half-widths are icon-sized, and the keep-out below is only as
      // correct as those numbers.
      parts.forEach((p, i) => {
        const el = cursorRefs.current[i];
        if (el && el.offsetWidth) {
          p.hw = el.offsetWidth / 2;
          p.hh = el.offsetHeight / 2;
        }
      });
      // CTA first, then the name lockup: sliding off the button's edge must never
      // drop a cursor onto the heading, and the band between them is the only room.
      const btnBox = boxOf(btnRef.current, 6, 3, r);
      if (btnBox) btnBox.shift = true;
      geom.boxes = [btnBox, boxOf(headRef.current, 2, 2, r)].filter(Boolean);
    };

    const parts = CREW.slice(0, count).map((crew, i, arr) => {
      const rand = Math.random;
      return {
        ...crew,
        a0: (i / arr.length) * Math.PI * 2,
        speed: 0.42 + i * 0.045,
        rxk: 0.84 + rand() * 0.3,
        ryk: 0.8 + rand() * 0.4,
        wob: 0.5 + rand() * 0.9,
        wobAmp: 1.5 + rand() * 4,
        hw: 28,
        hh: 14,
        x: 0,
        y: 0,
        px: 0,
        py: 0,
        fromLeft: rand() < 0.5,
        ex: 0,
        ey: 0,
        // Persistent dodge offset. The orbit target is recomputed from scratch every
        // frame, so a one-frame separation push is erased on the next one and two
        // cursors whose paths cross stay welded together. Carrying the resolver's
        // displacement here, with decay, lets a crowd actually disperse and then
        // reassert the choreography.
        lx: 0,
        ly: 0,
        tx: 0,
        ty: 0,
        slot: (i / arr.length) * Math.PI * 2
      };
    });

    measure();
    const afterFonts = () => {
      measure();
      placeEdges();
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(afterFonts).catch(() => {});

    const placeEdges = () => {
      parts.forEach((p) => {
        p.ex = p.fromLeft ? -p.hw : geom.W + p.hw;
        p.ey = clamp(p.ey || 24 + Math.random() * (geom.H - 48), p.hh + 6, geom.H - p.hh - 6);
      });
    };
    placeEdges();

    const resolve = (p) => {
      let [x, y] = [p.x, p.y];
      // Two passes: sliding clear of the CTA can land a cursor on the name lockup, and
      // the second pass resolves that without bouncing back into the button.
      for (let pass = 0; pass < 2; pass++) {
        for (const box of geom.boxes) {
          const live = box.shift && (mx || my) ? { l: box.l + mx, r: box.r + mx, t: box.t + my, b: box.b + my } : box;
          [x, y] = avoid(x, y, p.hw, p.hh, live);
        }
      }
      p.x = clamp(x, p.hw + 3, geom.W - p.hw - 3);
      p.y = clamp(y, p.hh + 3, geom.H - p.hh - 3);
    };

    // Keep the crew legible: overlapping name tags read as a glitch, not as a crowd.
    // The slack matters — separating exactly to touching leaves the pair re-glued by
    // the next keep-out clamp, because resolve() has nowhere else to put them.
    const separate = () => {
      for (let a = 0; a < parts.length; a++) {
        for (let b = a + 1; b < parts.length; b++) {
          const pa = parts[a];
          const pb = parts[b];
          const dx = pb.x - pa.x;
          const dy = pb.y - pa.y;
          const ox = pa.hw + pb.hw + sepPad - Math.abs(dx);
          const oy = pa.hh + pb.hh + sepPad - Math.abs(dy);
          if (ox <= 0 || oy <= 0) continue;
          // Part along whichever axis is relatively furthest apart, not whichever
          // penetration is shallower. The band this swarm lives in is far wider than
          // it is tall, so an absolute-depth rule always picks the vertical shove —
          // and the flat orbit target pulls that pair straight back on the next frame,
          // welding the two labels together mid-smear. A same-lane pair slides along
          // the row instead, where there is room to stay.
          if (Math.abs(dx) / (pa.hw + pb.hw) >= Math.abs(dy) / (pa.hh + pb.hh)) {
            const s = ((dx >= 0 ? 1 : -1) * ox) / 2;
            pa.x -= s;
            pb.x += s;
          } else {
            const s = ((dy >= 0 ? 1 : -1) * oy) / 2;
            pa.y -= s;
            pb.y += s;
          }
        }
      }
    };

    // Resting layout, and the frame the reduced-motion path paints instead of an
    // animation — so it gets the same de-collision the moving frames do, and more
    // rounds of it: without the persistent dodge below, this has to converge on its
    // own or a wide panel parks two name tags on top of each other permanently.
    for (let it = 0; it < 12; it++) {
      parts.forEach((p) => {
        if (it === 0) {
          p.x = geom.cx + geom.rx * p.rxk * Math.cos(p.a0);
          p.y = geom.cy + geom.ry * p.ryk * Math.sin(p.a0);
        }
        resolve(p);
      });
      separate();
    }
    parts.forEach((p) => {
      p.px = p.x;
      p.py = p.y;
    });

    const paint = (i, p, angle, len, opacity) => {
      const el = cursorRefs.current[i];
      if (el) el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0) translate(-50%,-50%)`;
      const tr = trailRefs.current[i];
      if (!tr) return;
      tr.style.transform = `rotate(${angle.toFixed(1)}deg) scaleX(${(len / 20).toFixed(3)})`;
      tr.style.opacity = opacity.toFixed(3);
    };

    if (reduced) {
      // Static formation: the composition stays readable, nothing moves.
      parts.forEach((p, i) => paint(i, p, 0, 0, 0));
      return undefined;
    }

    let raf = 0;
    let t = 0;
    let cycle = Math.random() * FLOURISH_PERIOD;
    let last = 0;
    let entrance = 0;
    let gain = 0;
    let gainTarget = 0;
    let visible = true;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden || !visible) {
        last = now;
        return;
      }
      const dt = Math.min(50, last ? now - last : 16) / 1000;
      last = now;
      t += dt * (1 + gain * 0.5);
      cycle += dt;
      entrance = Math.min(1, entrance + dt / 0.9);
      gain += (gainTarget - gain) * Math.min(1, dt * 5);
      // The gutter opens with the excitement but closes slowly. Dropping it back to
      // resting slack the instant the pointer leaves re-tightens six labels into the
      // flat orbit exactly while they are still uncrowding, and that half second is
      // where the smears were coming from.
      const wantPad = 4 + gain * 7;
      sepPad += (wantPad - sepPad) * Math.min(1, dt * (wantPad > sepPad ? 6 : 1.3));
      // Eased rather than snapped: the CTA's keep-out box follows the live magnet
      // offset, so a pointerleave that teleports the button back to rest slams that
      // box into whichever cursors had crowded on the side it was pulled toward.
      mx = approach(mx, mxT, dt * 6);
      my = approach(my, myT, dt * 6);

      // Snapshot the previous frame's final positions before anything overwrites
      // them: the trail length is derived from this delta, and the separation and
      // keep-out passes below move the cursors again after the orbit target is set.
      parts.forEach((p) => {
        p.px = p.x;
        p.py = p.y;
      });

      const mix = mixOf(cycle);
      const tighten = 1 - gain * 0.1;
      const e = easeInOut(entrance);

      parts.forEach((p, i) => {
        const ang = p.a0 + t * p.speed;
        const breathe = 1 + Math.sin(t * p.wob) * 0.05;
        const ox = geom.cx + geom.rx * p.rxk * breathe * tighten * Math.cos(ang);
        const oy =
          geom.cy +
          geom.ry * p.ryk * breathe * tighten * Math.sin(ang) +
          Math.sin(ang * 2 + p.a0) * p.wobAmp;

        // Formation: an ellipse around the CTA, sized from the panel rather than from
        // the button. A ring hugging a 129x46 button squeezes six ~90px labels into
        // ~67px of arc and the crowd smears into one line of text; the wider ellipse
        // leaves the top arc inside the free corridor between the name and the button.
        const th = p.slot + t * 0.12;
        const sx = geom.cx + geom.fx * Math.cos(th);
        const sy = geom.cy + geom.fy * Math.sin(th);

        p.tx = p.ex + (ox + (sx - ox) * mix - p.ex) * e;
        p.ty = p.ey + (oy + (sy - oy) * mix - p.ey) * e;
        p.x = p.tx + p.lx;
        p.y = p.ty + p.ly;
      });
      // Separate and resolve against the reserved boxes alternately: a single pass
      // lets one rule undo the other and leaves two name tags printed on top of each
      // other. Three rounds converge at this size.
      for (let it = 0; it < 3; it++) {
        separate();
        parts.forEach((p) => resolve(p));
      }
      // Remember the dodge (0.96 decays it back to the choreography in about a second)
      // instead of letting next frame's orbit formula erase it.
      parts.forEach((p) => {
        p.lx = clamp((p.x - p.tx) * 0.96, -30, 30);
        p.ly = clamp((p.y - p.ty) * 0.96, -26, 26);
      });
      parts.forEach((p, i) => {
        // Trails read in px/s, not px/frame, so the streak is the same length at
        // 30fps as at 144fps instead of stretching with the display cadence.
        const v = Math.hypot(p.x - p.px, p.y - p.py) / Math.max(0.004, dt);
        if (v < 26) paint(i, p, 0, 0, 0);
        else
          paint(
            i,
            p,
            (Math.atan2(p.y - p.py, p.x - p.px) * 180) / Math.PI + 180,
            clamp(v / 9, 7, 30),
            clamp(Math.pow(v / 160, 0.7), 0, 1) * (0.28 + gain * 0.22)
          );
      });

      if (fine) btnRef.current.style.transform = `translate3d(${mx.toFixed(2)}px,${my.toFixed(2)}px,0)`;
    };

    const onPointerMove = (ev) => {
      const r = root.getBoundingClientRect();
      const dx = ev.clientX - (r.left + geom.cx);
      const dy = ev.clientY - (r.top + geom.cy);
      const d = Math.hypot(dx, dy);
      if (d < 150) {
        gainTarget = 1 - d / 150;
        mxT = clamp(dx * 0.14, -8, 8);
        myT = clamp(dy * 0.14, -8, 8);
      } else {
        gainTarget = 0;
        mxT = 0;
        myT = 0;
      }
    };
    const onPointerLeave = () => {
      gainTarget = 0;
      mxT = 0;
      myT = 0;
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    // The build animation dims every `[data-block]` until it resolves it, so the swarm
    // freezes with its own block instead of orbiting behind a 12%-opacity panel. The
    // gate runs both ways: the intro can start after this component has already begun
    // animating, and the swarm has to stop when the dimming kicks in.
    const revealed = () => {
      const html = document.documentElement.classList;
      if (html.contains('sb-complete') || !html.contains('sb-building')) return true;
      return root.classList.contains('sb-resolved');
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
      parts.forEach((p, i) => paint(i, p, 0, 0, 0));
    };
    let watching = !revealed();
    const revealWatcher = new MutationObserver(() => {
      if (revealed()) {
        watching = false;
        if (visible) start();
      } else {
        watching = true;
        stop();
      }
    });
    revealWatcher.observe(root, { attributes: true, attributeFilter: ['class'] });
    revealWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !watching && !raf) start();
    });
    io.observe(root);

    const ro = new ResizeObserver(() => {
      measure();
      placeEdges();
      if (watching) parts.forEach((p, i) => paint(i, p, 0, 0, 0));
    });
    ro.observe(root);

    if (!watching) start();
    if (fine) root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      revealWatcher.disconnect();
      if (fine) root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [count]);

  return (
    <div className="hire-me-signature" ref={rootRef} data-block>
      <div className="hms-head" ref={headRef}>
        {/* The finale emblem, redrawn at badge size: same selection frame, corner
            handles, A-legs, measurement rule and cursor dart. */}
        <svg className="hms-emblem" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <rect className="hms-em-frame" x="46" y="36" width="108" height="128" rx="3" />
          <rect className="hms-em-handle" x="41" y="31" width="10" height="10" />
          <rect className="hms-em-handle" x="149" y="31" width="10" height="10" />
          <rect className="hms-em-handle" x="41" y="159" width="10" height="10" />
          <rect className="hms-em-handle" x="149" y="159" width="10" height="10" />
          <path className="hms-em-leg" d="M100 64 L68 148" />
          <path className="hms-em-leg" d="M100 64 L132 148" />
          <path className="hms-em-rule" d="M78 122 H122" />
          <path className="hms-em-tick" d="M78 115 V129" />
          <path className="hms-em-tick" d="M122 115 V129" />
          <path className="hms-em-dart" d="M100 28 L118 60 L100 50 L82 60 Z" />
        </svg>
        <div className="hms-id">
          <div className="hms-kicker">SIGNATURE</div>
          <h2 className="hms-name" data-b="text">
            ABDUL AHAD
          </h2>
        </div>
        <div className="hms-rule" aria-hidden="true" />
        <div className="hms-dest" data-b="text">
          ON LINKEDIN
        </div>
      </div>

      <div className="hms-cta-row">
        <a
          className="hms-btn"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Open Abdul Ahad on LinkedIn in a new tab"
          data-b="box"
          ref={btnRef}
        >
          <span>HIRE ME</span>
          <FiArrowUpRight style={{ fontSize: '14px' }} />
        </a>
      </div>

      <div className="hms-swarm" aria-hidden="true">
        {CREW.slice(0, count).map((crew, i) => (
          <div
            className="hms-cursor"
            key={crew.label}
            style={{ '--hue': crew.hue }}
            ref={(el) => {
              cursorRefs.current[i] = el;
            }}
          >
            <i
              className="hms-trail"
              ref={(el) => {
                trailRefs.current[i] = el;
              }}
            />
            <crew.Icon className="hms-cursor-icon" />
            <span className="hms-cursor-label">{crew.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
