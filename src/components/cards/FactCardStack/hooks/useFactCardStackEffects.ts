import { useEffect } from 'react';

interface UseFactCardStackEffectsProps {
  stackRef: React.RefObject<HTMLDivElement | null>;
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  registerElement: (key: string, element: HTMLElement) => void;
  unregisterElement: (key: string) => void;
}

/**
 * Hook for managing FactCardStack DOM registration effects
 * @param props Dependencies and DOM functions
 */
export function useFactCardStackEffects({
  stackRef,
  cardRefs,
  registerElement,
  unregisterElement
}: UseFactCardStackEffectsProps) {
  
  useEffect(() => {
    if (stackRef.current) {
      registerElement('card-stack-container', stackRef.current);
    }
    
    if (cardRefs.current.length > 0) {
      const lastIndex = cardRefs.current.length - 1;
      const rightmostCard = cardRefs.current[lastIndex];
      if (rightmostCard) {
        registerElement('rightmost-card', rightmostCard);
      }
    }
    
    return () => {
      unregisterElement('card-stack-container');
      unregisterElement('rightmost-card');
    };
  }, [stackRef, cardRefs, registerElement, unregisterElement]);
}