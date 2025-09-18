import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useResponsive } from '@/hooks/responsive';

export const useResumeGameModalState = () => {
  const { colors } = useTheme();
  const { width, height } = useResponsive();

  // Get the frozen time when modal opened, not the live updating timer
  const [frozenTime] = useState(() => useGameStore.getState().timeRemaining);

  // Calculate modal size - use 85% of smaller viewport dimension, with min/max constraints
  const smallerDimension = Math.min(width, height);
  const modalSize = Math.min(Math.max(smallerDimension * 0.85, 300), 600);

  // Scale everything based on modal size
  const logoHeight = modalSize * 0.3; // 30% of modal height
  const timerFontSize = modalSize * 0.16; // 16% of modal size
  const buttonPadding = modalSize * 0.04; // 4% of modal size
  const buttonFontSize = modalSize * 0.035; // 3.5% of modal size
  const labelFontSize = modalSize * 0.025; // 2.5% of modal size

  return {
    colors,
    frozenTime,
    modalSize,
    logoHeight,
    timerFontSize,
    buttonPadding,
    buttonFontSize,
    labelFontSize,
  };
};