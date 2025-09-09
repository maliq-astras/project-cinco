import React from 'react';

interface UseInputBarEventsProps {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  formRef: React.RefObject<HTMLFormElement | null>;
  setInputValue: (value: string) => void;
  setHasSuggestionSelected: (selected: boolean) => void;
  setHasUserInput: (hasInput: boolean) => void;
  hasSuggestionSelected: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useInputBarEvents = ({
  inputRef,
  formRef,
  setInputValue,
  setHasSuggestionSelected,
  setHasUserInput,
  hasSuggestionSelected,
  onSubmit
}: UseInputBarEventsProps) => {
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
    handleSuggestionClick,
    handleFormSubmit,
    handleInputChange,
    handleKeyDown
  };
};