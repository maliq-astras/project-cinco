import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryType } from '@/types';
import { useAutocomplete } from './useAutocomplete';
import { autocompleteStyles } from './Autocomplete.styles';

interface AutocompleteProps {
  category: CategoryType;
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  primaryColor: string;
  isVisible: boolean;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  previousGuesses?: string[];
  onSelectionChange?: (hasSelection: boolean) => void;
}

/**
 * Autocomplete dropdown component for game input suggestions
 */
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
  const {
    suggestions,
    selectedIndex,
    inputFocused,
    containerRef,
    setSelectedIndex,
    setSuggestions,
    getPosition,
    responsiveValues,
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait
  } = useAutocomplete({
    category,
    query,
    isVisible,
    inputRef,
    previousGuesses,
    onSuggestionClick,
    onSelectionChange
  });

  if (!isVisible || !inputFocused || suggestions.length === 0) return null;

  const autocompleteContent = (
    <motion.div
      ref={containerRef}
      style={{
        ...getPosition(),
        ...autocompleteStyles.getContainerStyle(primaryColor)
      }}
      className={autocompleteStyles.container}
      initial={autocompleteStyles.containerAnimation.initial}
      animate={autocompleteStyles.containerAnimation.animate(suggestions.length)}
      exit={autocompleteStyles.containerAnimation.exit}
      transition={autocompleteStyles.containerAnimation.transition}
    >
      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={autocompleteStyles.suggestionAnimation.initial}
            animate={autocompleteStyles.suggestionAnimation.animate}
            exit={autocompleteStyles.suggestionAnimation.exit}
            transition={{ delay: index * 0.02 }}
            // Use onMouseDown so selection happens before input blur
            onMouseDown={(e) => {
              e.preventDefault(); // keep input focused (prevents blur during click)
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
            className={autocompleteStyles.suggestionButton}
            style={autocompleteStyles.getSuggestionStyle(primaryColor, selectedIndex === index)}
          >
            <span className={autocompleteStyles.suggestionText}>
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
