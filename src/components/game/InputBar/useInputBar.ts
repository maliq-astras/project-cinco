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
  // Use our new unified responsive system
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait
  } = useResponsive();

  // Create refs for the input elements
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

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent submission if a suggestion is selected
    if (hasSuggestionSelected) {
      e.preventDefault();
      return;
    }
    onSubmit(e);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setHasUserInput(val.trim().length > 0);
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !hasSuggestionSelected) {
      e.preventDefault();
      // Submit the form programmatically
      formRef.current?.requestSubmit();
    }
  };

  return {
    // Refs
    inputRef,
    progressRef,
    formRef,
    textareaShellRef,
    
    // Event handlers
    handleSuggestionClick,
    handleFormSubmit,
    handleInputChange,
    handleKeyDown,
    
    // Responsive values from our new system
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait
  };
};
