import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

interface UseCompactHeaderEventsParams {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFeedbackModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBugReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCompactHeaderEvents = ({
  setIsMenuOpen,
  setIsFeedbackModalOpen,
  setIsBugReportModalOpen
}: UseCompactHeaderEventsParams) => {
  const setSettingsPanelOpen = useGameStore((state) => state.setSettingsPanelOpen);
  const setTutorialOpen = useGameStore((state) => state.setTutorialOpen);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, [setIsMenuOpen]);

  const openSettings = useCallback(() => {
    setSettingsPanelOpen(true);
    setIsMenuOpen(false);
  }, [setSettingsPanelOpen, setIsMenuOpen]);

  const closeSettings = useCallback(() => {
    setSettingsPanelOpen(false);
  }, [setSettingsPanelOpen]);

  const closeTutorial = useCallback(() => {
    setTutorialOpen(false);
  }, [setTutorialOpen]);

  const openTutorial = useCallback(() => {
    setTutorialOpen(true);
    setIsMenuOpen(false);
  }, [setTutorialOpen, setIsMenuOpen]);

  const openFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(true);
    setIsMenuOpen(false);
  }, [setIsFeedbackModalOpen, setIsMenuOpen]);

  const openBugReportModal = useCallback(() => {
    setIsBugReportModalOpen(true);
    setIsMenuOpen(false);
  }, [setIsBugReportModalOpen, setIsMenuOpen]);

  return {
    toggleMenu,
    openSettings,
    closeSettings,
    closeTutorial,
    openTutorial,
    openFeedbackModal,
    openBugReportModal
  };
};