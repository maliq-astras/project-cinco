import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export const useSettingsPanelState = () => {
  const { colors, darkMode, highContrastMode } = useTheme();
  const { language } = useLanguage();
  
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const isAutocompleteEnabled = useGameStore(state => state.isAutocompleteEnabled);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  return {
    colors,
    darkMode,
    isHighContrast: highContrastMode,
    isHardModeEnabled,
    isAutocompleteEnabled,
    hasSeenClue,
    isSoundEnabled,
    setIsSoundEnabled,
    selectedLanguage,
    setSelectedLanguage,
    isLanguageDropdownOpen,
    setIsLanguageDropdownOpen
  };
};