import { useEffect, useRef, useState } from 'react';

const MONITOR_SIZE = 28;
const PUPIL_SIZE = 8;
const LERP = 0.08;
const BLINK_INTERVAL_MS_MIN = 3000;
const BLINK_INTERVAL_MS_MAX = 8000;
const BLINK_DURATION_MS = 150;

interface ObserverMonitorProps {
  recentActivity?: boolean;
}

export function ObserverMonitor({ recentActivity = false }: ObserverMonitorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pupilX = useRef(0);
  const pupilY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [opacity, setOpacity] = useState(0.4);

  // Cursor tracking with lerp
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const maxOffset = MONITOR_SIZE / 2 - PUPIL_SIZE / 2 - 2;
      targetX.current = Math.max(-maxOffset, Math.min(maxOffset, dx * 0.3));
      targetY.current = Math.max(-maxOffset, Math.min(maxOffset, dy * 0.3));
    };

    const animate = () => {
      pupilX.current += (targetX.current - pupilX.current) * LERP;
      pupilY.current += (targetY.current - pupilY.current) * LERP;
      setPupilPos({ x: pupilX.current, y: pupilY.current });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Blink at random intervals
  const blinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const scheduleBlink = (): ReturnType<typeof setTimeout> => {
      const delay =
        BLINK_INTERVAL_MS_MIN +
        Math.random() * (BLINK_INTERVAL_MS_MAX - BLINK_INTERVAL_MS_MIN);
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blinkTimeoutRef.current = scheduleBlink();
        }, BLINK_DURATION_MS);
      }, delay);
    };

    blinkTimeoutRef.current = scheduleBlink();
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  // Subtle reaction to recent activity (scroll/hesitation)
  useEffect(() => {
    if (recentActivity) {
      setOpacity(0.65);
      const t = setTimeout(() => setOpacity(0.4), 2000);
      return () => clearTimeout(t);
    }
  }, [recentActivity]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none"
      style={{
        width: MONITOR_SIZE,
        height: MONITOR_SIZE,
        opacity,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Monitor circle */}
      <div
        className="absolute inset-0 rounded-full border border-foreground/20 bg-background/90"
        style={{ boxShadow: 'inset 0 0 6px rgba(0,0,0,0.15)' }}
      />
      {/* Pupil */}
      <div
        className="absolute rounded-full bg-red-600/90 transition-transform duration-75"
        style={{
          width: PUPIL_SIZE,
          height: PUPIL_SIZE,
          left: '50%',
          top: '50%',
          marginLeft: -PUPIL_SIZE / 2,
          marginTop: -PUPIL_SIZE / 2,
          transform: `translate(${pupilPos.x}px, ${pupilPos.y}px) scaleY(${isBlinking ? 0.05 : 1})`,
        }}
      />
    </div>
  );
}
