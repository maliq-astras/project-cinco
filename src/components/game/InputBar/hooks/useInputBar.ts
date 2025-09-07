import { useRef, useImperativeHandle, Ref, useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

export interface InputBarHandle {
  focusInput: () => void;
}

interface UseInputBarProps {
  ref: Ref<InputBarHandle>;
  setInputValue: (value: string) => void;
  setHasSuggestionSelected: (selected: boolean) => void;
  setHasUserInput: (hasInput: boolean) => void;
  hasSuggestionSelected: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useInputBar = ({
  ref,
  setInputValue,
  setHasSuggestionSelected,
  setHasUserInput,
  hasSuggestionSelected,
  onSubmit
}: UseInputBarProps) => {
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait
  } = useResponsive();
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
  
  // Expose the focusInput method to parent components
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setHasSuggestionSelected(false);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(suggestion.length, suggestion.length);
      }
    }, 0);
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (hasSuggestionSelected) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setHasUserInput(val.trim().length > 0);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !hasSuggestionSelected) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return {
    inputRef,
    progressRef,
    formRef,
    textareaShellRef,
    handleSuggestionClick,
    handleFormSubmit,
    handleInputChange,
    handleKeyDown,
    responsiveValues
  };
};
