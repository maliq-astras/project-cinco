import { useEffect, useImperativeHandle, Ref } from 'react';
import { InputBarHandle } from '../../InputBar';

export interface GameControlsHandle {
  focusInput: () => void;
}

interface UseGameControlsEventsProps {
  ref: Ref<GameControlsHandle>;
  inputBarRef: React.RefObject<InputBarHandle | null>;
  isSkipConfirmActive: boolean;
  setIsSkipConfirmActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTouchDevice: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: () => boolean;
}

export const useGameControlsEvents = ({
  ref,
  inputBarRef,
  isSkipConfirmActive,
  setIsSkipConfirmActive,
  setIsTouchDevice,
  isInputDisabled
}: UseGameControlsEventsProps) => {
  // Imperative handle for focusing input
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputBarRef.current && !isInputDisabled()) {
        inputBarRef.current.focusInput();
      }
    }
  }));

  // Skip confirmation timeout
  useEffect(() => {
    if (isSkipConfirmActive) {
      const timer = setTimeout(() => {
        setIsSkipConfirmActive(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSkipConfirmActive, setIsSkipConfirmActive]);

  // Detect touch device on mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, [setIsTouchDevice]);
};