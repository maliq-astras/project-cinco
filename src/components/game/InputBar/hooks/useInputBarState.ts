import { useRef, useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

export const useInputBarState = () => {
  const { responsiveValues } = useResponsive();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaShellRef = useRef<HTMLDivElement>(null);
  const { registerElement, unregisterElement } = useDOMRefs();
  
  // Register elements with the DOM refs system
  useEffect(() => {
    if (inputRef.current) {
      registerElement('game-input', inputRef.current);
    }
    
    return () => {
      unregisterElement('game-input');
    };
  }, [registerElement, unregisterElement]);

  useEffect(() => {
    if (progressRef.current) {
      registerElement('game-progress', progressRef.current);
    }
    
    return () => {
      unregisterElement('game-progress');
    };
  }, [registerElement, unregisterElement]);

  return {
    inputRef,
    progressRef,
    formRef,
    textareaShellRef,
    responsiveValues
  };
};