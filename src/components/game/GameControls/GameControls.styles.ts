/**
 * Hybrid styles for GameControls component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from GameControls.module.css
 * - Animation-critical styles remain as objects
 */

import styles from './GameControls.module.css';

export const gameControlsStyles = {
  // Static styles from CSS modules
  container: styles.container,
  wrapper: styles.wrapper,
  controlsArea: styles.controlsArea,
  factsArea: styles.factsArea,
  
  // Animation-critical styles
  wrapperAnimation: {
    initial: { opacity: 1 },
    animate: (isVictoryAnimationActive: boolean) => ({ 
      opacity: isVictoryAnimationActive ? 0 : 1 
    }),
    transition: { duration: 0.5 }
  }
} as const; 