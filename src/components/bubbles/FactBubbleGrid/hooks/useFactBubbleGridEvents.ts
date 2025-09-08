import { useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

interface UseFactBubbleGridEventsProps {
  bubbleGridRef: React.RefObject<HTMLDivElement | null>;
}

export const useFactBubbleGridEvents = ({ bubbleGridRef }: UseFactBubbleGridEventsProps) => {
  const { registerElement, unregisterElement } = useDOMRefs();
  
  useEffect(() => {
    if (bubbleGridRef.current) {
      registerElement('bubble-grid', bubbleGridRef.current);
    }
    return () => {
      unregisterElement('bubble-grid');
    };
  }, [registerElement, unregisterElement, bubbleGridRef]);

  return {
    // No return values needed for this events hook
  };
};