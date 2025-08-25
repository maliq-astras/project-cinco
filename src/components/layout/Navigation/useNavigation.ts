import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { GameState } from '@/helpers/gameLogic';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';

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
  
  // Use our new unified responsive system
  const { 
    breakpoint, 
    heightBreakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  } = useResponsive();
  
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
  const { registerElement, unregisterElement, getElement } = useDOMRefs();

  // Register body element for global click detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.document?.body) {
      registerElement('body', window.document.body);
    }
    return () => {
      unregisterElement('body');
    };
  }, [registerElement, unregisterElement]);
  
  // Only show How to Play during active gameplay (not during Final Five or game over)
  const shouldShowHowToPlay = !isGameOver && !isFinalFiveActive && !showFinalFiveTransition;

  // Add click listener to body when dropdown is open
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleGlobalClick = (event: Event) => {
      const clickedElement = event.target as Node;
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(clickedElement);
      
      if (isOutsideDropdown) {
        setIsDropdownOpen(false);
      }
    };

    const bodyElement = getElement('body');
    if (bodyElement) {
      bodyElement.addEventListener('click', handleGlobalClick);
    }

    return () => {
      if (bodyElement) {
        bodyElement.removeEventListener('click', handleGlobalClick);
      }
    };
  }, [isDropdownOpen, getElement]);

  // Keep the old handler for backwards compatibility (though not used now)
  const handleClickOutside = (event: React.MouseEvent, menuRef?: React.RefObject<HTMLDivElement>) => {
    const clickedElement = event.target as Node;
    const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(clickedElement);
    const isOutsideMenu = !menuRef?.current || !menuRef.current.contains(clickedElement);
    
    if (isOutsideDropdown && isOutsideMenu) {
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
    setIsDropdownOpen, // Add missing function
    handleClickOutside, // Now returns the handler for component use
    
    // Responsive values from our new system
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  };
}; 