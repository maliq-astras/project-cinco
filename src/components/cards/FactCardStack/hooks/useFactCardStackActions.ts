import { useCallback } from 'react';

interface UseFactCardStackActionsProps {
  canRevealNewClue: boolean;
  revealedFacts: number[];
  handleCardClick: (factIndex: number, sourcePosition: { x: number, y: number }) => void;
}

/**
 * Hook for handling FactCardStack actions and click logic
 * @param props Dependencies and action handlers
 * @returns Action functions
 */
export function useFactCardStackActions({
  canRevealNewClue,
  revealedFacts,
  handleCardClick
}: UseFactCardStackActionsProps) {

  const onCardClicked = useCallback((factIndex: number, cardIndex: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (!canRevealNewClue && !revealedFacts.includes(factIndex)) return;
    
    // NOTE: Direct DOM query is necessary here due to React ref timing issues
    // The DOM refs are registered in useEffect, but the click handler needs immediate access
    // to the card position. This ensures we get the correct source position for animations.
    const cardElement = document.querySelector(`[data-card-index=\"${cardIndex}\"]`);
    
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      
      const sourcePosition = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      
      handleCardClick(factIndex, sourcePosition);
    } else {
      handleCardClick(factIndex, { 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
      });
    }
  }, [canRevealNewClue, revealedFacts, handleCardClick]);

  const isCardClickable = useCallback((factIndex: number) => {
    return canRevealNewClue || revealedFacts.includes(factIndex);
  }, [canRevealNewClue, revealedFacts]);

  return {
    onCardClicked,
    isCardClickable
  };
}