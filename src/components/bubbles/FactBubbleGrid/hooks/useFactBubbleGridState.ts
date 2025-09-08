import { useRef } from 'react';

export const useFactBubbleGridState = () => {
  const bubbleGridRef = useRef<HTMLDivElement>(null);
  const totalSlots = 8;

  return {
    bubbleGridRef,
    totalSlots
  };
};