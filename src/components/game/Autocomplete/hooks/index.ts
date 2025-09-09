import { useAutocompleteState } from './useAutocompleteState';
import { useAutocompleteEvents } from './useAutocompleteEvents';
import { useAutocompleteLogic } from './useAutocompleteLogic';
import { CategoryType } from '@/types';

interface UseAutocompleteProps {
  category: CategoryType;
  query: string;
  isVisible: boolean;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  previousGuesses: string[];
  onSuggestionClick: (suggestion: string) => void;
  onSelectionChange?: (hasSelection: boolean) => void;
}

export const useAutocomplete = ({
  category,
  query,
  isVisible,
  inputRef,
  previousGuesses,
  onSuggestionClick,
  onSelectionChange
}: UseAutocompleteProps) => {
  const state = useAutocompleteState();
  
  const logic = useAutocompleteLogic({
    category,
    query,
    isVisible,
    inputRef,
    previousGuesses,
    inputFocused: state.inputFocused,
    debounceRef: state.debounceRef,
    setSuggestions: state.setSuggestions
  });

  useAutocompleteEvents({
    inputRef,
    isVisible,
    suggestions: state.suggestions,
    selectedIndex: state.selectedIndex,
    onSuggestionClick,
    onSelectionChange,
    setInputFocused: state.setInputFocused,
    setSuggestions: state.setSuggestions,
    setSelectedIndex: state.setSelectedIndex
  });

  return {
    suggestions: state.suggestions,
    selectedIndex: state.selectedIndex,
    inputFocused: state.inputFocused,
    containerRef: state.containerRef,
    setSelectedIndex: state.setSelectedIndex,
    setSuggestions: state.setSuggestions,
    getPosition: logic.getPosition
  };
};