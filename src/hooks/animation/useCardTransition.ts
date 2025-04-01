import { useMemo } from 'react';

interface CardTransitionProps {
  /**
   * Whether the card is being drawn from a source position
   */
  isDrawingFromSource: boolean;
  
  /**
   * Whether the card is being returned to a position
   */
  isReturning: boolean;
  
  /**
   * Custom duration for the transition
   * Default: 0.7 for drawing/returning, 0.3 for appearing
   */
  customDuration?: number;
  
  /**
   * Easing function for the transition
   * Default: "easeInOut"
   */
  ease?: string;
}

/**
 * Hook that provides optimized card transition settings
 */
export function useCardTransition({
  isDrawingFromSource,
  isReturning,
  customDuration,
  ease = "easeInOut"
}: CardTransitionProps) {
  // Calculate base duration based on animation type
  const baseDuration = isDrawingFromSource || isReturning ? 0.7 : 0.3;
  
  // Use custom duration if provided, otherwise use calculated base duration
  const duration = customDuration ?? baseDuration;
  
  // Memoize transition settings to prevent unnecessary re-renders
  const cardTransition = useMemo(() => ({
    duration,
    ease: ease as any
  }), [duration, ease]);
  
  return cardTransition;
} 