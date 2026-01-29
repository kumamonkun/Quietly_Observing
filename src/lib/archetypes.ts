import { BehaviorData } from '@/hooks/useBehaviorTracker';

export interface Archetype {
  id: string;
  name: string;
  tagline: string;
  description: string;
  observations: string[];
  closing: string;
  alternateDescriptions: string[];
}

const archetypes: Record<string, Archetype> = {
  'surface-level': {
    id: 'surface-level',
    name: 'Surface-Level Curious',
    tagline: 'Quick to decide.',
    description: 'You clicked quickly. You didn\'t hesitate. Most things don\'t need your full attention. This almost did.',
    alternateDescriptions: [
      'You answered fast. You skimmed. You didn\'t stay long. That\'s your style.',
      'You moved through this quickly. Efficiently, even. The kind of person who reads the first paragraph and assumes the rest.',
    ],
    observations: [
      'You answered without much hesitation.',
      'The pauses between questions were brief.',
      'You did not linger.',
    ],
    closing: 'Curiosity, for you, is a checkbox. You came, you saw, you concluded. Whether you actually looked is a different question.',
  },
  'cautiously-investigative': {
    id: 'cautiously-investigative',
    name: 'Cautiously Investigative',
    tagline: 'Reads the room.',
    description: 'Curiosity, but with boundaries. You didn\'t rush. You didn\'t leave. That\'s a choice.',
    alternateDescriptions: [
      'You weigh before you act. You explore carefully. You observe before committing.',
      'You took your time, but not too much. Careful. Measured. The kind of curious that keeps one foot near the door.',
    ],
    observations: [
      'Your pace was deliberate but not slow.',
      'You hovered before committing.',
      'You prefer to know what you\'re getting into.',
    ],
    closing: 'You\'re curious enough to explore, but not enough to get lost. That\'s either wisdom or fear dressed up as prudence.',
  },
  'pattern-seeking': {
    id: 'pattern-seeking',
    name: 'Pattern-Seeking',
    tagline: 'Looks for the mechanism.',
    description: 'You notice structure where others see noise. You\'re here for the mechanism.',
    alternateDescriptions: [
      'You look for connections. You read between the lines. You see the system.',
      'You were looking for something. The structure. The trick. The thing that explains the thing.',
    ],
    observations: [
      'You scrolled. You paused. You reconsidered.',
      'Your attention lingered longer than necessary.',
      'You were reading between the lines.',
    ],
    closing: 'You suspect there\'s more here than meets the eye. You\'re not wrong. But the real question is whether you\'re comfortable with what you find.',
  },
  'reluctantly-curious': {
    id: 'reluctantly-curious',
    name: 'Reluctantly Curious',
    tagline: 'Stays despite himself.',
    description: 'You didn\'t plan to care. You stayed anyway. You could have left. You didn\'t.',
    alternateDescriptions: [
      'You resist curiosity but it finds you. You observe unwillingly. Still, you continue.',
      'You almost didn\'t start. And yet here you are, at the end. Something pulled you forward despite yourself.',
    ],
    observations: [
      'The first interaction took longer than expected.',
      'Your pace was uneven — hesitant, then committed.',
      'You finished, though you seemed unsure why.',
    ],
    closing: 'Curiosity isn\'t always enthusiastic. Sometimes it\'s a quiet compulsion. You followed it anyway. That says something.',
  },
  'uncomfortably-observant': {
    id: 'uncomfortably-observant',
    name: 'Uncomfortably Observant',
    tagline: 'Notices the invisible.',
    description: 'You knew something was off. You continued. Most people would have closed the page. You wanted to see what it would say next.',
    alternateDescriptions: [
      'You saw the cracks, hesitated, and kept going. You noticed the invisible. That\'s dangerous.',
      'You noticed. The timing. The phrasing. The quiet ways this was watching you back.',
    ],
    observations: [
      'Your behavior suggested awareness.',
      'You moved like someone being observed.',
      'You may have wondered what was being tracked.',
    ],
    closing: 'Most people don\'t notice. You did. Whether that\'s a gift or a burden depends entirely on what you do with it.',
  },
};

// Score ranges for each archetype (based on behavior score)
const scoreRanges = {
  'surface-level': { min: 0, max: 8 },
  'cautiously-investigative': { min: 9, max: 14 },
  'pattern-seeking': { min: 15, max: 20 },
  'reluctantly-curious': { min: 21, max: 26 },
  'uncomfortably-observant': { min: 27, max: 100 },
};

export function calculateArchetype(behavior: BehaviorData): Archetype {
  const score = behavior.behaviorScore;
  
  // Find archetype based on behavior score
  let archetypeId = 'surface-level';
  
  for (const [id, range] of Object.entries(scoreRanges)) {
    if (score >= range.min && score <= range.max) {
      archetypeId = id;
      break;
    }
  }
  
  const archetype = archetypes[archetypeId];
  
  // Randomly select description variant for replay variability
  const useAlternate = Math.random() > 0.5;
  if (useAlternate && archetype.alternateDescriptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * archetype.alternateDescriptions.length);
    return {
      ...archetype,
      description: archetype.alternateDescriptions[randomIndex],
    };
  }
  
  return archetype;
}

export function generateBehaviorInsight(behavior: BehaviorData): string {
  const insights: string[] = [];
  
  if (behavior.timeToFirstInteraction) {
    if (behavior.timeToFirstInteraction > 10000) {
      insights.push('You waited before beginning.');
    } else if (behavior.timeToFirstInteraction < 2000) {
      insights.push('You began almost immediately.');
    }
  }

  if (behavior.scrolledBeforeFirstClick) {
    insights.push('You looked around first.');
  }

  if (behavior.totalHoverTime > 8000) {
    insights.push('Your cursor lingered.');
  }
  
  if (behavior.scrollDepth > 0.5) {
    insights.push('You scrolled deeper than most.');
  }

  const avgAnswerTime = behavior.answerTimings.length > 0
    ? behavior.answerTimings.reduce((a, b) => a + b, 0) / behavior.answerTimings.length
    : 0;
  
  if (avgAnswerTime > 5000) {
    insights.push('You took your time with each question.');
  } else if (avgAnswerTime < 2000) {
    insights.push('You moved quickly through the questions.');
  }

  return insights.length > 0 
    ? insights.join(' ') 
    : 'Your behavior was unremarkable. Perhaps intentionally so.';
}
