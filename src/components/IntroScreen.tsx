import { useEffect, useState } from 'react';

interface IntroScreenProps {
  onBegin: () => void;
  onFirstInteraction: () => void;
}

export function IntroScreen({ onBegin, onFirstInteraction }: IntroScreenProps) {
  const [showSubtext, setShowSubtext] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const subtextTimer = setTimeout(() => setShowSubtext(true), 1500);
    const buttonTimer = setTimeout(() => setShowButton(true), 3000);
    
    return () => {
      clearTimeout(subtextTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    onFirstInteraction();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-8">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight fade-in">
          A Website That Judges Your Curiosity
        </h1>
        
        <div 
          className={`space-y-4 transition-opacity duration-slow ${
            showSubtext ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-muted-foreground text-lg leading-relaxed">
            You will be asked a few questions.
          </p>
          <p className="text-muted-foreground text-sm">
            How you answer matters less than you think.
          </p>
        </div>

        <div 
          className={`pt-8 transition-opacity duration-slow ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={onBegin}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovering(false)}
            className={`
              px-8 py-3 border border-border rounded-sm
              text-sm tracking-wide
              transition-all duration-medium
              ${isHovering 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-transparent text-foreground hover:border-foreground'
              }
            `}
          >
            Begin
          </button>
        </div>

        <p 
          className={`text-xs text-muted-foreground/60 pt-12 transition-opacity duration-slow ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '500ms' }}
        >
          This takes about two minutes. Possibly less.
        </p>
      </div>
    </div>
  );
}
