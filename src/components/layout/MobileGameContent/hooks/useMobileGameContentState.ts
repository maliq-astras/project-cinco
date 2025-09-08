import { useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDragState } from '@/hooks/ui/useDragState';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

export const useMobileGameContentState = () => {
  const { colors } = useTheme();
  const isDragging = useDragState(state => state.isDragging);
  const { registerElement, unregisterElement } = useDOMRefs();
  const dropZoneRef = useRef<HTMLDivElement>(null);

  return {
    colors,
    isDragging,
    registerElement,
    unregisterElement,
    dropZoneRef
  };
};