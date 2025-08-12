import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryType } from '@/types';
import { getAutocompleteSuggestions, Language } from '@/helpers/autocompleteHelper';
import { useLanguage } from '@/contexts/LanguageContext';

interface AutocompleteProps {
  category: CategoryType;
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  primaryColor: string;
  isVisible: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  previousGuesses?: string[];
  onSelectionChange?: (hasSelection: boolean) => void;
}

interface AutocompleteSuggestion {
  text: string;
  id: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  category,
  query,
  onSuggestionClick,
  primaryColor,
  isVisible,
  inputRef,
  previousGuesses = [],
  onSelectionChange
}) => {
  const { language } = useLanguage();
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  // Debounced effect for getting suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (isVisible && category && query) {
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
  }, [query, category, isVisible, previousGuesses, language]);

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
            console.log('Arrow Down - prev:', prev, 'new:', newIndex, 'suggestions:', suggestions.length);
            return newIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : suggestions.length - 1;
            console.log('Arrow Up - prev:', prev, 'new:', newIndex, 'suggestions:', suggestions.length);
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

    inputElement.addEventListener('keydown', handleKeyDown);
    return () => inputElement.removeEventListener('keydown', handleKeyDown);
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
      bottom: window.innerHeight - inputRect.top + 5, // 5px above the input
      width: isSmallPhone ? window.innerWidth - 32 : desktopWidth,
      zIndex: 9999 // High z-index to float above everything
    };
  };

  if (!isVisible || suggestions.length === 0) return null;

  const autocompleteContent = (
    <motion.div
      ref={containerRef}
      style={{
        ...getPosition(),
        border: `2px solid var(--color-${primaryColor})`,
        maxHeight: '240px', // Max 5 items * 48px
        overflowY: 'auto',
        backdropFilter: 'blur(8px)',
        boxShadow: `0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px var(--color-${primaryColor}20)`
      }}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        height: suggestions.length * 48 + 16 // Animate height changes smoothly
      }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut",
        height: { duration: 0.3, ease: "easeInOut" } // Smooth height transitions
      }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
    >
      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.02 }}
            onClick={() => {
              // Clear suggestions immediately when clicked
              setSuggestions([]);
              setSelectedIndex(-1);
              onSuggestionClick(suggestion.text);
            }}
            onMouseEnter={() => {
              // Only update selection on mouse enter if not using keyboard
              setSelectedIndex(index);
            }}
            onMouseLeave={() => {
              // Don't reset selection on mouse leave to avoid conflicts with keyboard
            }}
            className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 focus:outline-none text-gray-900 dark:text-gray-100"
            style={{
              backgroundColor: selectedIndex === index 
                ? `var(--color-${primaryColor}30)` 
                : 'transparent',
              color: selectedIndex === index 
                ? `var(--color-${primaryColor})` 
                : undefined, // Let CSS classes handle default colors
              borderLeft: selectedIndex === index 
                ? `4px solid var(--color-${primaryColor})` 
                : '4px solid transparent',
              fontWeight: selectedIndex === index ? '700' : '500'
            }}
          >
            <span className="block text-sm font-medium truncate">
              {suggestion.text}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );

  // Render using portal to ensure it floats above everything
  return typeof window !== 'undefined' 
    ? createPortal(autocompleteContent, document.body)
    : null;
};

export default Autocomplete;
