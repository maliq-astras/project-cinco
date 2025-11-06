import { useMainContainerState } from './useMainContainerState';
import { useMainContainerLogic } from './useMainContainerLogic';
import { useMainContainerEvents } from './useMainContainerEvents';

export const useMainContainer = () => {
  const state = useMainContainerState();
  
  const logic = useMainContainerLogic({
    victoryAnimationStep: state.victoryAnimationStep,
    gameOutcome: state.gameOutcome,
    gameState: state.gameState,
    todayGameData: state.todayGameData,
    hardMode: state.hardMode,
    timeRemaining: state.timeRemaining,
    breakpoint: state.breakpoint,
    isLandscape: state.isLandscape,
    isNarrow: state.isNarrow
  });


  // Events hook for side effects
  useMainContainerEvents({
    mounted: state.mounted,
    responsiveValues: state.responsiveValues,
    shouldFocusInput: state.shouldFocusInput,
    gameControlsRef: state.gameControlsRef,
    setShouldFocusInput: state.setShouldFocusInput,
    setScaleFactor: state.setScaleFactor,
    isTimerActive: state.isTimerActive,
    gameState: state.gameState,
    resetTimer: state.resetTimer,
    isHardModeEnabled: state.isHardModeEnabled,
    timeRemaining: state.timeRemaining,
    decrementTimer: state.decrementTimer,
    fetchChallenge: state.fetchChallenge,
    shouldPauseTimer: state.shouldPauseTimer
  });

  // Handle loading complete with proper state setters
  const handleLoadingComplete = () => {
    // Mark that user has seen today's loading animation
    state.setHasSeenTodaysLoadingAnimation(true);

    state.setLoadingComplete(true);

    setTimeout(() => {
      state.setHeaderEntranceComplete(true);
    }, 500);

    setTimeout(() => {
      state.setGameEntranceComplete(true);
    }, 1200);
  };

  return {
    // Core state
    gameState: state.gameState,
    viewingFact: state.viewingFact,
    loadingComplete: state.loadingComplete,
    headerEntranceComplete: state.headerEntranceComplete,
    gameEntranceComplete: state.gameEntranceComplete,
    isFinalFiveActive: state.isFinalFiveActive,
    showFinalFiveTransition: state.showFinalFiveTransition,
    finalFiveTransitionReason: state.finalFiveTransitionReason,
    isVictoryAnimationActive: state.isVictoryAnimationActive,
    gameControlsRef: state.gameControlsRef,
    breakpoint: state.breakpoint,
    isNarrow: state.isNarrow,
    startFinalFive: state.startFinalFive,
    isResumeModalOpen: state.isResumeModalOpen,
    setResumeModalOpen: state.setResumeModalOpen,
    isWelcomeModalOpen: state.isWelcomeModalOpen,
    setWelcomeModalOpen: state.setWelcomeModalOpen,
    setTutorialOpen: state.setTutorialOpen,

    // Logic results
    isTabletLandscape: logic.isTabletLandscape,
    showGameMessage: logic.showGameMessage,
    getGameMessageProps: logic.getGameMessageProps,
    isAlreadyPlayedScenario: logic.isAlreadyPlayedScenario,
    fadeInAnimation: logic.fadeInAnimation,
    responsiveLayoutClass: logic.responsiveLayoutClass,
    smartScalingStyle: logic.smartScalingStyle,
    needsMobileLayout: logic.needsMobileLayout,
    
    // Events
    handleLoadingComplete
  };
};