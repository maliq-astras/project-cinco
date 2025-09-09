import { useRef } from 'react';

export const useGameButtonsState = () => {
  const controlsRef = useRef<HTMLDivElement>(null);

  return {
    controlsRef
  };
};