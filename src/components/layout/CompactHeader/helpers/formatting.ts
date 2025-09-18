import { MenuItem } from '@/types/navigation';
import { GameState } from '@/types';

interface GenerateMenuItemsParams {
  gameState: GameState;
  openSettings: () => void;
  openTutorial: () => void;
  openBugReportModal: () => void;
  openFeedbackModal: () => void;
}

export const generateMenuItems = ({
  gameState,
  openSettings,
  openTutorial,
  openBugReportModal,
  openFeedbackModal
}: GenerateMenuItemsParams): MenuItem[] => {

  return [
    {
      label: 'ui.buttons.settings',
      onClick: openSettings,
      showArrow: false,
      icon: 'settings' as const
    },
    ...(gameState.isGameOver ? [] : [{
      label: 'ui.navigation.howToPlay',
      onClick: openTutorial,
      showArrow: false,
      icon: 'help' as const
    }]),
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