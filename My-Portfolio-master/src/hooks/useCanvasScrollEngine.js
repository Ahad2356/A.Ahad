import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 240;
const LERP_FACTOR = 0.085;

// Global memory cache for the preloaded image objects
// Prevents re-fetching 240 images when navigating between routes
let globalImageCache = null;
let globalLoadedCount = 0;
let globalIsReady = false;

export function useCanvasScrollEngine() {
  const canvasRef = useRef(null);
  const [loadPercent, setLoadPercent] = useState(globalIsReady ? 100 : 0);
  const [isReady, setIsReady] = useState(globalIsReady);

  const animFrameIdRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentFrameIndexRef = useRef(-1);

  const getFrameUrl = useCallback((index) => {
    const padded = String(index + 1).padStart(3, '0');
    return `/frames/ezgif-frame-${padded}.webp`;
  }, []);

  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    if (!canvas || !globalImageCache) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const img = globalImageCache[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const scale = Math.max(cw / imgWidth, ch / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const offsetX = (cw - drawWidth) / 2;
    const offsetY = (ch - drawHeight) / 2;

    ctx.fillStyle = '#060508';
    ctx.fillRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    if (currentFrameIndexRef.current >= 0) {
      renderFrame(currentFrameIndexRef.current);
    }
  }, [renderFrame]);

  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;

    if (maxScroll > 0) {
      targetProgressRef.current = Math.max(0, Math.min(1, scrollTop / maxScroll));
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const handleScroll = () => updateScrollProgress();
    const handleWheel = () => requestAnimationFrame(updateScrollProgress);
    const handleTouchMove = () => requestAnimationFrame(updateScrollProgress);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop with LERP
    const animLoop = () => {
      if (globalIsReady) {
        const diff = targetProgressRef.current - currentProgressRef.current;
        if (Math.abs(diff) > 0.00005) {
          currentProgressRef.current += diff * LERP_FACTOR;
        } else {
          currentProgressRef.current = targetProgressRef.current;
        }

        const targetIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
        );

        if (targetIndex !== currentFrameIndexRef.current) {
          currentFrameIndexRef.current = targetIndex;
          renderFrame(targetIndex);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(animLoop);

    // Initial Preloader Setup
    if (!globalImageCache) {
      globalImageCache = new Array(TOTAL_FRAMES);
      globalLoadedCount = 0;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameUrl(i);

        img.onload = () => {
          globalLoadedCount++;
          const percent = Math.floor((globalLoadedCount / TOTAL_FRAMES) * 100);
          setLoadPercent(percent);

          if (i === 0 && currentFrameIndexRef.current === -1) {
            currentFrameIndexRef.current = 0;
            renderFrame(0);
          }

          if (globalLoadedCount === TOTAL_FRAMES) {
            globalIsReady = true;
            setIsReady(true);
            updateScrollProgress();
            renderFrame(0);
          }
        };

        img.onerror = () => {
          globalLoadedCount++;
          if (globalLoadedCount === TOTAL_FRAMES) {
            globalIsReady = true;
            setIsReady(true);
            updateScrollProgress();
          }
        };

        globalImageCache[i] = img;
      }
    } else {
      // If already cached from previous route, restore immediately
      setIsReady(true);
      setLoadPercent(100);
      updateScrollProgress();
      if (currentFrameIndexRef.current === -1) {
        currentFrameIndexRef.current = 0;
      }
      renderFrame(currentFrameIndexRef.current);
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [getFrameUrl, renderFrame, resizeCanvas, updateScrollProgress]);

  return { canvasRef, loadPercent, isReady };
}
