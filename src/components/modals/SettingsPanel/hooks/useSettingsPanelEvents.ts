import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useLanguage, Language, SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';
import { useResponsive } from '@/hooks/responsive';

interface UseSettingsPanelEventsProps {
  onClose: () => void;
  setIsSoundEnabled: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  setIsLanguageDropdownOpen: (open: boolean) => void;
}

export const useSettingsPanelEvents = ({ 
  onClose, 
  setIsSoundEnabled, 
  isSoundEnabled,
  setIsLanguageDropdownOpen 
}: UseSettingsPanelEventsProps) => {
  const { toggleDarkMode, toggleHighContrastMode } = useTheme();
  const { changeLanguage } = useLanguage();
  const { isMobileMenu } = useResponsive();
  
  const setHardModeEnabled = useGameStore(state => state.setHardModeEnabled);
  const setAutocompleteEnabled = useGameStore(state => state.setAutocompleteEnabled);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const isAutocompleteEnabled = useGameStore(state => state.isAutocompleteEnabled);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobileMenu) {
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
    const newLang = e.target.value;
    
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      await changeLanguage(newLang as Language);
    }
  };

  const handleLanguageSelect = async (langCode: string) => {
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      setIsLanguageDropdownOpen(false);
      await changeLanguage(langCode as Language);
    }
  };

  return {
    handleOverlayClick,
    toggleDarkMode,
    toggleHighContrast: toggleHighContrastMode,
    toggleHardMode,
    toggleAutocomplete,
    toggleSound,
    handleLanguageChange,
    handleLanguageSelect
  };
};