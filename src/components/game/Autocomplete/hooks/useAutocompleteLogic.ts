import { useEffect, useCallback } from 'react';
import { CategoryType } from '@/types';
import { getAutocompleteSuggestions, Language } from '@/helpers/autocompleteHelper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useResponsive } from '@/hooks/responsive';

interface AutocompleteSuggestion {
  text: string;
  id: string;
}

interface UseAutocompleteLogicProps {
  category: CategoryType;
  query: string;
  isVisible: boolean;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  previousGuesses: string[];
  inputFocused: boolean;
  debounceRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setSuggestions: (suggestions: AutocompleteSuggestion[]) => void;
}

export const useAutocompleteLogic = ({
  category,
  query,
  isVisible,
  inputRef,
  previousGuesses,
  inputFocused,
  debounceRef,
  setSuggestions
}: UseAutocompleteLogicProps) => {
  const { language } = useLanguage();
  const { responsiveValues, width, height, breakpoint } = useResponsive();

  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const suggestionTexts = await getAutocompleteSuggestions(
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
  }, [category, previousGuesses, language, setSuggestions]);

  // Handle query changes with debouncing
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
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, category, isVisible, inputFocused, previousGuesses, language, debounceRef, setSuggestions, getSuggestions]);

  const getPosition = () => {
    if (!inputRef.current) return {};

    const inputRect = inputRef.current.getBoundingClientRect();
    const isSmallScreen = breakpoint === 'xs' || breakpoint === 'sm';

    const desktopWidth = Math.max(inputRect.width, 320);
    const mobileWidth = width - (responsiveValues.spacing * 2);

    const leftPosition = isSmallScreen
      ? responsiveValues.spacing
      : inputRect.left - (desktopWidth - inputRect.width) / 2;

    // Use visual viewport height on mobile to account for keyboard
    const viewportHeight = typeof window !== 'undefined' && window.visualViewport
      ? window.visualViewport.height
      : height;

    return {
      position: 'fixed' as const,
      left: leftPosition,
      bottom: viewportHeight - inputRect.top + 6,
      width: isSmallScreen ? mobileWidth : desktopWidth,
      zIndex: 58,
      maxHeight: isSmallScreen ? '40vh' : undefined
    };
  };

  return {
    getPosition
  };
};