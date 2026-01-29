import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Archetype, generateBehaviorInsight } from '@/lib/archetypes';
import { BehaviorData } from '@/hooks/useBehaviorTracker';
import { ResultCard, RESULT_CARD_WIDTH, RESULT_CARD_HEIGHT } from './ResultCard';

interface ResultScreenProps {
  archetype: Archetype;
  behaviorData: BehaviorData;
  onRestart: () => void;
}

export function ResultScreen({
  archetype,
  behaviorData,
  onRestart,
}: ResultScreenProps) {
  const [visibleSections, setVisibleSections] = useState(0);
  const [replayMessage, setReplayMessage] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const behaviorInsight = generateBehaviorInsight(behaviorData);

  useEffect(() => {
    const lastScore = sessionStorage.getItem('lastCuriosityScore');
    if (lastScore) {
      setReplayMessage(
        `Last time you scored ${lastScore}. Did you try differently?`
      );
    }

    sessionStorage.setItem(
      'lastCuriosityScore',
      behaviorData.behaviorScore.toString()
    );

    const timers = [
      setTimeout(() => setVisibleSections(1), 500),
      setTimeout(() => setVisibleSections(2), 1500),
      setTimeout(() => setVisibleSections(3), 2500),
      setTimeout(() => setVisibleSections(4), 4000),
      setTimeout(() => setVisibleSections(5), 5500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [behaviorData.behaviorScore]);

  const shareText = `${archetype.name}\n\n${archetype.description}`;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: 'hsl(40, 20%, 96%)',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `curiosity-${archetype.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      setShareFeedback('Download failed');
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: archetype.name,
          text: shareText,
        });
        setShareFeedback('Shared');
        setTimeout(() => setShareFeedback(null), 2000);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText).then(
      () => setShareFeedback('Copied'),
      () => setShareFeedback('Copy failed')
    );
    setTimeout(() => setShareFeedback(null), 2000);
  };

  const handleCopyShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      handleShare();
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-12">
        {/* Shareable card (ref for export) – no metrics */}
        <div
          ref={cardRef}
          className={`
            transition-all duration-slow
            ${visibleSections >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
          style={{ width: RESULT_CARD_WIDTH, height: RESULT_CARD_HEIGHT }}
        >
          <ResultCard archetype={archetype} forExport />
        </div>

        {/* Download / Copy Share – same visibility as card */}
        <div
          className={`
            flex flex-wrap gap-3 justify-center items-center
            transition-all duration-slow
            ${visibleSections >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <button
            type="button"
            onClick={handleDownloadImage}
            className="px-4 py-2 text-xs tracking-wide border border-border rounded-sm text-foreground hover:border-foreground/50 transition-colors"
          >
            Download Image
          </button>
          <button
            type="button"
            onClick={handleCopyShare}
            className="px-4 py-2 text-xs tracking-wide border border-border rounded-sm text-foreground hover:border-foreground/50 transition-colors"
          >
            Copy / Share
          </button>
          {shareFeedback && (
            <span className="text-xs text-muted-foreground">{shareFeedback}</span>
          )}
        </div>

        {/* On-screen result card: observations + insight + closing */}
        <div
          className={`
            rounded-sm border border-border bg-card/50 shadow-sm overflow-hidden
            transition-all duration-slow
            ${visibleSections >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <div className="p-6 md:p-8 space-y-6">
            {archetype.tagline && (
              <p className="text-xs italic text-muted-foreground/80">
                {archetype.tagline}
              </p>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Observations
              </p>
              <ul className="space-y-2">
                {archetype.observations.map((observation, index) => (
                  <li key={index} className="text-muted-foreground text-sm">
                    {observation}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/80 pt-4 italic border-t border-border/50 mt-4">
                {behaviorInsight}
              </p>
            </div>
            <div className="pt-2 border-t border-border/50">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {archetype.closing}
              </p>
            </div>
          </div>
        </div>

        {/* Replay Easter egg (on-screen only, not in share/card) */}
        {replayMessage && visibleSections >= 4 && (
          <div className="text-center animate-fade-in">
            <p className="text-xs text-muted-foreground/50 italic">
              {replayMessage}
            </p>
          </div>
        )}

        {/* Restart */}
        <div
          className={`
            text-center pt-8 space-y-6
            transition-all duration-slow
            ${visibleSections >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <div className="w-16 h-px bg-border mx-auto" />

          <button
            type="button"
            onClick={onRestart}
            className="
              px-6 py-2 text-xs tracking-wide
              text-muted-foreground hover:text-foreground
              transition-colors duration-medium
            "
          >
            Take it again
          </button>

          <p className="text-xs text-muted-foreground/50">
            You may get a different result if you try again.
            <br />
            You probably will.
          </p>
        </div>
      </div>
    </div>
  );
}
