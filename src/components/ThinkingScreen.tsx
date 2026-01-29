import { useEffect, useState, useRef } from 'react';

interface ThinkingScreenProps {
  onComplete: () => void;
}

const PROCESSING_DURATION_MS = 6000;
const ROTATION_INTERVAL_MS = 1300;

const processingCopy = [
  'Reviewing response patterns…',
  'Cross-referencing hesitation markers…',
  'You paused more than you think.',
  'Noting the gaps between answers.',
  'Comparing to baseline behavior.',
  'Almost there.',
  'Forming an assessment.',
];

export function ThinkingScreen({ onComplete }: ThinkingScreenProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const rotationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    rotationRef.current = setInterval(() => {
      setCurrentLineIndex(prev => (prev + 1) % processingCopy.length);
    }, ROTATION_INTERVAL_MS);

    completeRef.current = setTimeout(() => {
      setIsVisible(false);
      fadeRef.current = setTimeout(() => {
        onComplete();
      }, 500);
    }, PROCESSING_DURATION_MS);

    return () => {
      if (rotationRef.current) clearInterval(rotationRef.current);
      if (completeRef.current) clearTimeout(completeRef.current);
      if (fadeRef.current) clearTimeout(fadeRef.current);
    };
  }, [onComplete]);

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center justify-center px-6
        transition-opacity duration-medium
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="max-w-lg text-center space-y-8">
        <div className="min-h-[2.5rem] flex items-center justify-center">
          <p className="text-muted-foreground text-sm text-foreground transition-opacity duration-medium">
            {processingCopy[currentLineIndex]}
          </p>
        </div>

        <div className="pt-8">
          <div className="w-8 h-px bg-foreground/30 mx-auto thinking-pulse" />
        </div>
      </div>
    </div>
  );
}
