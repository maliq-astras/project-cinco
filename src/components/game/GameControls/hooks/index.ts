import { Ref } from 'react';
import { useGameControlsState } from './useGameControlsState';
import { useGameControlsEvents, GameControlsHandle } from './useGameControlsEvents';
import { useGameControlsLogic } from './useGameControlsLogic';
import { InputBarHandle } from '../../InputBar';

interface UseGameControlsReturn {
  inputBarRef: React.RefObject<InputBarHandle | null>;
  timeRemaining: number;
  isVictoryAnimationActive: boolean;
  colors: { primary: string };
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSkip: () => void;
  getInputPlaceholder: () => string;
  isInputDisabled: () => boolean;
  isSkipDisabled: () => boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  isSkipConfirmActive: boolean;
  isTouchDevice: boolean;
  duplicateErrorRef: React.RefObject<HTMLDivElement | null>;
  skipMessageRef: React.RefObject<HTMLDivElement | null>;
  responsiveValues: { spacing: number };
  breakpoint: string;
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useGameControls = (ref: Ref<GameControlsHandle>): UseGameControlsReturn => {
  const state = useGameControlsState();
  
  const logic = useGameControlsLogic({
    inputValue: state.inputValue,
    setInputValue: state.setInputValue,
    isSkipConfirmActive: state.isSkipConfirmActive,
    setIsSkipConfirmActive: state.setIsSkipConfirmActive,
    duplicateErrorRef: state.duplicateErrorRef,
    skipMessageRef: state.skipMessageRef
  });

  useGameControlsEvents({
    ref,
    inputBarRef: state.inputBarRef,
    isSkipConfirmActive: state.isSkipConfirmActive,
    setIsSkipConfirmActive: state.setIsSkipConfirmActive,
    setIsTouchDevice: state.setIsTouchDevice,
    isInputDisabled: logic.isInputDisabled
  });

  return {
    // State
    inputBarRef: state.inputBarRef,
    inputValue: state.inputValue,
    setInputValue: state.setInputValue,
    isSkipConfirmActive: state.isSkipConfirmActive,
    isTouchDevice: state.isTouchDevice,
    duplicateErrorRef: state.duplicateErrorRef,
    skipMessageRef: state.skipMessageRef,
    
    // Logic
    timeRemaining: logic.timeRemaining,
    isVictoryAnimationActive: logic.isVictoryAnimationActive,
    colors: logic.colors,
    responsiveValues: logic.responsiveValues,
    breakpoint: logic.breakpoint,
    isLandscape: logic.isLandscape,
    isPortrait: logic.isPortrait,
    handleSubmit: logic.handleSubmit,
    handleSkip: logic.handleSkip,
    getInputPlaceholder: logic.getInputPlaceholder,
    isInputDisabled: logic.isInputDisabled,
    isSkipDisabled: logic.isSkipDisabled
  };
};

export type { GameControlsHandle };