import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/responsive';
import { getLayoutMode, isMobileLayout } from '@/constants/breakpoints';
import { storage, STORAGE_KEYS } from '@/utils/localStorage';
import type { GameControlsHandle } from '@/components/game/GameControls';

export function useMainContainerState() {
  // Game store state
  const gameState = useGameStore(state => state.gameState);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const hasSeenTodaysLoadingAnimation = useGameStore(state => state.hasSeenTodaysLoadingAnimation);
  const setHasSeenTodaysLoadingAnimation = useGameStore(state => state.setHasSeenTodaysLoadingAnimation);
  const viewingFact = useGameStore(state => state.viewingFact);
  const fetchChallenge = useGameStore(state => state.fetchChallenge);
  const decrementTimer = useGameStore(state => state.decrementTimer);
  const isTimerActive = useGameStore(state => state.isTimerActive);
  const shouldPauseTimer = useGameStore(state => state.shouldPauseTimer);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const gameOutcome = useGameStore(state => state.gameOutcome);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const hardMode = useGameStore(state => state.hardMode);
  const resetTimer = useGameStore(state => state.resetTimer);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const finalFiveTransitionReason = useGameStore(state => state.finalFiveTransitionReason);
  const startFinalFive = useGameStore(state => state.startFinalFive);
  const shouldFocusInput = useGameStore(state => state.shouldFocusInput);
  const setShouldFocusInput = useGameStore(state => state.setShouldFocusInput);
  const setScaleFactor = useGameStore(state => state.setScaleFactor);
  const todayGameData = useGameStore(state => state.todayGameData);
  const isResumeModalOpen = useGameStore(state => state.isResumeModalOpen);
  const setResumeModalOpen = useGameStore(state => state.setResumeModalOpen);
  const isWelcomeModalOpen = useGameStore(state => state.isWelcomeModalOpen);
  const setWelcomeModalOpen = useGameStore(state => state.setWelcomeModalOpen);
  const setTutorialOpen = useGameStore(state => state.setTutorialOpen);

  // Theme state
  const { colors } = useTheme();

  // Responsive state
  const { 
    width, 
    height, 
    mounted, 
    breakpoint, 
    isLandscape, 
    responsiveValues,
  } = useResponsive();

  // Component local state
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [headerEntranceComplete, setHeaderEntranceComplete] = useState(false);
  const [gameEntranceComplete, setGameEntranceComplete] = useState(false);

  // Sync loading states with daily loading animation
  useEffect(() => {
    if (hasSeenTodaysLoadingAnimation && gameState.challenge) {
      setLoadingComplete(true);
      setHeaderEntranceComplete(true);
      setGameEntranceComplete(true);
    }
  }, [hasSeenTodaysLoadingAnimation, gameState.challenge]);

  // Show welcome modal for first-time visitors
  useEffect(() => {
    if (loadingComplete && gameEntranceComplete && gameState.challenge) {
      const hasSeenWelcome = storage.get(STORAGE_KEYS.WELCOME_SEEN, false);
      if (!hasSeenWelcome && !isWelcomeModalOpen) {
        // Small delay to ensure smooth transition after loading
        setTimeout(() => {
          setWelcomeModalOpen(true);
        }, 500);
      }
    }
  }, [loadingComplete, gameEntranceComplete, gameState.challenge]); // Intentionally exclude isWelcomeModalOpen and setWelcomeModalOpen to prevent re-running when modal state changes
  
  // Ref for game controls
  const gameControlsRef = useRef<GameControlsHandle>(null);

  // Layout calculations (minimal)
  const layoutMode = mounted ? getLayoutMode(width, height) : 'mobile';
  const isNarrow = mounted ? isMobileLayout(width, height) : true;

  return {
    // Game state
    gameState,
    hasSeenClue,
    viewingFact,
    fetchChallenge,
    decrementTimer,
    isTimerActive,
    shouldPauseTimer,
    isFinalFiveActive,
    victoryAnimationStep,
    isVictoryAnimationActive,
    gameOutcome,
    timeRemaining,
    isHardModeEnabled,
    hardMode,
    resetTimer,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    startFinalFive,
    shouldFocusInput,
    setShouldFocusInput,
    setScaleFactor,
    todayGameData,
    isResumeModalOpen,
    setResumeModalOpen,
    isWelcomeModalOpen,
    setWelcomeModalOpen,
    setTutorialOpen,
    hasSeenTodaysLoadingAnimation,
    setHasSeenTodaysLoadingAnimation,

    // Theme
    colors,
    
    // Responsive
    width,
    height,
    mounted,
    breakpoint,
    isLandscape,
    responsiveValues,
    
    // Local state
    loadingComplete,
    setLoadingComplete,
    headerEntranceComplete,
    setHeaderEntranceComplete,
    gameEntranceComplete,
    setGameEntranceComplete,
    gameControlsRef,
    
    // Layout
    layoutMode,
    isNarrow
  };
}