import { useState, useEffect, useCallback, useRef } from 'react';
import { IntroScreen } from '@/components/IntroScreen';
import { QuestionScreen } from '@/components/QuestionScreen';
import { ThinkingScreen } from '@/components/ThinkingScreen';
import { ResultScreen } from '@/components/ResultScreen';
import { ObserverMonitor } from '@/components/ObserverMonitor';
import { useBehaviorTracker } from '@/hooks/useBehaviorTracker';
import { pickRandomQuestions, type Question } from '@/lib/questions';
import { calculateArchetype, Archetype } from '@/lib/archetypes';

type Screen = 'intro' | 'questions' | 'thinking' | 'result';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [hasShownMidQuizCommentary, setHasShownMidQuizCommentary] = useState(false);
  const pendingQuestionsRef = useRef(false);

  const tracker = useBehaviorTracker();
  const trackerDataRef = useRef(tracker.data);
  trackerDataRef.current = tracker.data;

  // Track scroll behavior
  useEffect(() => {
    const handleScroll = () => tracker.recordScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tracker]);

  // When entering questions screen with pending pick, set questions from tracker (after first interaction has been recorded)
  useEffect(() => {
    if (currentScreen === 'questions' && pendingQuestionsRef.current) {
      pendingQuestionsRef.current = false;
      setQuestions(pickRandomQuestions(8, tracker.data));
    }
  }, [currentScreen, tracker.data]);

  const handleBegin = useCallback(() => {
    tracker.recordFirstInteraction();
    pendingQuestionsRef.current = true;
    setCurrentScreen('questions');
  }, [tracker]);

  const handleAnswer = useCallback((answerId: string) => {
    tracker.recordAnswer(answerId);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentScreen('thinking');
    }
  }, [currentQuestionIndex, tracker, questions.length]);

  const handleScrollDepth = useCallback((depth: number) => {
    tracker.recordScrollDepth(depth);
  }, [tracker]);

  const handleThinkingComplete = useCallback(() => {
    const data = trackerDataRef.current;
    const result = calculateArchetype(data);
    setArchetype(result);
    setCurrentScreen('result');
  }, []);

  const handleRestart = useCallback(() => {
    tracker.reset();
    setCurrentQuestionIndex(0);
    setArchetype(null);
    setQuestions([]);
    setHasShownMidQuizCommentary(false);
    setCurrentScreen('intro');
  }, [tracker]);

  const observerRecentActivity =
    tracker.data.scrollDepth > 0.25 || tracker.data.totalHoverTime > 4000;

  return (
    <div className="min-h-screen bg-background selection:bg-foreground/10">
      <ObserverMonitor recentActivity={observerRecentActivity} />
      {currentScreen === 'intro' && (
        <IntroScreen 
          onBegin={handleBegin}
          onFirstInteraction={tracker.recordFirstInteraction}
        />
      )}
      
      {currentScreen === 'questions' && questions.length === 0 && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Preparing…</p>
        </div>
      )}
      {currentScreen === 'questions' && questions.length > 0 && (
        <QuestionScreen
          question={questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onHoverStart={tracker.recordHoverStart}
          onHoverEnd={tracker.recordHoverEnd}
          onScrollDepth={handleScrollDepth}
          hasShownMidQuizCommentary={hasShownMidQuizCommentary}
          onShowMidQuizCommentary={() => setHasShownMidQuizCommentary(true)}
        />
      )}
      
      {currentScreen === 'thinking' && (
        <ThinkingScreen onComplete={handleThinkingComplete} />
      )}
      
      {currentScreen === 'result' && archetype && (
        <ResultScreen
          archetype={archetype}
          behaviorData={tracker.data}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Index;
