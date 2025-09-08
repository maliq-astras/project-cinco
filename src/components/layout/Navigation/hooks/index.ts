import { useNavigationState } from './useNavigationState';
import { useNavigationEvents } from './useNavigationEvents';
import { useNavigationLogic } from './useNavigationLogic';

interface UseNavigationProps {
  headerEntranceComplete?: boolean;
}

export const useNavigation = ({ headerEntranceComplete = false }: UseNavigationProps = {}) => {
  const state = useNavigationState();
  
  const logic = useNavigationLogic({
    breakpoint: state.breakpoint,
    responsiveValues: state.responsiveValues,
    colors: state.colors,
    isGameOver: state.isGameOver,
    isFinalFiveActive: state.isFinalFiveActive,
    showFinalFiveTransition: state.showFinalFiveTransition,
    isDropdownOpen: state.isDropdownOpen,
    headerEntranceComplete,
    setTutorialOpen: state.setTutorialOpen,
    setIsBugReportModalOpen: state.setIsBugReportModalOpen,
    setIsFeedbackModalOpen: state.setIsFeedbackModalOpen,
    setIsDropdownOpen: state.setIsDropdownOpen,
    setSettingsPanelOpen: state.setSettingsPanelOpen
  });

  // Events hook for side effects
  useNavigationEvents({
    isDropdownOpen: state.isDropdownOpen,
    dropdownRef: state.dropdownRef,
    setIsDropdownOpen: state.setIsDropdownOpen
  });

  return {
    // Props
    headerEntranceComplete,
    
    // State
    colors: state.colors,
    isDropdownOpen: state.isDropdownOpen,
    isTutorialOpen: state.isTutorialOpen,
    isSettingsOpen: state.isSettingsOpen,
    isFeedbackModalOpen: state.isFeedbackModalOpen,
    isBugReportModalOpen: state.isBugReportModalOpen,
    dropdownRef: state.dropdownRef,
    hardMode: state.hardMode,
    isHardModeEnabled: state.isHardModeEnabled,
    responsiveValues: state.responsiveValues,
    setIsFeedbackModalOpen: state.setIsFeedbackModalOpen,
    setIsBugReportModalOpen: state.setIsBugReportModalOpen,
    setIsDropdownOpen: state.setIsDropdownOpen,
    
    // Logic
    navigationAnimation: logic.navigationAnimation,
    navClasses: logic.navClasses,
    menuItems: logic.menuItems,
    toggleDropdown: logic.toggleDropdown,
    openSettings: logic.openSettings,
    closeSettings: logic.closeSettings,
    closeTutorial: logic.closeTutorial,
    hardModeBadgeAnimationProps: logic.hardModeBadgeAnimationProps,
    dropdownIconAnimationProps: logic.dropdownIconAnimationProps,
    settingsButtonAnimationProps: logic.settingsButtonAnimationProps,
    settingsIconAnimationProps: logic.settingsIconAnimationProps
  };
};