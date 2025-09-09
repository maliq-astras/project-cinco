interface TutorialStep {
  target: string;
  title: string;
  description: string;
  textPosition: 'left' | 'right' | 'top' | 'bottom';
}

export const createTutorialSteps = (hardMode: boolean, t: (key: string, options?: any) => string): TutorialStep[] => [
  {
    target: 'header-area',
    title: t('tutorial.steps.welcome.title'),
    description: t('tutorial.steps.welcome.description'),
    textPosition: 'right',
  },
  {
    target: 'category-title',
    title: t('tutorial.steps.category.title'),
    description: t('tutorial.steps.category.description'),
    textPosition: 'right',
  },
  {
    target: 'facts-area',
    title: t('tutorial.steps.factCards.title'),
    description: t('tutorial.steps.factCards.description'),
    textPosition: 'right',
  },
  {
    target: 'bubble-grid',
    title: t('tutorial.steps.hiddenFacts.title'),
    description: t('tutorial.steps.hiddenFacts.description'),
    textPosition: 'left',
  },
  {
    target: 'bubble-0',
    title: t('tutorial.steps.revealFacts.title'),
    description: t('tutorial.steps.revealFacts.description', 'Drag any bubble to the card area to reveal its fact! Start with this one to begin your journey.'),
    textPosition: 'right',
  },
  {
    target: 'game-input',
    title: t('tutorial.steps.guesses.title'),
    description: t('tutorial.steps.guesses.description'),
    textPosition: 'top',
  },
  {
    target: 'game-timer',
    title: t('tutorial.steps.timeLimit.title'),
    description: hardMode 
      ? t('tutorial.steps.timeLimit.description.hard')
      : t('tutorial.steps.timeLimit.description.normal'),
    textPosition: 'top',
  },
  {
    target: 'game-progress',
    title: t('tutorial.steps.guessLimit.title'),
    description: t('tutorial.steps.guessLimit.description'),
    textPosition: 'top',
  },
  {
    target: 'game-controls-right',
    title: t('tutorial.steps.tools.title'),
    description: t('tutorial.steps.tools.description'),
    textPosition: 'top',
  }
];

export type { TutorialStep };