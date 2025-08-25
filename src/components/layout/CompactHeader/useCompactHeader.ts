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
  const { breakpoint, mounted } = useResponsive();
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
  const [compactSizes, setCompactSizes] = useState({
    iconSize: "1.5rem", // Default size
    titleFontSize: "1.375rem", // Default size
    titleMaxWidth: "240px" // Default size
  });

  // Update sizes only after client-side hydration
  useEffect(() => {
    if (!mounted) return;

    const getCompactHeaderSizes = () => {
      switch (breakpoint) {
        case 'xxs':
          return {
            iconSize: "clamp(1.25rem, 2.5vw, 1.5rem)", // 20px to 24px
            titleFontSize: "clamp(1.125rem, 3vw, 1.375rem)", // 18px to 22px
            titleMaxWidth: "200px"
          };
        case 'xs':
          return {
            iconSize: "clamp(1.375rem, 2.75vw, 1.625rem)", // 22px to 26px
            titleFontSize: "clamp(1.25rem, 3.25vw, 1.5rem)", // 20px to 24px
            titleMaxWidth: "220px"
          };
        case 'sm':
          return {
            iconSize: "clamp(1.5rem, 3vw, 1.75rem)", // 24px to 28px
            titleFontSize: "clamp(1.375rem, 3.5vw, 1.625rem)", // 22px to 26px
            titleMaxWidth: "240px"
          };
        case 'md':
          return {
            iconSize: "clamp(1.625rem, 3.25vw, 1.875rem)", // 26px to 30px
            titleFontSize: "clamp(1.5rem, 3.75vw, 1.75rem)", // 24px to 28px
            titleMaxWidth: "260px"
          };
        case 'lg':
          return {
            iconSize: "clamp(1.75rem, 3.5vw, 2rem)", // 28px to 32px
            titleFontSize: "clamp(1.625rem, 4vw, 1.875rem)", // 26px to 30px
            titleMaxWidth: "280px"
          };
        case 'xl':
          return {
            iconSize: "clamp(1.875rem, 3.75vw, 2.125rem)", // 30px to 34px
            titleFontSize: "clamp(1.75rem, 4.25vw, 2rem)", // 28px to 32px
            titleMaxWidth: "300px"
          };
        case 'xxl':
          return {
            iconSize: "clamp(2rem, 4vw, 2.25rem)", // 32px to 36px
            titleFontSize: "clamp(1.875rem, 4.5vw, 2.125rem)", // 30px to 34px
            titleMaxWidth: "320px"
          };
        default:
          return {
            iconSize: "clamp(1.5rem, 3vw, 1.75rem)", // 24px to 28px
            titleFontSize: "clamp(1.375rem, 3.5vw, 1.625rem)", // 22px to 26px
            titleMaxWidth: "240px"
          };
      }
    };

    setCompactSizes(getCompactHeaderSizes());
  }, [mounted, breakpoint]);

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
      label: t('ui.buttons.tutorial'),
      onClick: () => {
        setTutorialOpen(true);
        setIsMenuOpen(false);
      }
    },
    {
      label: t('ui.buttons.settings'),
      onClick: openSettings
    },
    {
      label: t('ui.buttons.feedback'),
      onClick: () => {
        setIsFeedbackModalOpen(true);
        setIsMenuOpen(false);
      }
    },
    {
      label: t('ui.buttons.bugReport'),
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
    compactSizes
  };
};
