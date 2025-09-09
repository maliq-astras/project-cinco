import { useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

export const useTimerState = () => {
  const isVictoryAnimationActive = useGameStore(state => state.isVictoryAnimationActive);
  const timerRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();

  // Register the timer element with the DOM refs system
  useEffect(() => {
    if (timerRef.current) {
      registerElement('game-timer', timerRef.current);
    }
    
    return () => {
      unregisterElement('game-timer');
    };
  }, [registerElement, unregisterElement]);

  return {
    isVictoryAnimationActive,
    timerRef
  };
};