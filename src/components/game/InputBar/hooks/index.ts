import { Ref } from 'react';
import { useInputBarState } from './useInputBarState';
import { useInputBarEvents } from './useInputBarEvents';
import { useInputBarLogic, InputBarHandle } from './useInputBarLogic';
import { useAutoGrowTextarea } from './useAutoGrowTextarea';

interface UseInputBarOrchestratorProps {
  ref: Ref<InputBarHandle>;
  inputValue: string;
  setInputValue: (value: string) => void;
  setHasSuggestionSelected: (selected: boolean) => void;
  setHasUserInput: (hasInput: boolean) => void;
  hasSuggestionSelected: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useInputBarOrchestrator = ({
  ref,
  inputValue,
  setInputValue,
  setHasSuggestionSelected,
  setHasUserInput,
  hasSuggestionSelected,
  onSubmit
}: UseInputBarOrchestratorProps) => {
  const {
    inputRef,
    progressRef,
    formRef,
    textareaShellRef,
    responsiveValues
  } = useInputBarState();

  const {
    handleSuggestionClick,
    handleFormSubmit,
    handleInputChange,
    handleKeyDown
  } = useInputBarEvents({
    inputRef,
    formRef,
    setInputValue,
    setHasSuggestionSelected,
    setHasUserInput,
    hasSuggestionSelected,
    onSubmit
  });

  useInputBarLogic({
    ref,
    inputRef
  });
  
  // Auto-grow textarea functionality with responsive max height
  const maxHeight = responsiveValues.inputBarHeight * 2;
  useAutoGrowTextarea(
    inputRef,
    textareaShellRef,
    inputValue,
    { maxHeightPx: maxHeight }
  );

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