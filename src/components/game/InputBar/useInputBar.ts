import { useRef, useImperativeHandle, Ref, useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

export interface InputBarHandle {
  focusInput: () => void;
}

interface UseInputBarProps {
  ref: Ref<InputBarHandle>;
  setInputValue: (value: string) => void;
  setHasSuggestionSelected: (selected: boolean) => void;
}

export const useInputBar = ({
  ref,
  setInputValue,
  setHasSuggestionSelected
}: UseInputBarProps) => {
  // Create a ref for the input element
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
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
  
  // Expose the focusInput method to parent components
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));

  // Handle autocomplete suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setHasSuggestionSelected(false);
    // Focus back to input after selection and set cursor to end
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Set cursor position to the end of the text
        inputRef.current.setSelectionRange(suggestion.length, suggestion.length);
      }
    }, 0);
  };

  return {
    inputRef,
    progressRef,
    handleSuggestionClick
  };
};
