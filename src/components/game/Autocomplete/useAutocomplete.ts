import { useState, useEffect, useRef } from 'react';
import { CategoryType } from '@/types';
import { getAutocompleteSuggestions, Language } from '@/helpers/autocompleteHelper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResponsive } from '@/hooks/responsive';

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
  
  const { 
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait
  } = useResponsive();
  
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const getSuggestions = (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestionTexts = getAutocompleteSuggestions(
        category,
        searchQuery,
        5, 
        previousGuesses,
        language as Language 
      );
      
      const suggestionObjects = suggestionTexts
        .filter((text: string) => text.toLowerCase() !== searchQuery.toLowerCase()) 
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
  }, [inputRef, onSelectionChange]);

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
    }, 150); // 150ms debounce  

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, category, isVisible, inputFocused, previousGuesses, language]);

  useEffect(() => {
    // Only reset if suggestions actually changed content, not just re-rendered
    setSelectedIndex(prev => {
      // If we had a selection and suggestions are still available, try to maintain it
      if (prev >= 0 && prev < suggestions.length) {
        return prev;
      }
    
      return -1;
    });
    onSelectionChange?.(false);
    }, [suggestions.length, onSelectionChange]); 

  // Only depend on length, not the entire suggestions array
  useEffect(() => {
    onSelectionChange?.(selectedIndex >= 0);
  }, [selectedIndex, onSelectionChange]);

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

  const getPosition = () => {
    if (!inputRef.current) return {};
    
    const inputRect = inputRef.current.getBoundingClientRect();
    const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm';
    
    const desktopWidth = Math.max(inputRect.width, 320);
    const mobileWidth = width - (responsiveValues.spacing * 2); 
    
    const leftPosition = isSmallScreen 
      ? responsiveValues.spacing 
      : inputRect.left - (desktopWidth - inputRect.width) / 2; 
    
    return {
      position: 'fixed' as const,
      left: leftPosition,
      bottom: height - inputRect.top + 6, 
      width: isSmallScreen ? mobileWidth : desktopWidth,
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
    getPosition,
    responsiveValues,
    width,
    height,
    breakpoint,
    isLandscape,
    isPortrait
  };
};
