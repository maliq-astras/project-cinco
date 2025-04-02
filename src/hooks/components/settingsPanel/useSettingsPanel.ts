import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

// Mock data for languages (would come from actual i18n system)
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

interface UseSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useSettingsPanel = ({ isOpen, onClose }: UseSettingsPanelProps) => {
  const { colors, darkMode, toggleDarkMode } = useTheme();
  
  // Use separate selectors for each state value to avoid the infinite loop
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const setHardModeEnabled = useGameStore(state => state.setHardModeEnabled);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  
  // These would be hooked up to actual state management in a real implementation
  const [isRandomizer, setIsRandomizer] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isMobile, setIsMobile] = useState(false);
  
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
    setSelectedLanguage(e.target.value);
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