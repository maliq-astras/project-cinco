import { MenuItem } from '@/types/navigation';
import { GameState } from '@/types';

interface GenerateMenuItemsParams {
  gameState: GameState;
  isFinalFiveActive: boolean;
  isFinalFiveCompleted: boolean;
  isPendingFinalFiveTransition: boolean;
  showFinalFiveTransition: boolean;
  openSettings: () => void;
  openTutorial: () => void;
  openBugReportModal: () => void;
  openFeedbackModal: () => void;
}

export const generateMenuItems = ({
  gameState,
  isFinalFiveActive,
  isFinalFiveCompleted,
  isPendingFinalFiveTransition,
  showFinalFiveTransition,
  openSettings,
  openTutorial,
  openBugReportModal,
  openFeedbackModal
}: GenerateMenuItemsParams): MenuItem[] => {
  // Only show How to Play during active gameplay (not during Final Five or game over)
  // Hide when: game is over, Final Five is active/completed/pending, or transition is showing
  const shouldShowHowToPlay = !gameState.isGameOver && !isFinalFiveActive && !isFinalFiveCompleted && !isPendingFinalFiveTransition && !showFinalFiveTransition;

  return [
    {
      label: 'ui.buttons.settings',
      onClick: openSettings,
      showArrow: false,
      icon: 'settings' as const
    },
    ...(shouldShowHowToPlay ? [{
      label: 'ui.navigation.howToPlay',
      onClick: openTutorial,
      showArrow: false,
      icon: 'help' as const
    }] : []),
    {
      label: 'ui.navigation.feedback',
      onClick: openFeedbackModal,
      showArrow: false,
      icon: 'feedback' as const
    },
    {
      label: 'ui.navigation.reportBug',
      onClick: openBugReportModal,
      showArrow: false,
      icon: 'bug' as const
    }
  ];
};