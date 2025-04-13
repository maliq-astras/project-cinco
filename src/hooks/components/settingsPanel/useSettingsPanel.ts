import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useGameStore } from '../../../store/gameStore';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, COMING_SOON_LANGUAGES, useLanguage, Language } from '../../../contexts/LanguageContext';

// Format languages for display in the dropdown
export const languages = [
  ...SUPPORTED_LANGUAGES.map(code => ({ code, name: code === 'en' ? 'English' : code === 'es' ? 'Español' : code })),
  // Single entry for all upcoming languages
  { code: 'more', name: 'More coming soon!' }
];

interface UseSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useSettingsPanel = ({ isOpen, onClose }: UseSettingsPanelProps) => {
  const { colors, darkMode, toggleDarkMode, highContrastMode, toggleHighContrastMode } = useTheme();
  const { t } = useTranslation();
  const { language, changeLanguage, isLanguageLocked } = useLanguage();
  
  // Use separate selectors for each state value to avoid the infinite loop
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const setHardModeEnabled = useGameStore(state => state.setHardModeEnabled);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const hasMadeGuess = useGameStore(state => state.hasMadeGuess);
  
  // These would be hooked up to actual state management in a real implementation
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isMobile, setIsMobile] = useState(false);
  
  // Sync selectedLanguage with language from context
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);
  
  // Detect if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Handle body scroll locking when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose();
    }
  };
  
  const toggleHardMode = () => {
    setHardModeEnabled(!isHardModeEnabled);
  };
  
  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isLanguageLocked) return; // Don't change language if it's locked
    
    const newLang = e.target.value;
    
    // Only change language if it's one of the supported languages
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setSelectedLanguage(newLang as Language);
      changeLanguage(newLang as Language);
    }
  };

  return {
    colors,
    darkMode,
    toggleDarkMode,
    isHardModeEnabled,
    toggleHardMode,
    hasSeenClue,
    isSoundEnabled,
    toggleSound,
    isHighContrast: highContrastMode,
    toggleHighContrast: toggleHighContrastMode,
    selectedLanguage,
    handleLanguageChange,
    isMobile,
    handleOverlayClick,
    languages,
    isLanguageLocked
  };
}; 