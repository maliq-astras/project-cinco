interface UseFinalFiveCardStylesProps {
  isGameOver: boolean;
  allCardsFlipped: boolean;
  selectedOption: string | null;
  frontBg: string;
  isCorrect?: boolean;
  isHovered: boolean;
  isActive: boolean;
  shouldFadeOut: boolean;
}

/**
 * Hook for generating FinalFiveCard styles
 * @param props Card state and configuration
 * @returns Style generation function
 */
export function useFinalFiveCardStyles({
  isGameOver,
  allCardsFlipped,
  selectedOption,
  frontBg,
  isCorrect = false,
  isHovered,
  isActive,
  shouldFadeOut
}: UseFinalFiveCardStylesProps) {

  const getBackCardStyle = (backBg: string, textColor: string): React.CSSProperties => {
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
      opacity: shouldFadeOut ? 0.4 : 1 
    };
    
    if (!isGameOver && allCardsFlipped && !selectedOption) {
      if (isActive) {
        return {
          ...baseStyle,
          transform: "rotateY(180deg) scale(0.95)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        };
      } else if (isHovered) {
        return {
          ...baseStyle,
          boxShadow: `0 8px 16px rgba(0,0,0,0.2), 0 0 8px ${frontBg}80`,
          transform: "rotateY(180deg) scale(1.03)",
          cursor: 'pointer',
          borderColor: `${frontBg}`
        };
      }
    }
    
    return baseStyle;
  };

  return {
    getBackCardStyle
  };
}