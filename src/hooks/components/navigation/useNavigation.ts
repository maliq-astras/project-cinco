import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useGameStore } from '../../../store/gameStore';

interface MenuItem {
  label: string;
  onClick: () => void;
  showArrow: boolean;
}

export const useNavigation = () => {
  const { colors, darkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use state from gameStore instead of local state
  const isGameOver = useGameStore(state => state.gameState.isGameOver);
  const isFinalFiveActive = useGameStore(state => state.isFinalFiveActive);
  const showFinalFiveTransition = useGameStore(state => state.showFinalFiveTransition);
  const hardMode = useGameStore(state => state.hardMode);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const isSettingsOpen = useGameStore(state => state.isSettingsPanelOpen);
  const isTutorialOpen = useGameStore(state => state.isTutorialOpen);
  
  // Use methods from gameStore
  const setSettingsPanelOpen = useGameStore(state => state.setSettingsPanelOpen);
  const setTutorialOpen = useGameStore(state => state.setTutorialOpen);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Only show How to Play during active gameplay (not during Final Five or game over)
  const shouldShowHowToPlay = !isGameOver && !isFinalFiveActive && !showFinalFiveTransition;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Define all menu items, we'll filter based on game state later
  const allMenuItems: MenuItem[] = [
    { 
      label: 'How to Play?', 
      onClick: () => {
        setTutorialOpen(true);
        setIsDropdownOpen(false);
      },
      showArrow: false // This doesn't navigate away
    },
    { 
      label: 'F.A.Q.', 
      onClick: () => console.log('FAQ clicked'),
      showArrow: true  // This would navigate to another page
    },
    { 
      label: 'Report a Bug', 
      onClick: () => console.log('Report Bug clicked'),
      showArrow: true  // This would navigate to another page
    },
    { 
      label: 'Feedback', 
      onClick: () => console.log('Feedback clicked'),
      showArrow: true  // This would navigate to another page
    },
  ];
  
  // Filter menu items based on game state
  const menuItems = allMenuItems.filter(item => {
    // Only include How to Play if we should show it
    if (item.label === 'How to Play?') {
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
    dropdownRef,
    hardMode,
    isHardModeEnabled,
    menuItems,
    toggleDropdown,
    openSettings,
    closeSettings,
    closeTutorial
  };
}; 