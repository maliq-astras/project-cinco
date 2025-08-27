import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useResponsive } from '@/hooks/responsive';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

export interface MenuItem {
  label: string;
  onClick: () => void;
  showArrow?: boolean;
  ariaLabel?: string;
}

export const useCompactHeader = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const challenge = useGameStore(state => state.gameState.challenge);
  const hardMode = useGameStore(state => state.hardMode);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const gameState = useGameStore(state => state.gameState);
  const { breakpoint, mounted, getResponsiveValue } = useResponsive();
  const { registerElement, unregisterElement } = useDOMRefs();
  
  // UI state from gameStore
  const isTutorialOpen = useGameStore((state) => state.isTutorialOpen);
  const isSettingsOpen = useGameStore((state) => state.isSettingsPanelOpen);
  const setTutorialOpen = useGameStore((state) => state.setTutorialOpen);
  const setSettingsPanelOpen = useGameStore((state) => state.setSettingsPanelOpen);
  
  const logoRef = useRef<HTMLDivElement>(null);
  const categoryTitleRef = useRef<HTMLHeadingElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

  // Register the header area element with the DOM refs system
  useEffect(() => {
    if (logoRef.current) {
      registerElement('header-area', logoRef.current);
    }
    
    return () => {
      unregisterElement('header-area');
    };
  }, [registerElement, unregisterElement]);

  // Register the category title element with the DOM refs system
  useEffect(() => {
    if (categoryTitleRef.current) {
      registerElement('category-title', categoryTitleRef.current);
    }
    
    return () => {
      unregisterElement('category-title');
    };
  }, [registerElement, unregisterElement]);

  // Dynamic sizing based on breakpoint - similar to regular Header
  // Use state to prevent hydration mismatch
  const compactSizes = {
    iconSize: getResponsiveValue({
      xs: "1.9rem", 
      sm: "1.95rem",
      md: "2rem",
      lg: "2.15rem",
      xl: "2.25rem",
    }),
    titleFontSize: getResponsiveValue({
      xs: "2rem",
      sm: "2.25rem", 
      md: "2.25rem",
      lg: "2.5rem",
      xl: "2.75rem",
    }),
    titleMaxWidth: getResponsiveValue({
      xs: "220px", 
      sm: "240px",
      md: "260px",
      lg: "280px",
      xl: "300px",
    })
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openSettings = () => {
    setSettingsPanelOpen(true);
    setIsMenuOpen(false);
  };

  const closeSettings = () => {
    setSettingsPanelOpen(false);
  };

  const closeTutorial = () => {
    setTutorialOpen(false);
  };

  const menuItems: MenuItem[] = [
    {
      label: 'ui.buttons.settings',
      onClick: openSettings
    },
    // Only show "How to Play" if game is not over
    ...(gameState.isGameOver ? [] : [{
      label: 'ui.navigation.howToPlay',
      onClick: () => {
        setTutorialOpen(true);
        setIsMenuOpen(false);
      }
    }]),
    {
      label: 'ui.navigation.feedback',
      onClick: () => {
        setIsFeedbackModalOpen(true);
        setIsMenuOpen(false);
      }
    },
    {
      label: 'ui.navigation.reportBug',
      onClick: () => {
        setIsBugReportModalOpen(true);
        setIsMenuOpen(false);
      }
    }
  ];

  return {
    colors: {
      primary: colors.primary,
      secondary: colors.secondary
    },
    challenge,
    logoRef,
    categoryTitleRef, // Add the missing ref
    isMenuOpen,
    toggleMenu,
    menuItems,
    isSettingsOpen,
    openSettings,
    closeSettings,
    isTutorialOpen,
    closeTutorial,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isBugReportModalOpen,
    setIsBugReportModalOpen,
    // Add responsive sizes
    compactSizes,
    // Hard mode state
    hardMode,
    isHardModeEnabled
  };
};
