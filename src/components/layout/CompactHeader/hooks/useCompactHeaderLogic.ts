import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { generateMenuItems } from '../helpers';

interface UseCompactHeaderLogicParams {
  openSettings: () => void;
  openTutorial: () => void;
  openBugReportModal: () => void;
  openFeedbackModal: () => void;
}

export const useCompactHeaderLogic = ({
  openSettings,
  openTutorial,
  openBugReportModal,
  openFeedbackModal
}: UseCompactHeaderLogicParams) => {
  const { colors } = useTheme();
  const challenge = useGameStore(state => state.gameState.challenge);
  const hardMode = useGameStore(state => state.hardMode);
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const gameState = useGameStore(state => state.gameState);
  const isTutorialOpen = useGameStore((state) => state.isTutorialOpen);
  const isSettingsOpen = useGameStore((state) => state.isSettingsPanelOpen);

  const themeColors = useMemo(() => ({
    primary: colors.primary,
    secondary: colors.secondary
  }), [colors.primary, colors.secondary]);

  const menuItems = useMemo(() => 
    generateMenuItems({
      gameState,
      openSettings,
      openTutorial,
      openBugReportModal,
      openFeedbackModal
    }), 
    [gameState, openSettings, openTutorial, openBugReportModal, openFeedbackModal]
  );

  return {
    colors: themeColors,
    challenge,
    hardMode,
    isHardModeEnabled,
    isTutorialOpen,
    isSettingsOpen,
    menuItems
  };
};