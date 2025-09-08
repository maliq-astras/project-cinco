'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBubbleContext, useGameInstructions } from './hooks';
import styles from './ContextArea.module.css';

//Bubble Category
export const BubbleContextArea = React.memo(() => {
  const { message, textClassName } = useBubbleContext();
  
  return (
    <span className={textClassName}>
      {message}
    </span>
  );
});

BubbleContextArea.displayName = 'BubbleContextArea';

//Game Instructions
export const GameInstructionsArea = React.memo(() => {
  const { 
    message, 
    textClassName, 
    animationProps, 
    loadingAnimation, 
    isProcessingGuess, 
    textColor 
  } = useGameInstructions();
  
  return (
    <motion.span 
      className={textClassName}
      {...animationProps}
    >
      {isProcessingGuess && (
        <motion.span 
          className={styles.loadingSpinner}
          style={{ '--spinner-color': `var(--color-${textColor})` } as React.CSSProperties}
          {...loadingAnimation}
        />
      )}
      {message}
    </motion.span>
  );
});

GameInstructionsArea.displayName = 'GameInstructionsArea';