import { useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

interface UseGameButtonsEventsProps {
  controlsRef: React.RefObject<HTMLDivElement | null>;
}

export const useGameButtonsEvents = ({ controlsRef }: UseGameButtonsEventsProps) => {
  const { registerElement, unregisterElement } = useDOMRefs();

  useEffect(() => {
    if (controlsRef.current) {
      registerElement('game-controls-right', controlsRef.current);
    }
    
    return () => {
      unregisterElement('game-controls-right');
    };
  }, [registerElement, unregisterElement, controlsRef]);
};