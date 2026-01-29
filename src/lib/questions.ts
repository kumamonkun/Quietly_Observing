import type { BehaviorData } from '@/hooks/useBehaviorTracker';

export interface Question {
  id: number;
  text: string;
  subtext?: string;
  options: {
    id: string;
    text: string;
  }[];
}

type PoolItem = Omit<Question, 'id'> & {
  condition?: (behavior: BehaviorData) => boolean;
};

// Helpers for conditional questions (evaluated at quiz start)
const scrolledFirst = (b: BehaviorData) => b.scrolledBeforeFirstClick;
const slowToStart = (b: BehaviorData) =>
  b.timeToFirstInteraction !== null && b.timeToFirstInteraction > 5000;
const fastToStart = (b: BehaviorData) =>
  b.timeToFirstInteraction !== null && b.timeToFirstInteraction < 2000;
const hoveredLong = (b: BehaviorData) => b.totalHoverTime > 3000;

const questionsPool: PoolItem[] = [
  {
    text: 'Do you usually finish things you start online?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
  },
  {
    text: 'Did you scroll before answering the first question?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'No' },
      { id: 'c', text: "Didn't notice" },
    ],
  },
  {
    text: 'When something slightly confuses you, what do you do?',
    options: [
      { id: 'a', text: 'Figure it out' },
      { id: 'b', text: 'Google it' },
      { id: 'c', text: 'Leave' },
      { id: 'd', text: 'Stare' },
    ],
  },
  {
    text: 'How long do you usually think before clicking something unfamiliar?',
    options: [
      { id: 'a', text: 'Immediate' },
      { id: 'b', text: 'Few seconds' },
      { id: 'c', text: 'Overthink' },
    ],
  },
  {
    text: 'Be honest. Why are you still here?',
    options: [
      { id: 'a', text: 'Curious' },
      { id: 'b', text: 'Mildly invested' },
      { id: 'c', text: "Don't like stopping" },
      { id: 'd', text: 'Nothing better' },
    ],
  },
  {
    text: 'If this page suddenly closed, how would you feel?',
    options: [
      { id: 'a', text: 'Fine' },
      { id: 'b', text: 'Annoyed' },
      { id: 'c', text: 'Curious' },
      { id: 'd', text: 'Reopen immediately' },
    ],
  },
  {
    text: 'Do you click links without reading them first?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'Do you notice small changes on a webpage?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'Do you reread instructions before starting?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'When a question seems pointless, do you answer it anyway?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
  },
  {
    text: 'Do you scroll to the bottom of articles even if uninterested?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'Do you like to figure out puzzles or skip them?',
    options: [
      { id: 'a', text: 'Figure out' },
      { id: 'b', text: 'Skip' },
      { id: 'c', text: 'Half-half' },
    ],
  },
  {
    text: 'How many tabs are open right now?',
    options: [
      { id: 'a', text: '0-2' },
      { id: 'b', text: '3-5' },
      { id: 'c', text: '6+' },
    ],
  },
  {
    text: 'Do you read the fine print?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'Do you click buttons just to see what happens?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  // Conditional: showed scroll behavior before first click
  {
    text: 'You looked around before committing. Do you do that often?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Not really' },
    ],
    condition: scrolledFirst,
  },
  {
    text: 'Do you skim the whole page before interacting?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Rarely' },
    ],
    condition: scrolledFirst,
  },
  // Conditional: slow to first interaction
  {
    text: 'You took a moment before starting. Is that typical?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
    condition: slowToStart,
  },
  {
    text: 'Do you prefer to understand something before engaging?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'It depends' },
      { id: 'c', text: 'No' },
    ],
    condition: slowToStart,
  },
  // Conditional: fast to first interaction
  {
    text: 'You started quickly. Do you usually dive in without hesitation?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
    condition: fastToStart,
  },
  // Conditional: hovered a long time
  {
    text: 'Do you often hover over options before choosing?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Rarely' },
    ],
    condition: hoveredLong,
  },
  {
    text: 'When unsure, do you pause before clicking?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
    condition: hoveredLong,
  },
  // Additional pool questions (no condition)
  {
    text: 'Do you close tabs you never finished reading?',
    options: [
      { id: 'a', text: 'Rarely' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Often' },
    ],
  },
  {
    text: 'When you see "Learn more", do you usually click?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
  },
  {
    text: 'Do you read comments before forming an opinion?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'If a page loads slowly, do you wait or leave?',
    options: [
      { id: 'a', text: 'Wait' },
      { id: 'b', text: 'It depends' },
      { id: 'c', text: 'Leave' },
    ],
  },
  {
    text: 'Do you use the back button often?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Rarely' },
    ],
  },
  {
    text: 'Do you trust the first result or keep searching?',
    options: [
      { id: 'a', text: 'First result' },
      { id: 'b', text: 'A few more' },
      { id: 'c', text: 'Keep searching' },
    ],
  },
  {
    text: 'Do you notice when a site tracks your cursor?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
  },
  {
    text: 'Do you read terms and conditions?',
    options: [
      { id: 'a', text: 'Always' },
      { id: 'b', text: 'Skim' },
      { id: 'c', text: 'Never' },
    ],
  },
  {
    text: 'When a pop-up appears, do you read it or dismiss it?',
    options: [
      { id: 'a', text: 'Read' },
      { id: 'b', text: 'Sometimes read' },
      { id: 'c', text: 'Dismiss' },
    ],
  },
  {
    text: 'Do you care if a site remembers your choices?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'It depends' },
      { id: 'c', text: 'No' },
    ],
  },
  {
    text: 'Do you revisit pages to check if something changed?',
    options: [
      { id: 'a', text: 'Often' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'Rarely' },
    ],
  },
  {
    text: 'Do you prefer short or long-form content?',
    options: [
      { id: 'a', text: 'Short' },
      { id: 'b', text: 'Depends' },
      { id: 'c', text: 'Long' },
    ],
  },
  {
    text: 'When you disagree with something online, do you engage?',
    options: [
      { id: 'a', text: 'Yes' },
      { id: 'b', text: 'Sometimes' },
      { id: 'c', text: 'No' },
    ],
  },
  {
    text: 'Do you open links in new tabs or the same tab?',
    options: [
      { id: 'a', text: 'New tabs' },
      { id: 'b', text: 'Mixed' },
      { id: 'c', text: 'Same tab' },
    ],
  },
  {
    text: 'Do you finish videos or skip to the end?',
    options: [
      { id: 'a', text: 'Finish' },
      { id: 'b', text: 'Sometimes skip' },
      { id: 'c', text: 'Skip' },
    ],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Pick up to `count` questions from the pool. Questions with a condition are included only when condition(behavior) is true. */
export function pickRandomQuestions(
  count: number = 8,
  behavior?: BehaviorData
): Question[] {
  const effectiveBehavior = behavior ?? {
    timeToFirstInteraction: null,
    answerTimings: [],
    scrolledBeforeFirstClick: false,
    hoverHesitations: [],
    totalHoverTime: 0,
    mouseMovementIntensity: 'low' as const,
    questionRevisits: 0,
    answers: [],
    scrollDepth: 0,
    behaviorScore: 0,
  };

  const eligible = questionsPool.filter(
    (q) => !q.condition || q.condition(effectiveBehavior)
  );
  const rest = questionsPool.filter(
    (q) => q.condition && !q.condition(effectiveBehavior)
  );

  const shuffledEligible = shuffle(eligible);
  let selected = shuffledEligible.slice(0, count);

  if (selected.length < count && rest.length > 0) {
    const shuffledRest = shuffle(rest);
    const needed = count - selected.length;
    selected = [...selected, ...shuffledRest.slice(0, needed)];
  }

  return selected.map((q, index) => {
    const { condition: _c, ...rest } = q;
    return { ...rest, id: index + 1 };
  });
}

// Mid-quiz commentary lines (once per session)
export const commentaryLines = [
  'You paused. That pause mattered.',
  "You hovered longer than 85% of users.",
  "You didn't read everything fully. Still here.",
  'You backtracked once. Smart move.',
  "You seem aware. That awareness doesn't stop you.",
  'You clicked immediately. Bold choice.',
  'Interesting reaction time.',
  'You hesitated. We noticed.',
];

// Per-click micro-text (delay + fade, randomized)
export const microObservationLines = [
  "You didn't rush that.",
  'Noted.',
  'Interesting.',
  'Proceeding.',
  'Understood.',
];
