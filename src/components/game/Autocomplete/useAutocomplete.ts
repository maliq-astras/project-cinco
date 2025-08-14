import { useState, useEffect, useRef } from 'react';
import { CategoryType } from '@/types';
import { getAutocompleteSuggestions, Language } from '@/helpers/autocompleteHelper';
import { useLanguage } from '@/contexts/LanguageContext';

interface AutocompleteSuggestion {
  text: string;
  id: string;
}

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
  const { language } = useLanguage();
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Get suggestions using frontend helper
  const getSuggestions = (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestionTexts = getAutocompleteSuggestions(
        category,
        searchQuery,
        5, // max 5 suggestions
        previousGuesses,
        language as Language // Convert to Language type
      );
      
      const suggestionObjects = suggestionTexts
        .filter((text: string) => text.toLowerCase() !== searchQuery.toLowerCase()) // Filter out exact matches
        .map((text: string, index: number) => ({
          text,
          id: `suggestion-${index}`
        }));
      
      setSuggestions(suggestionObjects);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      setSuggestions([]);
    }
  };

  // Track input focus so we only show suggestions while actively typing/focused
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
    // Initialize current focus state
    setInputFocused(document.activeElement === el);
    return () => {
      el.removeEventListener('focus', handleFocus);
      el.removeEventListener('blur', handleBlur);
    };
  }, [inputRef, onSelectionChange]);

  // Debounced effect for getting suggestions (only when focused and visible)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (isVisible && inputFocused && category && query) {
        getSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 150); // 150ms debounce (faster since no API call)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, category, isVisible, inputFocused, previousGuesses, language]);

  // Reset selected index when suggestions change and notify parent
  useEffect(() => {
    // Only reset if suggestions actually changed content, not just re-rendered
    setSelectedIndex(prev => {
      // If we had a selection and suggestions are still available, try to maintain it
      if (prev >= 0 && prev < suggestions.length) {
        return prev;
      }
      // Otherwise reset to -1
      return -1;
    });
    onSelectionChange?.(false);
  }, [suggestions.length, onSelectionChange]); // Only depend on length, not the entire suggestions array

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChange?.(selectedIndex >= 0);
  }, [selectedIndex, onSelectionChange]);

  // Handle keyboard navigation on the input element
  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
            setSelectedIndex(prev => {
            const newIndex = prev < suggestions.length - 1 ? prev + 1 : 0;
            return newIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
            setSelectedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : suggestions.length - 1;
            return newIndex;
          });
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
  }, [isVisible, suggestions, selectedIndex, onSuggestionClick, inputRef]);

  // Position the autocomplete above the input
  const getPosition = () => {
    if (!inputRef.current) return {};
    
    const inputRect = inputRef.current.getBoundingClientRect();
    const isSmallPhone = window.innerWidth <= 375;
    
    const desktopWidth = Math.max(inputRect.width, 320);
    const leftPosition = isSmallPhone 
      ? 16 
      : inputRect.left - (desktopWidth - inputRect.width) / 2; // Center the wider box above the input
    
    return {
      position: 'fixed' as const,
      left: leftPosition,
      bottom: window.innerHeight - inputRect.top + 6, // attach to the top of the textarea since it will translateY upwards
      width: isSmallPhone ? window.innerWidth - 32 : desktopWidth,
      zIndex: 58
    };
  };

  return {
    suggestions,
    selectedIndex,
    inputFocused,
    containerRef,
    setSelectedIndex,
    setSuggestions,
    getPosition
  };
};
