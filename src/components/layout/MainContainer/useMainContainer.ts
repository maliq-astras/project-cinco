import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import type { GameControlsHandle } from '../../game/GameControls';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChallenge } from '@/hooks/api';
import { deviceDetection, getDeviceScaleFactor, getResponsiveLayoutMode, getHeaderSizeMode } from '@/helpers';
import { GameOutcome } from '@/types';

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

  // Theme access
  const { colors } = useTheme();

  // Component state
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [headerEntranceComplete, setHeaderEntranceComplete] = useState(false);
  const [gameEntranceComplete, setGameEntranceComplete] = useState(false);
  const [isSmallLandscape, setIsSmallLandscape] = useState(false);
  const [isTabletLandscape, setIsTabletLandscape] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isCompactHeader, setIsCompactHeader] = useState(false);
  const [responsiveLayoutMode, setResponsiveLayoutMode] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [headerSizeMode, setHeaderSizeMode] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const { language } = useLanguage();
  
  // Ref for game controls
  const gameControlsRef = useRef<GameControlsHandle>(null);

  // Focus the input after card closes
  useEffect(() => {
    if (shouldFocusInput && gameControlsRef.current) {
      // Add a small delay to ensure animations are complete
      setTimeout(() => {
        gameControlsRef.current?.focusInput();
        // Reset the flag after focusing
        setShouldFocusInput(false);
      }, 100);
    }
  }, [shouldFocusInput, setShouldFocusInput]);

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
      
      // Check if we're in landscape on a small screen (phone)
      const isSmall = height < 450;
      const isMedium = height >= 450 && height < 900;
      const isLandscape = width > height;
      
      // Phone in landscape - show warning
      // Also include Surface Duo landscape (720x540) which should show rotation warning
      const isSurfaceDuoLandscape = deviceDetection.isSurfaceDuo() && isLandscape;
      setIsSmallLandscape((isSmall && isLandscape) || isSurfaceDuoLandscape);
      
      // Tablet detection - both portrait and landscape
      const isTabletDevice = (width >= 768 && width <= 1024) || (isMedium && (isLandscape || width >= 768));
      setIsTablet(isTabletDevice);
      
      // Tablet detection - both landscape and portrait
      // Use the deviceDetection helper for more accurate tablet detection
      const isTabletLandscapeMode = deviceDetection.isTabletLandscape() || deviceDetection.isLargeTabletLandscape();
      const isTabletPortraitMode = deviceDetection.isTabletPortrait() || deviceDetection.isLargeTabletPortrait();
      const isTabletMode = isTabletLandscapeMode || isTabletPortraitMode;
      setIsTabletLandscape(isTabletMode);
      
      // Set compact header for any landscape mode with height below 650px
      setIsCompactHeader(isLandscape && height < 650);
      
      // Set responsive layout mode for spacing adjustments
      const layoutMode = getResponsiveLayoutMode(width, height, isTabletLandscapeMode);
      const scaleFactorValue = getDeviceScaleFactor(width, height, isTabletLandscapeMode);
      
      // Set header size mode for synchronized XS → XL system
      const headerSize = getHeaderSizeMode(width, height, isTabletLandscapeMode);
      
      // Debug logging (commented out for production)
      // console.log('useMainContainer Debug:', {
      //   width,
      //   height,
      //   isTabletLandscapeMode,
      //   isTabletPortraitMode,
      //   isTabletMode,
      //   layoutMode,
      //   scaleFactorValue,
      //   headerSize,
      //   deviceDetection: {
      //     isTabletLandscape: deviceDetection.isTabletLandscape(),
      //     isLargeTabletLandscape: deviceDetection.isLargeTabletLandscape(),
      //     isTabletPortrait: deviceDetection.isTabletPortrait(),
      //     isLargeTabletPortrait: deviceDetection.isLargeTabletPortrait()
      //   }
      // });
      
      setResponsiveLayoutMode(layoutMode);
      setScaleFactor(scaleFactorValue);
      setHeaderSizeMode(headerSize);
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
  }, [setWindowWidth, setScaleFactor]);

  // Handle loading complete
  const handleLoadingComplete = () => {
    setLoadingComplete(true);
    
    // Start header entrance after 0.5s blank period
    setTimeout(() => {
      setHeaderEntranceComplete(true);
    }, 500);
    
    // Start game entrance after header animation begins
    setTimeout(() => {
      setGameEntranceComplete(true);
    }, 1200); // 0.5s blank + 0.7s for header sequence
  };

  // Prepare game message data
  const showGameMessage = (victoryAnimationStep === 'summary' && gameOutcome !== null) || 
                          gameOutcome === 'loss-time' || 
                          gameOutcome === 'loss-final-five-wrong' || 
                          gameOutcome === 'loss-final-five-time' ||
                          (gameState.isGameOver && gameOutcome !== null); // Show end game message for already-played scenarios
  
  // Debug logging for already-played scenarios
  if (gameState.isGameOver && gameOutcome !== null && victoryAnimationStep !== 'summary') {
  // Silence verbose logging in production
  }
  
  const getGameMessageProps = () => {
    // If we have saved game data from today, use it for accurate stats
    if (todayGameData) {
      return {
        outcome: todayGameData.outcome,
        correctAnswer: todayGameData.correctAnswer,
        numberOfTries: todayGameData.numberOfTries,
        timeSpent: todayGameData.timeSpent,
      };
    }
    
    // Fallback to calculating from current game state (live game)
    
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
    
    // Calculate time spent - use correct initial time based on hard mode
    const initialTime = hardMode ? 55 : 300;
    const timeSpent = initialTime - timeRemaining;
    
    return {
      outcome: (gameOutcome || 'loss-time') as GameOutcome,
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
    headerEntranceComplete,
    gameEntranceComplete,
    isSmallLandscape,
    isTabletLandscape,
    isTablet,
    isCompactHeader,
    responsiveLayoutMode,
    headerSizeMode,
    isTimerActive,
    isFinalFiveActive,
    showFinalFiveTransition,
    finalFiveTransitionReason,
    colors,
    showGameMessage,
    isVictoryAnimationActive,
    isChallengeLoading,
    isAlreadyPlayedScenario: !!todayGameData && gameState.revealedFacts.length === 0, // Flag to indicate we're showing already-played data without cards
    
    // Refs
    gameControlsRef,
    
    // Functions
    handleLoadingComplete,
    getGameMessageProps,
    startFinalFive
  };
} 