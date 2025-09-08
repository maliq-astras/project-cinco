interface UseFinalFiveCardEventsProps {
  isGameOver: boolean;
  allCardsFlipped: boolean;
  selectedOption: string | null;
  setIsHovered: (hovered: boolean) => void;
  setIsActive: (active: boolean) => void;
}

/**
 * Hook for handling FinalFiveCard mouse events
 * @param props Dependencies and state setters
 * @returns Event handlers
 */
export function useFinalFiveCardEvents({
  isGameOver,
  allCardsFlipped,
  selectedOption,
  setIsHovered,
  setIsActive
}: UseFinalFiveCardEventsProps) {

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

  return {
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave
  };
}