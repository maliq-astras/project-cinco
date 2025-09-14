import { ANIMATIONS } from '@/constants/animations';
import { 
  getResponsiveNavClasses,
  getHardModeBadgeAnimationProps,
  getDropdownIconAnimationProps,
  getSettingsButtonAnimationProps,
  getSettingsIconAnimationProps
} from '../helpers';
import { MenuItem } from '@/types/navigation';

interface UseNavigationLogicProps {
  breakpoint: string;
  responsiveValues: any;
  colors: {
    primary: string;
  };
  isGameOver: boolean;
  isFinalFiveActive: boolean;
  showFinalFiveTransition: boolean;
  isDropdownOpen: boolean;
  headerEntranceComplete: boolean;
  setTutorialOpen: (value: boolean) => void;
  setIsDropdownOpen: (value: boolean) => void;
  setSettingsPanelOpen: (value: boolean) => void;
  setIsBugReportModalOpen: (value: boolean) => void;
  setIsFeedbackModalOpen: (value: boolean) => void;
}

export const useNavigationLogic = ({
  breakpoint,
  responsiveValues,
  colors,
  isGameOver,
  isFinalFiveActive,
  showFinalFiveTransition,
  isDropdownOpen,
  headerEntranceComplete,
  setTutorialOpen,
  setIsDropdownOpen,
  setSettingsPanelOpen,
  setIsBugReportModalOpen,
  setIsFeedbackModalOpen
}: UseNavigationLogicProps) => {
  // Animation object from constants
  const navigationAnimation = ANIMATIONS.NAVIGATION;

  // Get responsive CSS classes
  const navClasses = getResponsiveNavClasses(breakpoint);

  // Only show How to Play during active gameplay (not during Final Five or game over)
  const shouldShowHowToPlay = !isGameOver && !isFinalFiveActive && !showFinalFiveTransition;

  const openBugReportModal = () => {
    setIsBugReportModalOpen(true);
    setIsDropdownOpen(false);
  };
  
  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Define all menu items
  const allMenuItems: MenuItem[] = [
    { 
      label: 'ui.navigation.howToPlay', 
      onClick: () => {
        setTutorialOpen(true);
        setIsDropdownOpen(false);
      },
      showArrow: false,
      ariaLabel: 'ui.navigation.howToPlay'
    },
    { 
      label: 'ui.navigation.reportBug', 
      onClick: openBugReportModal,
      showArrow: false,
      ariaLabel: 'ui.navigation.reportBug'
    },
    { 
      label: 'ui.navigation.feedback', 
      onClick: openFeedbackModal,
      showArrow: false,
      ariaLabel: 'ui.navigation.feedback'
    },
  ];
  
  // Filter menu items based on game state
  const menuItems = allMenuItems.filter(item => {
    if (item.label === 'ui.navigation.howToPlay') {
      return shouldShowHowToPlay;
    }
    return true;
  });

  // Event handlers
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

  // Animation props using helpers
  const hardModeBadgeAnimationProps = getHardModeBadgeAnimationProps(headerEntranceComplete);
  const dropdownIconAnimationProps = getDropdownIconAnimationProps(headerEntranceComplete);
  const settingsButtonAnimationProps = getSettingsButtonAnimationProps(headerEntranceComplete);
  const settingsIconAnimationProps = getSettingsIconAnimationProps(headerEntranceComplete);

  return {
    navigationAnimation,
    navClasses,
    menuItems,
    toggleDropdown,
    openSettings,
    closeSettings,
    closeTutorial,
    hardModeBadgeAnimationProps,
    dropdownIconAnimationProps,
    settingsButtonAnimationProps,
    settingsIconAnimationProps
  };
};