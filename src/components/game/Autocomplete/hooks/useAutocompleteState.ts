import { useState, useRef } from 'react';

interface AutocompleteSuggestion {
  text: string;
  id: string;
}

export const useAutocompleteState = () => {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  return {
    suggestions,
    setSuggestions,
    selectedIndex,
    setSelectedIndex,
    inputFocused,
    setInputFocused,
    containerRef,
    debounceRef
  };
};