import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '@/hooks/responsive';
import { ResponsiveValues } from '@/types/responsive';
import { useFinalFiveIntroState } from './useFinalFiveIntroState';
import { useFinalFiveIntroEffects } from './useFinalFiveIntroEffects';
import { useFinalFiveIntroActions } from './useFinalFiveIntroActions';

interface UseFinalFiveIntroProps {
  reason: 'time' | 'guesses';
  onStart: () => void;
}

interface UseFinalFiveIntroReturn {
  handleStart: () => Promise<void>;
  isTransitioning: boolean;
  message: string;
  colors: { primary: string };
  hardMode: boolean;
  isLoading: boolean;
  isSlowConnection: boolean;
  showStartButton: boolean;
  retryCount: number;
  breakpoint: string;
  heightBreakpoint: string;
  isLandscape: boolean;
  isPortrait: boolean;
  responsiveValues: ResponsiveValues;
}

export const useFinalFiveIntro = ({ reason, onStart }: UseFinalFiveIntroProps): UseFinalFiveIntroReturn => {
  // External dependencies
  const { colors } = useTheme();
  const { t } = useTranslation();
  const hardMode = useGameStore(state => state.hardMode);
  const finalFiveOptions = useGameStore(state => state.gameState.finalFiveOptions);
  
  const { 
    breakpoint, 
    heightBreakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues 
  } = useResponsive();
  
  // Component state
  const {
    isTransitioning,
    setIsTransitioning,
    isLoading,
    setIsLoading,
    isSlowConnection,
    setIsSlowConnection,
    showStartButton,
    setShowStartButton,
    retryCount,
    setRetryCount
  } = useFinalFiveIntroState();
  
  // Side effects
  useFinalFiveIntroEffects({
    isLoading,
    finalFiveOptions,
    setIsLoading,
    setIsSlowConnection,
    setShowStartButton
  });
  
  // Actions
  const { handleStart } = useFinalFiveIntroActions({
    onStart,
    isTransitioning,
    finalFiveOptions,
    setIsTransitioning,
    setIsLoading,
    setIsSlowConnection,
    setRetryCount
  });
  
  // Computed values
  const timeLimit = hardMode ? "5" : "55";
  const message = reason === 'time'
    ? t('game.finalFive.timeUp', { timeLimit })
    : t('game.finalFive.guessesUp', { timeLimit });

  return {
    handleStart,
    isTransitioning,
    message,
    colors,
    hardMode,
    isLoading,
    isSlowConnection,
    showStartButton,
    retryCount,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    responsiveValues
  };
}; 