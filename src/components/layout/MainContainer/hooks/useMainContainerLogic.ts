import { useMemo } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ANIMATIONS } from '@/constants/animations';
import { getResponsiveLayoutClass, getSmartScalingStyle, shouldUseMobileLayout } from '../helpers';
import { GameOutcome } from '@/types';

interface UseMainContainerLogicProps {
  victoryAnimationStep: any;
  gameOutcome: GameOutcome | null;
  gameState: any;
  todayGameData: any;
  hardMode: boolean;
  timeRemaining: number;
  breakpoint: string;
  isLandscape: boolean;
  isNarrow: boolean;
}

export const useMainContainerLogic = ({
  victoryAnimationStep,
  gameOutcome,
  gameState,
  todayGameData,
  hardMode,
  timeRemaining,
  breakpoint,
  isLandscape,
  isNarrow
}: UseMainContainerLogicProps) => {
  const scaleFactor = useGameStore(state => state.scaleFactor);
  
  // Memoized fade in animation from constants
  const fadeInAnimation = useMemo(() => ANIMATIONS.FADE_IN, []);

  // Calculate responsive layout properties
  const responsiveLayoutMode = breakpoint === 'xs' || breakpoint === 'sm' ? 'compact' : 'normal';
  const isTablet = breakpoint === 'md' || breakpoint === 'lg';
  const isTabletLandscape = isTablet && isLandscape;

  // Memoized responsive layout class calculation
  const responsiveLayoutClass = useMemo(() => 
    getResponsiveLayoutClass(isTabletLandscape, responsiveLayoutMode),
    [isTabletLandscape, responsiveLayoutMode]
  );

  // Memoized smart scaling style calculation
  const smartScalingStyle = useMemo(() =>
    getSmartScalingStyle(isTabletLandscape, scaleFactor),
    [isTabletLandscape, scaleFactor]
  );
  
  // Determine if mobile layout is needed
  const needsMobileLayout = shouldUseMobileLayout(isNarrow);

  // Determine if game message should be shown
  const showGameMessage = (victoryAnimationStep === 'summary' && gameOutcome !== null) || 
                          gameOutcome === 'loss-time' || 
                          gameOutcome === 'loss-final-five-wrong' || 
                          gameOutcome === 'loss-final-five-time' ||
                          (gameState.isGameOver && gameOutcome !== null);

  // Prepare game message data
  const getGameMessageProps = () => {
    if (todayGameData) {
      return {
        outcome: todayGameData.outcome,
        correctAnswer: todayGameData.correctAnswer,
        numberOfTries: todayGameData.numberOfTries,
        timeSpent: todayGameData.timeSpent,
      };
    }
    
    const correctGuess = gameState.guesses.find((g: any) => g.isCorrect);
    let correctAnswer = correctGuess?.guess || '';

    if (!correctAnswer && gameState.finalFiveOptions && gameState.finalFiveOptions.length > 0) {
      correctAnswer = '';
    }
    
    const numberOfTries = correctGuess ? gameState.guesses.indexOf(correctGuess) + 1 : 0;
    const initialTime = hardMode ? 55 : 300;
    const timeSpent = initialTime - timeRemaining;
    
    return {
      outcome: (gameOutcome || 'loss-time') as GameOutcome,
      correctAnswer,
      numberOfTries,
      timeSpent,
    };
  };
  
  // Determine if already played scenario
  const isAlreadyPlayedScenario = !!todayGameData && gameState.revealedFacts.length === 0;

  return {
    fadeInAnimation,
    responsiveLayoutClass,
    smartScalingStyle,
    needsMobileLayout,
    isTabletLandscape,
    showGameMessage,
    getGameMessageProps,
    isAlreadyPlayedScenario
  };
};