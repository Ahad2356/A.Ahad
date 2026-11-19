import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 240;
const LERP_FACTOR = 0.085;
/*
 * The complete sequence is ~15 MB across 240 WebP frames, so it is never
 * downloaded up front. Only the neighbourhood of the playhead is fetched; the
 * window slides as the visitor scrolls, and a frame that has not arrived yet
 * simply leaves the previous one on the canvas for a few hundred milliseconds.
 */
const PREFETCH_WINDOW = 16;
const frames = new Array(TOTAL_FRAMES);
const requested = new Set();
const subscribers = new Set();
let ready = false;
let loading = 0;
let backgroundEnabled = false;
let priorityFrame = 0;

function loadFrame(index) {
  requested.add(index);
  loading++;
  const image = new Image();
  image.decoding = 'async';
  const finish = () => {
    loading--;
    if (index === 0) { ready = true; }
    subscribers.forEach((notify) => notify());
    if (backgroundEnabled) loadMoreFrames();
  };
  image.onload = finish;
  image.onerror = finish;
  frames[index] = image;
  image.src = `/frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.webp`;
}

/**
 * Fill the 4 in-flight request slots with the frames closest to the playhead,
 * alternating forward/backward so scrubbing either direction is equally covered.
 * A frame outside the window is simply not requested yet; when the playhead reaches
 * it, `onScroll` moves `priorityFrame` and this runs again. `requested` is
 * module-level, so a remount never re-downloads what the tab already has.
 */
function loadMoreFrames() {
  while (loading < 4) {
    let next = -1;
    for (let distance = 0; distance <= PREFETCH_WINDOW; distance++) {
      const forward = priorityFrame + distance;
      const backward = priorityFrame - distance;
      if (forward < TOTAL_FRAMES && !requested.has(forward)) { next = forward; break; }
      if (backward >= 0 && !requested.has(backward)) { next = backward; break; }
    }
    if (next < 0) break;
    loadFrame(next);
  }
}

export function useCanvasScrollEngine() {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(ready);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let target = 0;
    let progress = 0;
    let drawn = -1;
    let disposed = false;
    let announced = ready;

    const draw = (index) => {
      const image = frames[index];
      if (!image?.complete || !image.naturalWidth || !context) return;
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.fillStyle = '#060508';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      drawn = index;
    };

    const schedule = () => {
      if (!raf && !disposed && !document.hidden) raf = requestAnimationFrame(animate);
    };
    const animate = () => {
      raf = 0;
      if (motion.matches) { if (drawn !== 0) draw(0); return; }
      const difference = target - progress;
      progress = Math.abs(difference) > 0.00005 ? progress + difference * LERP_FACTOR : target;
      const index = Math.round(progress * (TOTAL_FRAMES - 1));
      if (index !== drawn) draw(index);
      if (Math.abs(target - progress) > 0.00005) schedule();
    };
    const onScroll = () => {
      const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - innerHeight;
      target = max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0;
      const index = Math.round(target * (TOTAL_FRAMES - 1));
      // The prefetch window follows the playhead, so scrolling is what earns
      // the rest of the sequence instead of the page load.
      if (index !== priorityFrame) {
        priorityFrame = index;
        if (backgroundEnabled) loadMoreFrames();
      }
      schedule();
    };
    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
      const previous = drawn;
      drawn = -1;
      draw(motion.matches ? 0 : Math.max(0, previous));
      onScroll();
    };
    const notify = () => {
      if (ready && !announced) { announced = true; setIsReady(true); }
      if (drawn < 0) draw(0);
      schedule();
    };
    const onMotion = () => {
      if (!motion.matches) {
        backgroundEnabled = true;
        loadMoreFrames();
      }
      onScroll();
    };

    subscribers.add(notify);
    if (!requested.has(0)) loadFrame(0);
    if (!motion.matches) {
      backgroundEnabled = true;
      loadMoreFrames();
    }
    resize();
    notify();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', onMotion);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      subscribers.delete(notify);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', onMotion);
    };
  }, []);

  return { canvasRef, loadPercent: isReady ? 100 : 0, isReady };
}
