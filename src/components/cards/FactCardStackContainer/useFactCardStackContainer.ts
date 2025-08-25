import { useMemo, useState, useEffect, useRef, type CSSProperties } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useDragState } from '@/hooks/ui';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

/**
 * Hook for managing the container around the fact card stack
 */
export function useFactCardStackContainer() {
  // Access state from the store
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const challenge = useGameStore(state => state.gameState.challenge);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);

  // Use our new unified responsive system
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait,
    availableContentHeight
  } = useResponsive();
  
  const { isNarrowLayout } = require('@/helpers/breakpoints');
  const isDesktopLayout = !isNarrowLayout(width, height);

  const isDragging = useDragState(state => state.isDragging);
  const wasFactRevealed = useDragState(state => state.wasFactRevealed);
  const [isHidden, setIsHidden] = useState(false);
  
  // DOM refs for tutorial targeting
  const factsAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();

  // Register the facts area element with the DOM refs system
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
  }, [registerElement, unregisterElement]);

  // Calculate container styles using our responsive system
  const containerStyles = useMemo<CSSProperties>(() => {
    // Calculate optimal container height based on available space
    const calculateOptimalHeight = () => {
      // Reserve more space for other UI elements (header, bubbles, controls)
      const reservedSpace = isLandscape ? 450 : 400; // More space reserved in landscape
      const availableSpace = Math.max(0, height - reservedSpace);
      
      // Use a larger percentage of available space for the card stack
      const heightPercentage = isLandscape ? 0.3 : 0.35; // More space for cards
      const calculatedHeight = Math.max(availableSpace * heightPercentage, 150);
      
      // Set more conservative bounds
      const minHeight = 120;
      const maxHeight = isLandscape ? 200 : 250;
      
      return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
    };

    const optimalHeight = calculateOptimalHeight();

    // In desktop layout, fill the available space to match tutorial spotlight
    if (isDesktopLayout) {
      return {
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      };
    }
    
    return {
      height: `${optimalHeight}px`,
      minHeight: `${optimalHeight}px`,
      marginTop: `${responsiveValues.spacing * 5}px` // Increased spacing to push cards down
    };
  }, [height, isLandscape, responsiveValues, isDesktopLayout]);

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
    
    // State
    isHidden,
    
    // DOM refs
    factsAreaRef,
    containerRef,
    
    // Responsive values from our new system
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait,
    availableContentHeight
  };
} 