import { useState, useEffect, useMemo, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useCardAnimations } from '@/hooks/animation';
import { getFactIcon, useIconFilter } from '@/helpers/iconHelpers';
import { useDragState } from '@/hooks/ui';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { getFactBubblePositionFromElement } from '@/helpers/uiHelpers';
import { useResponsive } from '@/hooks/responsive';

// Internal custom hook for particle generation
function useParticles(count = 8) {
  return useMemo(() => 
    Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 50,
        y: Math.sin(angle) * 50,
        opacity: 0,
        scale: 0,
        rotate: Math.random() * 360
      };
    }), 
  [count]);
}

interface UseFactBubbleProps {
  factType: string;
  isRevealed: boolean;
  factIndex: number;
  category?: string;
  slotIndex?: number;
}

/**
 * Hook for managing FactBubble component state and logic
 */
export function useFactBubble({
  factType, 
  isRevealed, 
  factIndex,
  category = 'countries',
  slotIndex
}: UseFactBubbleProps) {
  // Store actions and state
  const revealFact = useGameStore(state => state.revealFact);
  const setHoveredFact = useGameStore(state => state.setHoveredFact);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const isPendingFinalFiveTransition = useGameStore(state => state.isPendingFinalFiveTransition);
  const { colors } = useTheme();
  const getFilter = useIconFilter();
  const setWasFactRevealed = useDragState(state => state.setWasFactRevealed);
  
  // Use our new unified responsive system
  const { 
    breakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  } = useResponsive();
  
  // DOM refs for tutorial targeting
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const { registerElement, unregisterElement, getElement } = useDOMRefs();

  // Register the bubble-0 element with the DOM refs system if this is at slot 0
  useEffect(() => {
    if (slotIndex === 0 && bubbleRef.current) {
      registerElement('bubble-0', bubbleRef.current);
    }
  }, [slotIndex, registerElement, factType, isRevealed]);
  
  // Use shared card animations
  const { colorStyle } = useCardAnimations({
    primaryColor: colors.primary
  });
  
  // Local state
  const [isPopping, setIsPopping] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [popPosition, setPopPosition] = useState({ x: 0, y: 0 });
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Constants
  const CARD_ANIMATION_DELAY = 900;
  const TOOLTIP_DURATION = 2000; // Tooltip will show for 2 seconds

  // Detect if we're on a touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Check if bubble is clickable
  const isClickable = useMemo(() => 
    (isRevealed || canRevealNewClue) && !isGameOver && !isFinalFiveActive && !showFinalFiveTransition && !isPendingFinalFiveTransition, 
  [isRevealed, canRevealNewClue, isGameOver, isFinalFiveActive, showFinalFiveTransition, isPendingFinalFiveTransition]);

  // Create particles for pop animation
  const particles = useParticles(8);

  // Handle drag start
  const handleDragStart = () => {
    if (isClickable) {
      // Show category name during drag by setting hovered fact
      setHoveredFact(factIndex);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: any, info: any) => {
    // Clear hovered fact when drag ends
    setHoveredFact(null);
    
    if (isRevealed || isPopping || !isClickable) return;

    // Get the card area element using DOM refs provider
    const cardArea = getElement('fact-card-stack-container');
    if (!cardArea) return;

    const cardRect = cardArea.getBoundingClientRect();
    
    // Check if the bubble was dropped within the card area
    const isOverCardArea = 
      info.point.x >= cardRect.left &&
      info.point.x <= cardRect.right &&
      info.point.y >= cardRect.top &&
      info.point.y <= cardRect.bottom;

    if (isOverCardArea) {
      // Set the pop position to where the bubble was dropped
      setPopPosition({ x: info.point.x, y: info.point.y });
      
      // Start pop animation
      setIsPopping(true);
      
      // Mark that a fact was revealed
      setWasFactRevealed(true);
      
      // Trigger reveal after animation completes
      setTimeout(() => {
        const position = getFactBubblePositionFromElement(bubbleRef.current);
        revealFact(factIndex, position);
      }, CARD_ANIMATION_DELAY);
    } else {
      // No fact was revealed on this drag
      setWasFactRevealed(false);
    }
  };

  // Handle tap/click for touch devices
  const handleTap = () => {
    if (!isTouchDevice || !isClickable) return;
    
    // Clear any existing timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    
    // If already showing, hide the tooltip
    if (isShowingTooltip) {
      setIsShowingTooltip(false);
      setHoveredFact(null);
      return;
    }
    
    // Show tooltip by setting the hovered fact in the global state
    setIsShowingTooltip(true);
    setHoveredFact(factIndex);
    
    // Set a timeout to hide the tooltip after a few seconds
    const timeout = setTimeout(() => {
      setIsShowingTooltip(false);
      setHoveredFact(null);
    }, TOOLTIP_DURATION);
    
    setTooltipTimeout(timeout);
  };
  
  // Clean up timeout when component unmounts
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  // Calculate responsive icon size using our new responsive system
  const icon = useMemo(() => {
    // Use responsive values for bubble size and calculate icon size
    const bubbleSize = responsiveValues.bubbleSize;    
    
    const iconSize = Math.max(28, Math.round(bubbleSize));
    
    return getFactIcon(factType, false, iconSize, category);
  }, [factType, category, responsiveValues.bubbleSize, breakpoint]);

  // Get contextual tooltip text
  const tooltipText = useMemo(() => {
    if (isRevealed) return "Click to view this fact again";
    if (!hasSeenClue) {
      return isTouchDevice 
        ? "Drag to reveal" 
        : "Drag to reveal your first fact";
    }
    if (!canRevealNewClue) return "Make a guess before revealing a new fact";
    return isTouchDevice 
      ? `Drag to reveal ${factType}` 
      : `Drag to reveal ${factType} fact`;
  }, [isRevealed, hasSeenClue, canRevealNewClue, isTouchDevice, factType]);

  // Animation properties
  const bubbleAnimation = useMemo(() => ({
    scale: [1, 1.2, 0],
    opacity: [1, 1, 0],
    x: popPosition.x,
    y: popPosition.y,
    transition: {
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1]
    }
  }), [popPosition]);

  // Mouse interaction handlers
  const mouseHandlers = useMemo(() => ({
    onMouseEnter: () => !isTouchDevice && isClickable && setHoveredFact(factIndex),
    onMouseLeave: () => !isTouchDevice && setHoveredFact(null),
    onClick: handleTap
  }), [isTouchDevice, isClickable, factIndex, setHoveredFact, handleTap]);

  return {
    isPopping,
    isTouchDevice,
    isClickable,
    tooltipText,
    icon,
    particles,
    colors,
    colorStyle,
    bubbleAnimation,
    handleDragStart,
    handleDragEnd,
    mouseHandlers,
    getIconFilter: getFilter,
    popPosition,
    bubbleRef,
    
    // Responsive values from our new system
    breakpoint,
    isLandscape,
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  };
} 