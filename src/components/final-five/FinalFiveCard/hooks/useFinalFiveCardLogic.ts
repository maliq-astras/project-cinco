import { useResponsive } from '@/hooks/responsive';
import { useFinalFiveCardState } from './useFinalFiveCardState';
import { useFinalFiveCardEvents } from './useFinalFiveCardEvents';
import { useFinalFiveCardStyles } from './useFinalFiveCardStyles';

interface UseFinalFiveCardProps {
  isGameOver: boolean;
  allCardsFlipped: boolean;
  selectedOption: string | null;
  option: string;
  frontBg: string;
  isCorrect?: boolean;
}

interface UseFinalFiveCardReturn {
  isHovered: boolean;
  isActive: boolean;
  timeRanOut: boolean;
  isSelected: boolean;
  shouldFadeOut: boolean;
  finalOpacity: number;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  getBackCardStyle: (backBg: string, textColor: string) => React.CSSProperties;
  width: number;
  height: number;
  breakpoint: string;
  heightBreakpoint: string;
  isLandscape: boolean;
  isPortrait: boolean;
  responsiveValues: Record<string, any>;
}

export function useFinalFiveCard({
  isGameOver,
  allCardsFlipped,
  selectedOption,
  option,
  frontBg,
  isCorrect = false
}: UseFinalFiveCardProps): UseFinalFiveCardReturn {
  // External dependencies
  const { 
    width,
    height,
    breakpoint, 
    heightBreakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues 
  } = useResponsive();
  
  // Component state
  const {
    isHovered,
    setIsHovered,
    isActive,
    setIsActive
  } = useFinalFiveCardState();
  
  // Computed values
  const timeRanOut = isGameOver && !selectedOption;
  const isSelected = selectedOption === option;
  const shouldFadeOut = (selectedOption !== null && !isSelected) || timeRanOut;
  const finalOpacity = shouldFadeOut ? 0 : 1;
  
  // Event handlers
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave
  } = useFinalFiveCardEvents({
    isGameOver,
    allCardsFlipped,
    selectedOption,
    setIsHovered,
    setIsActive
  });
  
  // Styles
  const { getBackCardStyle } = useFinalFiveCardStyles({
    isGameOver,
    allCardsFlipped,
    selectedOption,
    frontBg,
    isCorrect,
    isHovered,
    isActive,
    shouldFadeOut
  });

  return {
    isHovered,
    isActive,
    timeRanOut,
    isSelected,
    shouldFadeOut,
    finalOpacity,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    getBackCardStyle,
    width,
    height,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    responsiveValues
  };
} 