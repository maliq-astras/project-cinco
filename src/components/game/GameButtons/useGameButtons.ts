import { useRef, useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

export const useGameButtons = () => {
  const controlsRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();

  // Register the controls element with the DOM refs system
  useEffect(() => {
    if (controlsRef.current) {
      registerElement('game-controls-right', controlsRef.current);
    }
    
    return () => {
      unregisterElement('game-controls-right');
    };
  }, [registerElement, unregisterElement]);

  // Animation configurations
  const buttonAnimation = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
    initial: { scale: 0.95 }
  };

  const disabledButtonAnimation = {
    initial: { scale: 0.95 }
  };

  const tooltipAnimation = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 }
  };

  return {
    controlsRef,
    buttonAnimation,
    disabledButtonAnimation,
    tooltipAnimation
  };
};
