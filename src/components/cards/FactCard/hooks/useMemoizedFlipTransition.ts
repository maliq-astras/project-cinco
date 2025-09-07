import { useMemo } from 'react';

interface FlipOptions {
  /**
   * Stiffness of the spring animation (higher = more springy)
   * Default: 70
   */
  stiffness?: number;
  
  /**
   * Damping of the spring animation (higher = less oscillation)
   * Default: 15
   */
  damping?: number;
  
  /**
   * Duration of the flip animation in seconds
   * Default: 0.9
   */
  duration?: number;
}

/**
 * Custom hook to create memoized flip transition settings for card animations
 * Prevents unnecessary re-renders when animation settings don't change
 */
export function useMemoizedFlipTransition({
  stiffness = 70,
  damping = 15,
  duration = 0.9
}: FlipOptions = {}) {
  // Memoize the transition settings to prevent unnecessary re-renders
  const flipTransition = useMemo(() => ({
    type: "spring" as const,
    stiffness,
    damping,
    duration
  }), [stiffness, damping, duration]);

  return flipTransition;
} 