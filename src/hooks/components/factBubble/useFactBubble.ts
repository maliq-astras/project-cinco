import { useState, useRef, useEffect, useMemo } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { getFactIcon, useIconFilter } from '../../../helpers/iconHelpers';
import { useTheme } from '../../../context/ThemeContext';
import { useCardAnimations } from '../../animation';

// Internal custom hook for double tap/click detection
function useDoubleInteraction(
  onDoubleInteraction: () => void, 
  dependencies: any[] = []
) {
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);
  const DOUBLE_CLICK_TIMEOUT = 300;
  
  const handleInteraction = useEffect(() => {
    return () => {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    };
  }, []);
  
  const triggerInteraction = () => {
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // First interaction - start timer
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, DOUBLE_CLICK_TIMEOUT);
    } else if (clickCountRef.current === 2) {
      // Double interaction detected
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      
      onDoubleInteraction();
      clickCountRef.current = 0;
    }
  };
  
  return triggerInteraction;
}

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
}

/**
 * Hook for managing FactBubble component state and logic
 */
export function useFactBubble({
  factType, 
  isRevealed, 
  factIndex,
  category = 'countries'
}: UseFactBubbleProps) {
  // Store actions and state
  const revealFact = useGameStore(state => state.revealFact);
  const setHoveredFact = useGameStore(state => state.setHoveredFact);
  const canRevealNewClue = useGameStore(state => state.canRevealNewClue);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const windowWidth = useGameStore(state => state.windowWidth);
  const { colors } = useTheme();
  const getFilter = useIconFilter();
  
  // Use shared card animations
  const { colorStyle } = useCardAnimations({
    primaryColor: colors.primary
  });
  
  // Local state
  const [isPopping, setIsPopping] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Refs for touch handling
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Constants
  const TOUCH_CONTEXT_TIMEOUT = 500;
  const CARD_ANIMATION_DELAY = 900;

  // Detect if we're on a touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Clean up timers on unmount
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  // Check if bubble is clickable
  const isClickable = useMemo(() => 
    isRevealed || canRevealNewClue, 
  [isRevealed, canRevealNewClue]);

  // Create particles for pop animation
  const particles = useParticles(8);

  // Handle double interaction (click or tap)
  const handleDoubleInteraction = () => {
    if (isRevealed || isPopping || !isClickable) return;
    
    // Start pop animation
    setIsPopping(true);
    
    // Trigger reveal after animation completes
    setTimeout(() => {
      revealFact(factIndex);
    }, CARD_ANIMATION_DELAY);
  };
  
  const handleInteraction = useDoubleInteraction(handleDoubleInteraction);

  // Handle touch start (for mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRevealed || isPopping || !isClickable) return;
    
    // Prevent zooming on multi-touch
    if (e.touches.length > 1) e.preventDefault();
    
    // Show context on single tap
    setHoveredFact(factIndex);
    setIsTouched(true);
    
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
  };
  
  // Handle touch end (for mobile)
  const handleTouchEnd = () => {
    if (isRevealed || isPopping || !isClickable) return;
    
    // Start double-tap detection
    handleInteraction();
    
    // Keep context visible briefly
    touchTimerRef.current = setTimeout(() => {
      setHoveredFact(null);
      setIsTouched(false);
    }, TOUCH_CONTEXT_TIMEOUT);
  };

  // Calculate responsive icon size
  const icon = useMemo(() => {
    const sizeMultiplier = windowWidth < 480 ? 0.5 : windowWidth < 768 ? 0.55 : 0.6;
    const containerSize = windowWidth < 640 ? 65 : 80;
    const iconSize = Math.max(28, Math.round(containerSize * sizeMultiplier));
    
    return getFactIcon(factType, false, iconSize, category);
  }, [factType, category, windowWidth]);

  // Get contextual tooltip text
  const tooltipText = useMemo(() => {
    if (isRevealed) return "Click to view this fact again";
    if (!hasSeenClue) {
      return isTouchDevice 
        ? "Tap to preview, double-tap to reveal" 
        : "Double-click to reveal your first fact";
    }
    if (!canRevealNewClue) return "Make a guess before revealing a new fact";
    return isTouchDevice 
      ? `Tap to preview, double-tap to reveal ${factType}` 
      : `Double-click to reveal ${factType} fact`;
  }, [isRevealed, hasSeenClue, canRevealNewClue, isTouchDevice, factType]);

  // Animation properties
  const bubbleAnimation = useMemo(() => ({
    scale: isPopping ? [1, 1.2, 0] : 1,
    opacity: isPopping ? [1, 1, 0] : 1,
    transition: {
      duration: isPopping ? 0.5 : 0.2,
      ease: isPopping ? [0.42, 0, 0.58, 1] : [0.4, 0, 0.2, 1]
    }
  }), [isPopping]);

  // Mouse interaction handlers
  const mouseHandlers = useMemo(() => ({
    onMouseEnter: () => !isTouchDevice && isClickable && setHoveredFact(factIndex),
    onMouseLeave: () => !isTouchDevice && setHoveredFact(null)
  }), [isTouchDevice, isClickable, factIndex, setHoveredFact]);

  return {
    isPopping,
    isTouched,
    isTouchDevice,
    isClickable,
    tooltipText,
    icon,
    particles,
    colors,
    colorStyle,
    bubbleAnimation,
    handleInteraction,
    handleTouchStart,
    handleTouchEnd,
    mouseHandlers,
    getIconFilter: getFilter
  };
} 