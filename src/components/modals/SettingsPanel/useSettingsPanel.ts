import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, useLanguage, Language } from '@/contexts/LanguageContext';
import { deviceDetection } from '@/helpers/deviceHelpers';
import { useBodyScrollLock } from '@/hooks/ui/useBodyScrollLock';

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
  const isAutocompleteEnabled = useGameStore(state => state.isAutocompleteEnabled);
  const setAutocompleteEnabled = useGameStore(state => state.setAutocompleteEnabled);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  const hasMadeGuess = useGameStore(state => state.hasMadeGuess);
  
  // These would be hooked up to actual state management in a real implementation
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [isMobile, setIsMobile] = useState(false);
  
  // Language dropdown state
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const languageSelectRef = useRef<HTMLDivElement>(null);
  
  // Use the body scroll lock hook
  useBodyScrollLock(isOpen);
  
  // Sync selectedLanguage with language from context
  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);
  
  // Detect if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      if (typeof window === 'undefined') {
        setIsMobile(false);
        return;
      }
      
      // Use more inclusive mobile detection for consistent modal behavior
      const isMobileWidth = window.innerWidth < 768;
      const isActualMobile = deviceDetection.isMobilePhone();
      
      // Use mobile animations for both actual mobile phones and smaller tablet screens
      setIsMobile(isMobileWidth || isActualMobile);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleLanguageDropdown = () => {  
    // Remove the language lock restriction - users can always change language
    if (!isLanguageDropdownOpen && languageSelectRef.current) {
      const rect = languageSelectRef.current.getBoundingClientRect();
      const position = {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      };
      setDropdownPosition(position);
    }
    
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose();
    }
  };
  
  const toggleHardMode = () => {
    setHardModeEnabled(!isHardModeEnabled);
  };
  
  const toggleAutocomplete = () => {
    setAutocompleteEnabled(!isAutocompleteEnabled);
  };
  
  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };
  
  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Remove language lock restriction - users can always change language
    const newLang = e.target.value;
    
    // Only change language if it's one of the supported languages
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setSelectedLanguage(newLang as Language);
      await changeLanguage(newLang as Language);
    }
  };
  
  // Function for the custom select to update language
  const selectLanguage = async (lang: string) => {
    
    // Remove language lock restriction - users can always change language
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setIsLanguageDropdownOpen(false);
      await changeLanguage(lang as Language);
      // selectedLanguage will be updated automatically via the useEffect that syncs with language context
    }
  };

  return {
    colors,
    darkMode,
    toggleDarkMode,
    isHardModeEnabled,
    toggleHardMode,
    isAutocompleteEnabled,
    toggleAutocomplete,
    hasSeenClue,
    isSoundEnabled,
    toggleSound,
    isHighContrast: highContrastMode,
    toggleHighContrast: toggleHighContrastMode,
    selectedLanguage,
    handleLanguageChange,
    isMobile,
    handleOverlayClick,
    isLanguageLocked,
    // Language dropdown
    isLanguageDropdownOpen,
    dropdownPosition,
    languageSelectRef,
    toggleLanguageDropdown,
    selectLanguage
  };
}; 