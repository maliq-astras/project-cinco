import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { GameControlsHandle } from '../../components/gameControls';

export function useMainContainer() {
  // Access game state
  const gameState = useGameStore(state => state.gameState);
  const viewingFact = useGameStore(state => state.viewingFact);
  const fetchChallenge = useGameStore(state => state.fetchChallenge);
  const decrementTimer = useGameStore(state => state.decrementTimer);
  const setWindowWidth = useGameStore(state => state.setWindowWidth);
  const isTimerActive = useGameStore(state => state.isTimerActive);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const victoryAnimationStep = useGameStore(state => state.victoryAnimationStep);
  const gameOutcome = useGameStore(state => state.gameOutcome);
  const timeRemaining = useGameStore(state => state.timeRemaining);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const resetTimer = useGameStore(state => state.resetTimer);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const finalFiveTransitionReason = useGameStore(state => state.finalFiveTransitionReason);
  const startFinalFive = useGameStore(state => state.startFinalFive);

  // Theme access
  const { colors } = useTheme();

  // Component state
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isSmallLandscape, setIsSmallLandscape] = useState(false);
  
  // Ref for game controls
  const gameControlsRef = useRef<GameControlsHandle>(null);

  // Initialize the timer based on hard mode setting on page load (before game starts)
  useEffect(() => {
    if (!isTimerActive && !gameState.isGameOver) {
      resetTimer();
    }
  }, [isHardModeEnabled, isTimerActive, gameState.isGameOver, resetTimer]);

  // Fetch challenge on mount
  useEffect(() => {
    const loadChallenge = async () => {
      await fetchChallenge();
    };
    loadChallenge();
  }, [fetchChallenge]);

  // Handle the timer
  useEffect(() => {
    if (isTimerActive && !gameState.isGameOver) {
      const timer = setInterval(() => {
        const currentTimeRemaining = useGameStore.getState().timeRemaining;
        
        if (currentTimeRemaining > 0 && !useGameStore.getState().gameState.isGameOver) {
          decrementTimer();
        } else {
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isTimerActive, timeRemaining, decrementTimer, gameState.isGameOver]);

  // Handle window resize and orientation changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowWidth(width);
      
      // Check if we're in landscape on a small screen
      const isSmall = height < 768;
      const isLandscape = width > height;
      
      setIsSmallLandscape(isSmall && isLandscape);
    };
    
    // Initial setup
    handleResize();
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [setWindowWidth]);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  // Prepare game message data
  const showGameMessage = (victoryAnimationStep === 'summary' && gameOutcome) || gameOutcome === 'loss';
  
  const getGameMessageProps = () => {
    // Find correct answer if it exists
    const correctGuess = gameState.guesses.find(g => g.isCorrect);
    
    // Default correct answer from correct guess
    let correctAnswer = correctGuess?.guess || '';

    // If we're in Final Five mode and there's no correct guess (time ran out or wrong answer)
    // but we do have options, we need to find the correct answer from the options
    // We won't have it immediately, but the useEndGameMessage hook will find it
    if (!correctAnswer && gameState.finalFiveOptions && gameState.finalFiveOptions.length > 0) {
      // Let the hook handle finding the correct answer asynchronously
      // Just pass an empty string for now
      correctAnswer = '';
    }
    
    // Calculate number of tries
    const numberOfTries = correctGuess ? gameState.guesses.indexOf(correctGuess) + 1 : 0;
    
    // Calculate time spent
    const timeSpent = 300 - timeRemaining;
    
    return {
      outcome: gameOutcome || 'loss',
      correctAnswer,
      numberOfTries,
      timeSpent,
    };
  };

  return {
    // State
    gameState,
    viewingFact,
    loadingComplete,
    isSmallLandscape,
    isTimerActive,
    isFinalFiveActive,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    colors,
    showGameMessage,
    
    // Refs
    gameControlsRef,
    
    // Functions
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive
  };
} 