import { useState, useCallback, useRef, useEffect } from 'react';

export interface BehaviorData {
  timeToFirstInteraction: number | null;
  answerTimings: number[];
  scrolledBeforeFirstClick: boolean;
  hoverHesitations: number[];
  totalHoverTime: number;
  mouseMovementIntensity: 'low' | 'medium' | 'high';
  questionRevisits: number;
  answers: string[];
  scrollDepth: number;
  behaviorScore: number;
}

export interface BehaviorTracker {
  data: BehaviorData;
  recordFirstInteraction: () => void;
  recordAnswer: (answer: string) => void;
  recordHoverStart: () => void;
  recordHoverEnd: () => void;
  recordScroll: () => void;
  recordScrollDepth: (depth: number) => void;
  addBehaviorScore: (delta: number) => void;
  reset: () => void;
}

export function useBehaviorTracker(): BehaviorTracker {
  const pageLoadTime = useRef(Date.now());
  const lastAnswerTime = useRef(Date.now());
  const hoverStartTime = useRef<number | null>(null);
  const mouseMovements = useRef(0);
  const hasInteracted = useRef(false);

  const [data, setData] = useState<BehaviorData>({
    timeToFirstInteraction: null,
    answerTimings: [],
    scrolledBeforeFirstClick: false,
    hoverHesitations: [],
    totalHoverTime: 0,
    mouseMovementIntensity: 'low',
    questionRevisits: 0,
    answers: [],
    scrollDepth: 0,
    behaviorScore: 0,
  });

  // Track mouse movement intensity
  useEffect(() => {
    const handleMouseMove = () => {
      mouseMovements.current += 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const interval = setInterval(() => {
      const intensity = mouseMovements.current > 100 ? 'high' : 
                       mouseMovements.current > 30 ? 'medium' : 'low';
      setData(prev => ({ ...prev, mouseMovementIntensity: intensity }));
      mouseMovements.current = 0;
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const recordFirstInteraction = useCallback(() => {
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      const timeToFirst = Date.now() - pageLoadTime.current;
      lastAnswerTime.current = Date.now();
      setData(prev => ({ ...prev, timeToFirstInteraction: timeToFirst }));
    }
  }, []);

  const recordAnswer = useCallback((answer: string) => {
    const now = Date.now();
    const timeSinceLastAnswer = now - lastAnswerTime.current;
    lastAnswerTime.current = now;
    
    // Calculate behavior score delta based on reaction time
    let scoreDelta = 1;
    if (timeSinceLastAnswer > 7000) scoreDelta += 2;
    else if (timeSinceLastAnswer > 4000) scoreDelta += 1;
    
    setData(prev => ({
      ...prev,
      answerTimings: [...prev.answerTimings, timeSinceLastAnswer],
      answers: [...prev.answers, answer],
      behaviorScore: prev.behaviorScore + scoreDelta,
    }));
  }, []);

  const recordHoverStart = useCallback(() => {
    hoverStartTime.current = Date.now();
  }, []);

  const recordHoverEnd = useCallback(() => {
    if (hoverStartTime.current) {
      const hoverDuration = Date.now() - hoverStartTime.current;
      
      // Add score for long hover
      const hoverScoreDelta = hoverDuration > 2000 ? 1 : 0;
      
      setData(prev => ({
        ...prev,
        hoverHesitations: [...prev.hoverHesitations, hoverDuration],
        totalHoverTime: prev.totalHoverTime + hoverDuration,
        behaviorScore: prev.behaviorScore + hoverScoreDelta,
      }));
      hoverStartTime.current = null;
    }
  }, []);

  const recordScroll = useCallback(() => {
    if (!hasInteracted.current) {
      setData(prev => ({ ...prev, scrolledBeforeFirstClick: true }));
    }
  }, []);

  const recordScrollDepth = useCallback((depth: number) => {
    setData(prev => {
      const newDepth = Math.max(prev.scrollDepth, depth);
      // Add score for deep scrolling
      const scrollScoreDelta = depth > 0.3 && prev.scrollDepth <= 0.3 ? 1 : 0;
      return { 
        ...prev, 
        scrollDepth: newDepth,
        behaviorScore: prev.behaviorScore + scrollScoreDelta,
      };
    });
  }, []);

  const addBehaviorScore = useCallback((delta: number) => {
    setData(prev => ({
      ...prev,
      behaviorScore: prev.behaviorScore + delta,
    }));
  }, []);

  const reset = useCallback(() => {
    pageLoadTime.current = Date.now();
    lastAnswerTime.current = Date.now();
    hasInteracted.current = false;
    mouseMovements.current = 0;
    
    setData({
      timeToFirstInteraction: null,
      answerTimings: [],
      scrolledBeforeFirstClick: false,
      hoverHesitations: [],
      totalHoverTime: 0,
      mouseMovementIntensity: 'low',
      questionRevisits: 0,
      answers: [],
      scrollDepth: 0,
      behaviorScore: 0,
    });
  }, []);

  return {
    data,
    recordFirstInteraction,
    recordAnswer,
    recordHoverStart,
    recordHoverEnd,
    recordScroll,
    recordScrollDepth,
    addBehaviorScore,
    reset,
  };
}
