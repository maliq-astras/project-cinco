import { useRef, useImperativeHandle, Ref } from 'react';

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
    handleSuggestionClick
  };
};
