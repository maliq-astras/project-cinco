import { useRef } from 'react';
import { useDragState } from '@/hooks/ui/useDragState';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';

export const useGameContentState = () => {
  const { colors } = useTheme();
  const isDragging = useDragState(state => state.isDragging);
  const isTutorialOpen = useGameStore(state => state.isTutorialOpen);
  const { registerElement, unregisterElement } = useDOMRefs();
  const { responsiveValues } = useResponsive();
  const dropZoneRef = useRef<HTMLDivElement>(null);

  return {
    colors,
    isDragging,
    isTutorialOpen,
    registerElement,
    unregisterElement,
    responsiveValues,
    dropZoneRef
  };
};