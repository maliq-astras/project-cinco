import { useEffect, useMemo, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useDragState } from '@/hooks/ui';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { getFactBubblePositionFromElement } from '@/helpers/uiHelpers';

interface UseFactBubbleEventsProps {
  factIndex: number;
  isClickable: boolean;
  isRevealed: boolean;
  isPopping: boolean;
  isTouchDevice: boolean;
  isShowingTooltip: boolean;
  tooltipTimeout: NodeJS.Timeout | null;
  bubbleRef: React.RefObject<HTMLButtonElement | null>;
  setIsPopping: (value: boolean) => void;
  setPopPosition: (position: { x: number; y: number }) => void;
  setIsShowingTooltip: (value: boolean) => void;
  setTooltipTimeout: (timeout: NodeJS.Timeout | null) => void;
}

const CARD_ANIMATION_DELAY = 900;
const TOOLTIP_DURATION = 2000;

export const useFactBubbleEvents = ({
  factIndex,
  isClickable,
  isRevealed,
  isPopping,
  isTouchDevice,
  isShowingTooltip,
  tooltipTimeout,
  bubbleRef,
  setIsPopping,
  setPopPosition,
  setIsShowingTooltip,
  setTooltipTimeout
}: UseFactBubbleEventsProps) => {
  const revealFact = useGameStore(state => state.revealFact);
  const setHoveredFact = useGameStore(state => state.setHoveredFact);
  const setWasFactRevealed = useDragState(state => state.setWasFactRevealed);
  const { getElement } = useDOMRefs();

  const handleDragStart = () => {
    if (isClickable) {
      setHoveredFact(factIndex);
    }
  };

  const handleDragEnd = (event: unknown, info: { point: { x: number; y: number } }) => {
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

  const handleTap = useCallback(() => {
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
  }, [isTouchDevice, isClickable, tooltipTimeout, isShowingTooltip, factIndex, setHoveredFact, setIsShowingTooltip, setTooltipTimeout]);
  
  useEffect(() => {
    return () => {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
      }
    };
  }, [tooltipTimeout]);

  const mouseHandlers = useMemo(() => ({
    onMouseEnter: () => !isTouchDevice && isClickable && setHoveredFact(factIndex),
    onMouseLeave: () => !isTouchDevice && setHoveredFact(null),
    onClick: handleTap
  }), [isTouchDevice, isClickable, factIndex, setHoveredFact, handleTap]);

  return {
    handleDragStart,
    handleDragEnd,
    mouseHandlers
  };
};