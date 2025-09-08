import { useState, useRef } from 'react';

/**
 * Hook for managing FactCardStackContainer component state
 * @returns State values and setters
 */
export function useFactCardStackContainerState() {
  const [isHidden, setIsHidden] = useState(false);
  const factsAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return {
    isHidden,
    setIsHidden,
    factsAreaRef,
    containerRef
  };
}