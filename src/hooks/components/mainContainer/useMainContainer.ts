import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useTheme } from '../../../context/ThemeContext';
import { GameControlsHandle } from '../../components/gameControls';
import { useLanguage } from '../../../context/LanguageContext';
import { useChallenge } from '../../api';

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
  const prefetchFinalFiveOptions = useGameStore(state => state.prefetchFinalFiveOptions);

  // Theme access
  const { colors } = useTheme();

  // Component state
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isSmallLandscape, setIsSmallLandscape] = useState(false);
  const { language } = useLanguage();
  
  // Track if Final Five options have been prefetched
  const [hasPrefetchedFinalFive, setHasPrefetchedFinalFive] = useState(false);
  
  // Ref for game controls
  const gameControlsRef = useRef<GameControlsHandle>(null);

  // Initialize the timer based on hard mode setting on page load (before game starts)
  useEffect(() => {
    if (!isTimerActive && !gameState.isGameOver) {
      resetTimer();
    }
  }, [isHardModeEnabled, isTimerActive, gameState.isGameOver, resetTimer]);

  // Fetch challenge using React Query
  const { data: challenge, isLoading: isChallengeLoading } = useChallenge(language);
  
  // Update game state when challenge data is fetched
  useEffect(() => {
    if (challenge) {
      // Use the existing fetchChallenge method which handles update of the state
      fetchChallenge(language);
    }
  }, [challenge, language, fetchChallenge]);
  
  // Prefetch Final Five options once the game has fully loaded
  useEffect(() => {
    const prefetchOptions = async () => {
      // Only prefetch if:
      // 1. Loading is complete
      // 2. We have a challenge
      // 3. We haven't already prefetched
      // 4. The game isn't over
      // 5. We're not already in Final Five mode
      if (
        loadingComplete && 
        gameState.challenge && 
        !hasPrefetchedFinalFive && 
        !gameState.isGameOver && 
        !isFinalFiveActive && 
        !showFinalFiveTransition
      ) {
        console.log('Background prefetching Final Five options...');
        
        // Mark as prefetched to avoid multiple attempts
        setHasPrefetchedFinalFive(true);
        
        try {
          // Add a small delay to ensure the main UI is rendered first
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Prefetch with a longer timeout
          await prefetchFinalFiveOptions();
          console.log('Final Five options prefetched successfully');
        } catch (error) {
          console.log('Background prefetch failed, will retry during gameplay');
          // Reset the flag to allow retry
          setHasPrefetchedFinalFive(false);
        }
      }
    };
    
    prefetchOptions();
  }, [loadingComplete, gameState.challenge, gameState.isGameOver, isFinalFiveActive, showFinalFiveTransition, hasPrefetchedFinalFive, prefetchFinalFiveOptions]);

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
    isChallengeLoading,
    hasPrefetchedFinalFive,
    
    // Refs
    gameControlsRef,
    
    // Functions
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive
  };
} 