import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useGameStore } from '../../../store/gameStore';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, COMING_SOON_LANGUAGES, useLanguage } from '../../../context/LanguageContext';

// Format languages for display in the dropdown
export const languages = [
  ...SUPPORTED_LANGUAGES.map(code => ({ code, name: code === 'en' ? 'English' : code === 'es' ? 'Español' : code })),
  ...COMING_SOON_LANGUAGES.map(code => ({ code, name: `${code.toUpperCase()} (${code === 'fr' ? 'Français' : code === 'de' ? 'Deutsch' : code === 'it' ? 'Italiano' : code === 'pt' ? 'Português' : code === 'ru' ? 'Русский' : code === 'zh' ? '中文' : code === 'ja' ? '日本語' : code === 'ko' ? '한국어' : code}) - Coming Soon` }))
];

interface UseSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useSettingsPanel = ({ isOpen, onClose }: UseSettingsPanelProps) => {
  const { colors, darkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  
  // Use separate selectors for each state value to avoid the infinite loop
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const setHardModeEnabled = useGameStore(state => state.setHardModeEnabled);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  
  // These would be hooked up to actual state management in a real implementation
  const [isRandomizer, setIsRandomizer] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
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
  
  const toggleRandomizer = () => {
    setIsRandomizer(!isRandomizer);
  };
  
  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    
    // Only change language if it's one of the supported languages
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      changeLanguage(newLang);
    }
  };

  return {
    colors,
    darkMode,
    toggleDarkMode,
    isHardModeEnabled,
    toggleHardMode,
    hasSeenClue,
    isRandomizer,
    toggleRandomizer,
    isHighContrast,
    toggleHighContrast,
    selectedLanguage,
    handleLanguageChange,
    isMobile,
    handleOverlayClick,
    languages
  };
}; 