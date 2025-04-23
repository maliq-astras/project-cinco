'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useBubbleContext, useGameInstructions } from '../hooks';
import { contextAreaStyles } from '../styles/contextAreaStyles';

/**
 * Component for showing bubble category when hovering 
 */
export const BubbleContextArea: React.FC = () => {
  const { message, textClassName } = useBubbleContext();
  
  return (
    <span className={textClassName}>
      {message}
    </span>
  );
};

/**
 * Component for showing game instructions based on current game state
 */
export const GameInstructionsArea: React.FC = () => {
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
          className="inline-block mr-2 w-4 h-4"
          style={contextAreaStyles.loadingSpinner(textColor)}
          {...loadingAnimation}
        />
      )}
      {message}
    </motion.span>
  );
};

/**
 * Combined ContextArea component that selects which context to display
 * Default export maintained for backward compatibility
 */
const ContextArea: React.FC = () => {
  return <GameInstructionsArea />;
};

export default ContextArea; 