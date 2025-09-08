import { useEffect } from 'react';

interface UseFactCardStackContainerEffectsProps {
  factsAreaRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isDragging: boolean;
  wasFactRevealed: boolean;
  registerElement: (key: string, element: HTMLElement) => void;
  unregisterElement: (key: string) => void;
  setIsHidden: (hidden: boolean) => void;
}

/**
 * Hook for managing FactCardStackContainer side effects
 * @param props Dependencies and state setters
 */
export function useFactCardStackContainerEffects({
  factsAreaRef,
  containerRef,
  isDragging,
  wasFactRevealed,
  registerElement,
  unregisterElement,
  setIsHidden
}: UseFactCardStackContainerEffectsProps) {

  // DOM element registration
  useEffect(() => {
    if (factsAreaRef.current) {
      registerElement('facts-area', factsAreaRef.current);
    }
    
    if (containerRef.current) {
      registerElement('fact-card-stack-container', containerRef.current);
    }
    
    return () => {
      unregisterElement('facts-area');
      unregisterElement('fact-card-stack-container');
    };
  }, [registerElement, unregisterElement, factsAreaRef, containerRef]);

  // Drag state visibility management
  useEffect(() => {
    if (isDragging) {
      setIsHidden(true);
    } else {
      const delay = wasFactRevealed ? 2500 : 300;
      const timer = setTimeout(() => {
        setIsHidden(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isDragging, wasFactRevealed, setIsHidden]);
}