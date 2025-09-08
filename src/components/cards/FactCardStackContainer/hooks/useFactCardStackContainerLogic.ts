import { useMemo, useState, useEffect, useRef, type CSSProperties } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useDragState } from '@/hooks/ui';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { isMobileLayout } from '@/constants/breakpoints';

export function useFactCardStackContainer() {
  const revealedFacts = useGameStore(state => state.gameState.revealedFacts);
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);

  const { 
    responsiveValues,
    width,
    height,
    isLandscape
  } = useResponsive();
  
  const isDesktopLayout = !isMobileLayout(width, height);

  const isDragging = useDragState(state => state.isDragging);
  const wasFactRevealed = useDragState(state => state.wasFactRevealed);
  const [isHidden, setIsHidden] = useState(false);
  
  const factsAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();

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

  const containerStyles = useMemo<CSSProperties>(() => {
    const calculateOptimalHeight = () => {
      const reservedSpace = isLandscape ? 450 : 400;
      const availableSpace = Math.max(0, height - reservedSpace);
      const heightPercentage = isLandscape ? 0.3 : 0.35;
      const calculatedHeight = Math.max(availableSpace * heightPercentage, 150);
      const minHeight = 120;
      const maxHeight = isLandscape ? 200 : 250;
      return Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
    };

    const optimalHeight = calculateOptimalHeight();

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
      marginTop: `${responsiveValues.spacing * 5}px`
    };
  }, [height, isLandscape, responsiveValues, isDesktopLayout]);

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
  }, [isDragging, wasFactRevealed]);

  const shouldShowPlaceholder = revealedFacts.length === 0 && !isVictoryAnimationActive;
  
  const cardStackVisibilityClass = revealedFacts.length === 0 
    ? 'opacity-0' 
    : 'opacity-100 transition-opacity duration-500';

  return {
    shouldShowPlaceholder,
    containerStyles,
    cardStackVisibilityClass,
    isHidden,
    factsAreaRef,
    containerRef,
    responsiveValues
  };
} 