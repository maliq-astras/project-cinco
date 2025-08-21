import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { GameState } from '@/helpers/gameLogic';

interface MenuItem {
  label: string;
  onClick: () => void;
  showArrow: boolean;
  ariaLabel: string;
}

interface GameStoreState {
  gameState: GameState;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  hardMode: boolean;
  isHardModeEnabled: boolean;
  isSettingsPanelOpen: boolean;
  isTutorialOpen: boolean;
  setSettingsPanelOpen: (isOpen: boolean) => void;
  setTutorialOpen: (isOpen: boolean) => void;
}

export const useNavigation = () => {
  const { colors } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);
  
  // Use state from gameStore instead of local state
  const isGameOver = useGameStore((state: GameStoreState) => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore((state: GameStoreState) => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore((state: GameStoreState) => state.showFinalFiveTransition);
  const hardMode = useGameStore((state: GameStoreState) => state.hardMode);
  const isHardModeEnabled = useGameStore((state: GameStoreState) => state.isHardModeEnabled);
  const isSettingsOpen = useGameStore((state: GameStoreState) => state.isSettingsPanelOpen);
  const isTutorialOpen = useGameStore((state: GameStoreState) => state.isTutorialOpen);
  
  // Use methods from gameStore
  const setSettingsPanelOpen = useGameStore((state: GameStoreState) => state.setSettingsPanelOpen);
  const setTutorialOpen = useGameStore((state: GameStoreState) => state.setTutorialOpen);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only show How to Play during active gameplay (not during Final Five or game over)
  const shouldShowHowToPlay = !isGameOver && !isFinalFiveActive && !showFinalFiveTransition;

  // Handle click outside dropdown - now returns a handler for the component to use
  const handleClickOutside = (event: React.MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  // Define all menu items, we'll filter based on game state later
  const allMenuItems: MenuItem[] = [
    { 
      label: 'ui.navigation.howToPlay', 
      onClick: () => {
        setTutorialOpen(true);
        setIsDropdownOpen(false);
      },
      showArrow: false, // This doesn't navigate away
      ariaLabel: 'ui.navigation.howToPlay'
    },
    { 
      label: 'ui.navigation.reportBug', 
      onClick: () => {
        setIsBugReportModalOpen(true);
        setIsDropdownOpen(false);
      },
      showArrow: false,
      ariaLabel: 'ui.navigation.reportBug'
    },
    { 
      label: 'ui.navigation.feedback', 
      onClick: () => {
        setIsFeedbackModalOpen(true);
        setIsDropdownOpen(false);
      },
      showArrow: false,
      ariaLabel: 'ui.navigation.feedback'
    },
  ];
  
  // Filter menu items based on game state
  const menuItems = allMenuItems.filter(item => {
    // Only include How to Play if we should show it
    if (item.label === 'ui.navigation.howToPlay') {
      return shouldShowHowToPlay;
    }
    // Include all other menu items always
    return true;
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openSettings = () => {
    setSettingsPanelOpen(true);
  };

  const closeSettings = () => {
    setSettingsPanelOpen(false);
  };

  const closeTutorial = () => {
    setTutorialOpen(false);
  };

  return {
    colors,
    isDropdownOpen,
    isTutorialOpen,
    isSettingsOpen,
    isFeedbackModalOpen,
    isBugReportModalOpen,
    dropdownRef,
    hardMode,
    isHardModeEnabled,
    menuItems,
    toggleDropdown,
    openSettings,
    closeSettings,
    closeTutorial,
    setIsFeedbackModalOpen,
    setIsBugReportModalOpen,
    handleClickOutside // Now returns the handler for component use
  };
}; 