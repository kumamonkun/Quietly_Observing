import { useState, useEffect, useRef } from 'react';

const SHOW_DELAY_MS_MIN = 300;
const SHOW_DELAY_MS_MAX = 500;
const VISIBLE_DURATION_MS = 1000;

interface MicroObservationProps {
  message: string | null;
  onFadeComplete?: () => void;
}

export function MicroObservation({ message, onFadeComplete }: MicroObservationProps) {
  const [visible, setVisible] = useState(false);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const showDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      setDisplayMessage(null);
      return;
    }

    setDisplayMessage(message);
    const delayMs =
      SHOW_DELAY_MS_MIN +
      Math.random() * (SHOW_DELAY_MS_MAX - SHOW_DELAY_MS_MIN);

    showDelayRef.current = setTimeout(() => {
      setVisible(true);
      fadeRef.current = setTimeout(() => {
        setVisible(false);
        setDisplayMessage(null);
        onFadeComplete?.();
      }, VISIBLE_DURATION_MS);
    }, delayMs);

    return () => {
      if (showDelayRef.current) clearTimeout(showDelayRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [message, onFadeComplete]);

  if (!displayMessage) return null;

  return (
    <div
      className={`
        fixed top-0 left-0 w-full py-2 text-center text-xs
        text-muted-foreground/70 z-50
        transition-opacity duration-300
        pointer-events-none
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {displayMessage}
    </div>
  );
}
