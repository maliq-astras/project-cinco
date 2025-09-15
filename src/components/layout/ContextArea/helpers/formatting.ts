import { Challenge } from '@/types';

interface GenerateBubbleMessageParams {
  hoveredFact: number | null;
  challenge: Challenge | null;
  revealedFacts: number[];
  isGameOver: boolean;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  t: (key: string, fallback: string) => string;
}

export const generateBubbleMessage = ({
  hoveredFact,
  challenge,
  revealedFacts,
  isGameOver,
  isFinalFiveActive,
  showFinalFiveTransition,
  t
}: GenerateBubbleMessageParams): string => {
  if (isGameOver || isFinalFiveActive || showFinalFiveTransition) {
    return "";
  }
  
  const shouldShowHoverContext = hoveredFact !== null && 
    challenge?.facts && 
    !revealedFacts.includes(hoveredFact);
    
  if (shouldShowHoverContext) {
    return t(`factTypes.${challenge?.facts[hoveredFact].factType.toLowerCase()}`, challenge?.facts[hoveredFact].factType);
  }
  
  return "";
};

interface GenerateInstructionMessageParams {
  isGameOver: boolean;
  showLoading: boolean;
  isLongRequest: boolean;
  hasSeenClue: boolean;
  canMakeGuess: boolean;
  t: (key: string, fallback: string) => string;
}

export const generateInstructionMessage = ({
  isGameOver,
  showLoading,
  isLongRequest,
  hasSeenClue,
  canMakeGuess,
  t
}: GenerateInstructionMessageParams): string => {
  if (isGameOver) {
    return "";
  }
  
  if (showLoading) {
    if (isLongRequest) {
      return t('game.status.longRequest', 'Still working on it... This is taking longer than expected');
    }
    return t('game.status.guessing', 'Guessing...');
  }
  
  if (!hasSeenClue) {
    return t('game.instructions.dragToBegin', 'Drag a bubble to reveal a fact and begin...');
  }
  
  if (!canMakeGuess) {
    return t('game.instructions.revealNew', 'Reveal a new fact to make another guess...');
  }
  
  return t('game.instructions.enterGuess', 'Enter your guess...');
};