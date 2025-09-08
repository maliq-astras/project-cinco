import { CSSProperties } from 'react';

// Shared theme utilities
export const getColorVar = (color: string, opacity?: string): string => {
  return `var(--color-${color}${opacity ? opacity : ''})`;
};

// Shared styling utilities (used by multiple components)
export const getHardModeBadgeStyle = (primaryColor: string): CSSProperties => ({
  backgroundColor: getColorVar(primaryColor)
});

// Shared component visibility utilities (used by GameContent + MobileGameContent)
export const shouldShowGameInstructions = (
  isFinalFiveActive: boolean,
  isAlreadyPlayedScenario: boolean,
  isVictoryAnimationActive: boolean
): boolean => {
  return !isFinalFiveActive && !isAlreadyPlayedScenario && !isVictoryAnimationActive;
};

export const shouldShowGameControls = (
  showGameMessage: boolean,
  isFinalFiveActive: boolean,
  isAlreadyPlayedScenario: boolean,
  isVictoryAnimationActive: boolean
): boolean => {
  return !showGameMessage && !isFinalFiveActive && !isAlreadyPlayedScenario && !isVictoryAnimationActive;
};

export const shouldShowContextLine = (
  isAlreadyPlayedScenario: boolean,
  isVictoryAnimationActive: boolean
): boolean => {
  return !isAlreadyPlayedScenario && !isVictoryAnimationActive;
};