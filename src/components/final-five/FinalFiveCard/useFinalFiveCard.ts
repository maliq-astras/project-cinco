import { useState } from 'react';
import { finalFiveCardStyles } from './FinalFiveCard.styles';

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
}

export function useFinalFiveCard({
  isGameOver,
  allCardsFlipped,
  selectedOption,
  option,
  frontBg,
  isCorrect = false
}: UseFinalFiveCardProps): UseFinalFiveCardReturn {
  // Local state for interaction
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  // Check if time ran out - happens when game is over but no option was selected
  const timeRanOut = isGameOver && !selectedOption;
  
  // Check if this card is selected or should be faded
  const isSelected = selectedOption === option;
  const shouldFadeOut = (selectedOption !== null && !isSelected) || timeRanOut;
  
  // Determine final visibility
  // - Selected options stay visible to show result (highlighted or X)
  // - Non-selected options fade out permanently
  // - All options fade out when time runs out
  const finalOpacity = shouldFadeOut ? 0 : 1;

  // Event handlers
  const handleMouseDown = () => {
    if (!isGameOver && allCardsFlipped && !selectedOption) {
      setIsActive(true);
    }
  };

  const handleMouseUp = () => {
    if (!isGameOver && allCardsFlipped && !selectedOption) {
      setIsActive(false);
    }
  };

  const handleMouseEnter = () => {
    if (!isGameOver && allCardsFlipped && !selectedOption) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isGameOver && allCardsFlipped && !selectedOption) {
      setIsHovered(false);
      setIsActive(false);
    }
  };
  
  // Get the appropriate back card style
  const getBackCardStyle = (backBg: string, textColor: string): React.CSSProperties => {
    // Base styles
    const baseStyle = {
      backgroundColor: backBg,
      color: textColor,
      borderColor: frontBg,
      backfaceVisibility: "hidden" as const,
      WebkitBackfaceVisibility: "hidden" as const,
      boxShadow: isGameOver && isCorrect 
        ? `0 0 15px ${frontBg}80`
        : "0 4px 8px rgba(0,0,0,0.1)",
      padding: "0.5rem",
      transition: "transform 0.2s, box-shadow 0.3s, border-color 0.2s, opacity 0.3s",
      cursor: (!isGameOver && allCardsFlipped && !selectedOption) ? "pointer" : "default",
      transform: "rotateY(180deg)",
      WebkitTransform: "rotateY(180deg)",
      opacity: shouldFadeOut ? 0.4 : 1 // Initial fade for animation smoothness
    };
    
    // Add interactive styles only if not game over and all cards flipped and no selection yet
    if (!isGameOver && allCardsFlipped && !selectedOption) {
      if (isActive) {
        return {
          ...baseStyle,
          ...finalFiveCardStyles.interactive.active
        };
      } else if (isHovered) {
        const hoverStyles = finalFiveCardStyles.interactive.hover(frontBg);
        return {
          ...baseStyle,
          ...hoverStyles
        };
      }
    }
    
    return baseStyle;
  };

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
    getBackCardStyle
  };
} 