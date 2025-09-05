import { useState, useEffect, useMemo, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { getFactIcon, useIconFilter } from '@/helpers/iconHelpers';
import { useDragState } from '@/hooks/ui';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { getFactBubblePositionFromElement } from '@/helpers/uiHelpers';
import { useResponsive } from '@/hooks/responsive';

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

export function useFactBubble({
  factType, 
  isRevealed, 
  factIndex,
  category = 'countries',
  slotIndex
}: UseFactBubbleProps) {
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
  const { responsiveValues } = useResponsive();
  
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const { registerElement, getElement } = useDOMRefs();

  useEffect(() => {
    if (slotIndex === 0 && bubbleRef.current) {
      registerElement('bubble-0', bubbleRef.current);
    }
  }, [slotIndex, registerElement, factType, isRevealed]);
  
  const [isPopping, setIsPopping] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [popPosition, setPopPosition] = useState({ x: 0, y: 0 });
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const CARD_ANIMATION_DELAY = 900;
  const TOOLTIP_DURATION = 2000;

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const isClickable = useMemo(() => 
    (isRevealed || canRevealNewClue) && !isGameOver && !isFinalFiveActive && !showFinalFiveTransition && !isPendingFinalFiveTransition, 
  [isRevealed, canRevealNewClue, isGameOver, isFinalFiveActive, showFinalFiveTransition, isPendingFinalFiveTransition]);

  const particles = useParticles(8);

  const handleDragStart = () => {
    if (isClickable) {
      setHoveredFact(factIndex);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    setHoveredFact(null);
    
    if (isRevealed || isPopping || !isClickable) return;

    const cardArea = getElement('fact-card-stack-container');
    if (!cardArea) return;

    const cardRect = cardArea.getBoundingClientRect();
    
    const isOverCardArea = 
      info.point.x >= cardRect.left &&
      info.point.x <= cardRect.right &&
      info.point.y >= cardRect.top &&
      info.point.y <= cardRect.bottom;

    if (isOverCardArea) {
      setPopPosition({ x: info.point.x, y: info.point.y });
      setIsPopping(true);
      setWasFactRevealed(true);
      
      setTimeout(() => {
        const position = getFactBubblePositionFromElement(bubbleRef.current);
        revealFact(factIndex, position);
      }, CARD_ANIMATION_DELAY);
    } else {
      setWasFactRevealed(false);
    }
  };

  const handleTap = () => {
    if (!isTouchDevice || !isClickable) return;
    
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    
    if (isShowingTooltip) {
      setIsShowingTooltip(false);
      setHoveredFact(null);
      return;
    }
    
    setIsShowingTooltip(true);
    setHoveredFact(factIndex);
    
    const timeout = setTimeout(() => {
      setIsShowingTooltip(false);
      setHoveredFact(null);
    }, TOOLTIP_DURATION);
    
    setTooltipTimeout(timeout);
  };
  
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  const icon = useMemo(() => {
    const bubbleSize = responsiveValues.bubbleSize;    
    const iconSize = Math.max(28, Math.round(bubbleSize * 0.6));
    
    return getFactIcon(factType, false, iconSize, category);
  }, [factType, category, responsiveValues.bubbleSize]);

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

  const mouseHandlers = useMemo(() => ({
    onMouseEnter: () => !isTouchDevice && isClickable && setHoveredFact(factIndex),
    onMouseLeave: () => !isTouchDevice && setHoveredFact(null),
    onClick: handleTap
  }), [isTouchDevice, isClickable, factIndex, setHoveredFact, handleTap]);

  return {
    isPopping,
    isClickable,
    icon,
    particles,
    colors,
    bubbleAnimation,
    handleDragStart,
    handleDragEnd,
    mouseHandlers,
    getIconFilter: getFilter,
    popPosition,
    bubbleRef,
    responsiveValues
  };
} 