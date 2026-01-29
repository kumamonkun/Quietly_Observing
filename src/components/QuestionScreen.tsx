import { useState, useEffect, useCallback } from 'react';
import {
  Question,
  commentaryLines,
  microObservationLines,
} from '@/lib/questions';
import { ObservationOverlay } from './ObservationOverlay';
import { MicroObservation } from './MicroObservation';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: string) => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onScrollDepth: (depth: number) => void;
  hasShownMidQuizCommentary: boolean;
  onShowMidQuizCommentary: () => void;
}

const MICRO_TEXT_CHANCE = 0.28;
const MID_QUIZ_COMMENTARY_CHANCE = 0.35;

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onHoverStart,
  onHoverEnd,
  onScrollDepth,
  hasShownMidQuizCommentary,
  onShowMidQuizCommentary,
}: QuestionScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [commentary, setCommentary] = useState<string | null>(null);
  const [microText, setMicroText] = useState<string | null>(null);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const percent =
        (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      onScrollDepth(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollDepth]);

  useEffect(() => {
    setIsVisible(false);
    setSelectedOption(null);
    setCommentary(null);

    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [question.id]);

  const handleHoverStart = useCallback(() => {
    onHoverStart();
    setOverlayMessage('We noticed you are hovering...');
  }, [onHoverStart]);

  const handleHoverEnd = useCallback(() => {
    onHoverEnd();
    setOverlayMessage(null);
  }, [onHoverEnd]);

  const handleOptionClick = (optionId: string) => {
    if (isTransitioning) return;

    setSelectedOption(optionId);
    setIsTransitioning(true);
    setOverlayMessage(null);

    // Once per session: mid-quiz commentary (30–40% chance when not yet shown)
    if (
      !hasShownMidQuizCommentary &&
      Math.random() < MID_QUIZ_COMMENTARY_CHANCE
    ) {
      const line =
        commentaryLines[Math.floor(Math.random() * commentaryLines.length)];
      setCommentary(line);
      onShowMidQuizCommentary();
    }

    // Per-click micro-text (25–30% chance, delay + fade handled by MicroObservation)
    if (Math.random() < MICRO_TEXT_CHANCE) {
      const line =
        microObservationLines[
          Math.floor(Math.random() * microObservationLines.length)
        ];
      setMicroText(line);
    }

    setTimeout(() => {
      onAnswer(optionId);
      setIsTransitioning(false);
    }, 800);
  };

  return (
    <>
      <ObservationOverlay message={overlayMessage} />
      <MicroObservation
        message={microText}
        onFadeComplete={() => setMicroText(null)}
      />

      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-lg w-full">
          {/* Progress indicator */}
          <div className="mb-16 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-medium
                    ${i < questionNumber ? 'bg-foreground' : i === questionNumber ? 'bg-foreground/60' : 'bg-border'}
                  `}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <div
            className={`
              text-center mb-12 transition-all duration-slow
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <h2 className="font-serif text-2xl md:text-3xl tracking-tight mb-4">
              {question.text}
            </h2>
            {question.subtext && (
              <p className="text-muted-foreground text-lg">
                {question.subtext}
              </p>
            )}
          </div>

          {/* Options */}
          <div
            className={`
              space-y-3 transition-all duration-slow
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            {question.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverEnd}
                disabled={isTransitioning}
                className={`
                  w-full p-4 text-left border rounded-sm
                  transition-all duration-medium
                  ${selectedOption === option.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:border-foreground/50 hover:-translate-y-px'}
                  ${isTransitioning && selectedOption !== option.id ? 'opacity-30' : ''}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-sm">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Mid-quiz commentary (once per session) */}
          {commentary && (
            <div className="mt-8 text-center animate-fade-in">
              <p className="text-sm text-muted-foreground/70 italic">
                {commentary}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
