import { useGameStore } from '@/store/gameStore';
import { useDragState } from '@/hooks/ui';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { isMobileLayout } from '@/constants/breakpoints';
import { useFactCardStackContainerState } from './useFactCardStackContainerState';
import { useFactCardStackContainerEffects } from './useFactCardStackContainerEffects';
import { useFactCardStackContainerStyles } from './useFactCardStackContainerStyles';

export function useFactCardStackContainer() {
  // External dependencies
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
  const { registerElement, unregisterElement } = useDOMRefs();

  // Component state
  const {
    isHidden,
    setIsHidden,
    factsAreaRef,
    containerRef
  } = useFactCardStackContainerState();

  // Styles
  const { containerStyles } = useFactCardStackContainerStyles({
    height,
    isLandscape,
    responsiveValues,
    isDesktopLayout
  });

  // Side effects
  useFactCardStackContainerEffects({
    factsAreaRef,
    containerRef,
    isDragging,
    wasFactRevealed,
    registerElement,
    unregisterElement,
    setIsHidden
  });

  // Computed values
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