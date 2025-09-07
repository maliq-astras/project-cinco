import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryType } from '@/types';
import { useAutocomplete } from './useAutocomplete';
import { getContainerStyle, getSuggestionStyle } from './helpers';
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
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1
      }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ 
        duration: 0.2, 
        ease: "easeOut"
      }}
    >
      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.02 }}
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
};

export default Autocomplete;
