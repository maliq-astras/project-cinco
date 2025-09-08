import { useState } from 'react';

/**
 * Hook for managing FinalFiveCard component state
 * @returns State values and setters
 */
export function useFinalFiveCardState() {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return {
    isHovered,
    setIsHovered,
    isActive,
    setIsActive
  };
}