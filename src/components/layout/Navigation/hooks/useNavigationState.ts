import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { GameState } from '@/helpers/gameLogic';
import { useDOMRefs } from '@/providers/DOMRefsProvider';
import { useResponsive } from '@/hooks/responsive';
import { MenuItem } from '@/types/navigation';

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

export const useNavigationState = () => {
  const { colors } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
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
  

  return {
    // Theme
    colors,
    
    // Local state
    isDropdownOpen,
    setIsDropdownOpen,
    isBugReportModalOpen,
    setIsBugReportModalOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    
    // Game store state
    isTutorialOpen,
    isSettingsOpen,
    hardMode,
    isHardModeEnabled,
    isGameOver,
    isFinalFiveActive,
    showFinalFiveTransition,
    
    // Game store methods
    setSettingsPanelOpen,
    setTutorialOpen,
    
    // Refs
    dropdownRef,
    
    // Responsive values
    breakpoint,
    heightBreakpoint,
    isLandscape,
    isPortrait,
    responsiveValues,
    willFit,
    availableContentHeight
  };
}; 