import { useEffect } from 'react';

interface UseCardStackEffectsProps {
  visibleCards: number[];
  prevVisibleCards: number[];
  setPrevVisibleCards: (cards: number[]) => void;
  setIsInitialRender: (isInitial: boolean) => void;
  setIsCardReturning: (isReturning: boolean) => void;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

/**
 * Hook for managing card stack side effects and animations
 * @param props Dependencies and state setters
 */
export function useCardStackEffects({
  visibleCards,
  prevVisibleCards,
  setPrevVisibleCards,
  setIsInitialRender,
  setIsCardReturning,
  cardRefs
}: UseCardStackEffectsProps) {
  
  // Handle new card appearance and card return animations
  useEffect(() => {
    // Check if this is a new card being added or removed
    const isNewCardAdded = visibleCards.length > prevVisibleCards.length;
    
    // Only set initial render to true for the first render or when a new card is added from a bubble
    if (prevVisibleCards.length === 0 || (isNewCardAdded && !prevVisibleCards.some(card => !visibleCards.includes(card)))) {
      setIsInitialRender(true);
      const timer = setTimeout(() => {
        setIsInitialRender(false);
      }, visibleCards.length * 100 + 500); // Wait for all cards to be dealt
      
      return () => clearTimeout(timer);
    }
    
    // Check if a card is returning to the stack (length is the same but order changed)
    if (visibleCards.length === prevVisibleCards.length && 
        JSON.stringify(visibleCards) !== JSON.stringify(prevVisibleCards)) {
      setIsCardReturning(true);
      const timer = setTimeout(() => {
        setIsCardReturning(false);
      }, 800); // Increased duration for the return animation
      
      return () => clearTimeout(timer);
    }
    
    // Update the previous revealed facts
    setPrevVisibleCards(visibleCards);
    
    // Ensure the refs array has the right length
    cardRefs.current = new Array(visibleCards.length).fill(null);
  }, [visibleCards, prevVisibleCards, setPrevVisibleCards, setIsInitialRender, setIsCardReturning, cardRefs]);
}