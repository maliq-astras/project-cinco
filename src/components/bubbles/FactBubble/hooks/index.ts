import { useFactBubbleState } from './useFactBubbleState';
import { useFactBubbleEvents } from './useFactBubbleEvents';
import { useFactBubbleLogic } from './useFactBubbleLogic';
import { useParticles } from './useParticles';

interface UseFactBubbleProps {
  factType: string;
  isRevealed: boolean;
  factIndex: number;
  category?: string;
  slotIndex?: number;
}

export const useFactBubble = ({
  factType, 
  isRevealed, 
  factIndex,
  category = 'countries',
  slotIndex
}: UseFactBubbleProps) => {
  const state = useFactBubbleState();
  
  const logic = useFactBubbleLogic({
    factType,
    isRevealed,
    category,
    slotIndex,
    bubbleRef: state.bubbleRef,
    popPosition: state.popPosition,
    setIsTouchDevice: state.setIsTouchDevice
  });
  
  const events = useFactBubbleEvents({
    factIndex,
    isClickable: logic.isClickable,
    isRevealed,
    isPopping: state.isPopping,
    isTouchDevice: state.isTouchDevice,
    isShowingTooltip: state.isShowingTooltip,
    tooltipTimeout: state.tooltipTimeout,
    bubbleRef: state.bubbleRef,
    setIsPopping: state.setIsPopping,
    setPopPosition: state.setPopPosition,
    setIsShowingTooltip: state.setIsShowingTooltip,
    setTooltipTimeout: state.setTooltipTimeout
  });
  
  const particles = useParticles(8);

  return {
    // State
    isPopping: state.isPopping,
    popPosition: state.popPosition,
    bubbleRef: state.bubbleRef,
    
    // Logic
    isClickable: logic.isClickable,
    icon: logic.icon,
    colors: logic.colors,
    bubbleAnimation: logic.bubbleAnimation,
    getIconFilter: logic.getIconFilter,
    responsiveValues: logic.responsiveValues,
    
    // Events
    handleDragStart: events.handleDragStart,
    handleDragEnd: events.handleDragEnd,
    mouseHandlers: events.mouseHandlers,
    
    // Additional
    particles
  };
};