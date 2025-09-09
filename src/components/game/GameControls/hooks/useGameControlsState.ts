import { useState, useRef } from 'react';
import { InputBarHandle } from '../../InputBar';

export const useGameControlsState = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSkipConfirmActive, setIsSkipConfirmActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  const duplicateErrorRef = useRef<HTMLDivElement | null>(null);
  const skipMessageRef = useRef<HTMLDivElement | null>(null);
  const inputBarRef = useRef<InputBarHandle | null>(null);

  return {
    inputValue,
    setInputValue,
    isSkipConfirmActive,
    setIsSkipConfirmActive,
    isTouchDevice,
    setIsTouchDevice,
    duplicateErrorRef,
    skipMessageRef,
    inputBarRef
  };
};