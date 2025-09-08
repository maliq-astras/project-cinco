import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChallenge } from '@/hooks/api';

interface UseMainContainerEventsProps {
  mounted: boolean;
  responsiveValues: any;
  shouldFocusInput: boolean;
  gameControlsRef: React.RefObject<any>;
  setShouldFocusInput: (value: boolean) => void;
  setScaleFactor: (factor: number) => void;
  isTimerActive: boolean;
  gameState: any;
  resetTimer: () => void;
  isHardModeEnabled: boolean;
  timeRemaining: number;
  decrementTimer: () => void;
  fetchChallenge: (language: string) => void;
}

export const useMainContainerEvents = ({
  mounted,
  responsiveValues,
  shouldFocusInput,
  gameControlsRef,
  setShouldFocusInput,
  setScaleFactor,
  isTimerActive,
  gameState,
  resetTimer,
  isHardModeEnabled,
  timeRemaining,
  decrementTimer,
  fetchChallenge
}: UseMainContainerEventsProps) => {
  const { language } = useLanguage();
  
  // Fetch challenge using React Query
  const { data: challenge } = useChallenge(language);

  // Set scale factor based on responsive values
  useEffect(() => {
    if (mounted) {
      const scaleFactor = responsiveValues.bubbleSize / 60; // Base size is 60px
      setScaleFactor(scaleFactor);
    }
  }, [mounted, responsiveValues.bubbleSize, setScaleFactor]);

  // Focus the input after card closes
  useEffect(() => {
    if (shouldFocusInput && gameControlsRef.current) {
      setTimeout(() => {
        gameControlsRef.current?.focusInput();
        setShouldFocusInput(false);
      }, 100);
    }
  }, [shouldFocusInput, setShouldFocusInput]);

  // Initialize the timer based on hard mode setting
  useEffect(() => {
    if (!isTimerActive && !gameState.isGameOver) {
      resetTimer();
    }
  }, [isHardModeEnabled, isTimerActive, gameState.isGameOver, resetTimer]);

  // Update game state when challenge data is fetched
  useEffect(() => {
    if (challenge) {
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

  return {};
};