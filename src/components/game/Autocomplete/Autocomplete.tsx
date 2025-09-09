import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryType } from '@/types';
import { useAutocomplete } from './hooks';
import { 
  getContainerStyle, 
  getSuggestionStyle
} from './helpers/styles';
import {
  getContainerAnimationProps,
  getSuggestionAnimationProps
} from './helpers/animations';
import styles from './Autocomplete.module.css';

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

const Autocomplete = React.memo(function Autocomplete({
  category,
  query,
  onSuggestionClick,
  primaryColor,
  isVisible,
  inputRef,
  previousGuesses = [],
  onSelectionChange
}: AutocompleteProps) {
  const {
    suggestions,
    selectedIndex,
    inputFocused,
    containerRef,
    setSelectedIndex,
    setSuggestions,
    getPosition,
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
        ...getContainerStyle(primaryColor)
      }}
      className={styles.container}
      {...getContainerAnimationProps()}
    >
      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            {...getSuggestionAnimationProps(index)}
            onMouseDown={(e) => {
              e.preventDefault();
              setSuggestions([]);
              setSelectedIndex(-1);
              onSuggestionClick(suggestion.text);
            }}
            onMouseEnter={() => {
              setSelectedIndex(index);
            }}
            onMouseLeave={() => {
            }}
            className={styles.suggestionButton}
            style={getSuggestionStyle(primaryColor, selectedIndex === index)}
          >
            <span className={styles.suggestionText}>
              {suggestion.text}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );

  return typeof window !== 'undefined' 
    ? createPortal(autocompleteContent, document.body)
    : null;
});

Autocomplete.displayName = 'Autocomplete';

export default Autocomplete;
