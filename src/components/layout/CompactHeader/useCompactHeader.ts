import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { useResponsive } from '@/hooks/responsive';

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
  const { breakpoint } = useResponsive();
  
  // UI state from gameStore
  const isTutorialOpen = useGameStore((state) => state.isTutorialOpen);
  const isSettingsOpen = useGameStore((state) => state.isSettingsPanelOpen);
  const setTutorialOpen = useGameStore((state) => state.setTutorialOpen);
  const setSettingsPanelOpen = useGameStore((state) => state.setSettingsPanelOpen);
  
  const logoRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

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
    setIsBugReportModalOpen
  };
};
