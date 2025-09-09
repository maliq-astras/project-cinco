import { useEffect } from 'react';

interface UseAutocompleteEventsProps {
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  isVisible: boolean;
  suggestions: Array<{ text: string; id: string }>;
  selectedIndex: number;
  onSuggestionClick: (suggestion: string) => void;
  onSelectionChange?: (hasSelection: boolean) => void;
  setInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setSuggestions: React.Dispatch<React.SetStateAction<Array<{ text: string; id: string }>>>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const useAutocompleteEvents = ({
  inputRef,
  isVisible,
  suggestions,
  selectedIndex,
  onSuggestionClick,
  onSelectionChange,
  setInputFocused,
  setSuggestions,
  setSelectedIndex
}: UseAutocompleteEventsProps) => {
  // Handle input focus/blur
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    
    const handleFocus = () => setInputFocused(true);
    const handleBlur = () => {
      setInputFocused(false);
      setSuggestions([]);
      setSelectedIndex(-1);
      onSelectionChange?.(false);
    };
    
    el.addEventListener('focus', handleFocus);
    el.addEventListener('blur', handleBlur);
    setInputFocused(document.activeElement === el);
    
    return () => {
      el.removeEventListener('focus', handleFocus);
      el.removeEventListener('blur', handleBlur);
    };
  }, [inputRef, onSelectionChange, setInputFocused, setSuggestions, setSelectedIndex]);

  // Handle selection change notifications
  useEffect(() => {
    setSelectedIndex(prev => {
      if (prev >= 0 && prev < suggestions.length) {
        return prev;
      }
      return -1;
    });
    onSelectionChange?.(false);
  }, [suggestions.length, onSelectionChange, setSelectedIndex]);

  useEffect(() => {
    onSelectionChange?.(selectedIndex >= 0);
  }, [selectedIndex, onSelectionChange]);

  // Handle keyboard navigation
  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
          break;
        case 'Enter':
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            e.preventDefault();
            onSuggestionClick(suggestions[selectedIndex].text);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSuggestions([]);
          setSelectedIndex(-1);
          break;
      }
    };

    inputElement.addEventListener('keydown', handleKeyDown as EventListener);
    return () => inputElement.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [isVisible, suggestions, selectedIndex, onSuggestionClick, inputRef, setSelectedIndex, setSuggestions]);
};