import { useMemo, useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useDragState } from '@/hooks/useDragState';

/**
 * Hook for managing the container around the fact card stack
 */
export function useFactCardStackContainer() {
  // Access state from the store
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const challenge = useGameStore(state => state.gameState.challenge);
  const windowWidth = useGameStore(state => state.windowWidth);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const { colors } = useTheme();
  const isDragging = useDragState(state => state.isDragging);
  const wasFactRevealed = useDragState(state => state.wasFactRevealed);
  const [isHidden, setIsHidden] = useState(false);

  // Calculate the appropriate height based on screen size
  const getResponsiveHeight = () => {
    // iPhone-specific height
    if (windowWidth >= 375 && windowWidth <= 430) return 150;
    
    if (windowWidth < 360) return 140; // Extra small devices
    if (windowWidth < 480) return 150; // Small devices
    if (windowWidth < 640) return 170; // Medium devices
    if (windowWidth < 768) return 180; // Medium-large devices
    return 220; // Large devices
  };

  // Calculate container styles
  const containerStyles = useMemo(() => ({
    height: `${getResponsiveHeight()}px`
  }), [windowWidth]);

  // Handle delayed showing of cards
  useEffect(() => {
    if (isDragging) {
      setIsHidden(true);
    } else {
      // Add a delay before showing the cards again
      // Use a longer delay if a fact was revealed to allow for pop animation
      const delay = wasFactRevealed ? 2500 : 300;
      const timer = setTimeout(() => {
        setIsHidden(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isDragging, wasFactRevealed]);

  // Determine if placeholder should be shown
  const shouldShowPlaceholder = revealedFacts.length === 0 && !isVictoryAnimationActive;
  
  // Calculate transition class for card stack visibility
  const cardStackVisibilityClass = revealedFacts.length === 0 
    ? 'opacity-0' 
    : 'opacity-100 transition-opacity duration-500';

  return {
    // State and conditions
    revealedFacts,
    challenge,
    isFinalFiveActive,
    isVictoryAnimationActive,
    shouldShowPlaceholder,
    
    // Styling
    containerStyles,
    cardStackVisibilityClass,
    
    // Theme
    colors,
    isHidden
  };
} 