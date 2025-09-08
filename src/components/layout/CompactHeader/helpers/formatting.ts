import { MenuItem } from '@/types/navigation';

interface GenerateMenuItemsParams {
  gameState: any;
  openSettings: () => void;
  openTutorial: () => void;
  openFeedbackModal: () => void;
  openBugReportModal: () => void;
}

export const generateMenuItems = ({
  gameState,
  openSettings,
  openTutorial,
  openFeedbackModal,
  openBugReportModal
}: GenerateMenuItemsParams): MenuItem[] => {
  return [
    {
      label: 'ui.buttons.settings',
      onClick: openSettings
    },
    ...(gameState.isGameOver ? [] : [{
      label: 'ui.navigation.howToPlay',
      onClick: openTutorial
    }]),
    {
      label: 'ui.navigation.feedback',
      onClick: openFeedbackModal
    },
    {
      label: 'ui.navigation.reportBug',
      onClick: openBugReportModal
    }
  ];
};