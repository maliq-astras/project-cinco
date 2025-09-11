import { useSettingsPanelState } from './useSettingsPanelState';
import { useSettingsPanelEvents } from './useSettingsPanelEvents';
import { useSettingsPanelLogic } from './useSettingsPanelLogic';

interface UseSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useSettingsPanel = ({ isOpen, onClose }: UseSettingsPanelProps) => {
  const state = useSettingsPanelState();
  const events = useSettingsPanelEvents({ 
    onClose, 
    setIsSoundEnabled: state.setIsSoundEnabled,
    isSoundEnabled: state.isSoundEnabled,
    setIsLanguageDropdownOpen: state.setIsLanguageDropdownOpen
  });
  const logic = useSettingsPanelLogic({ isOpen });

  return {
    ...state,
    ...events,
    ...logic
  };
};