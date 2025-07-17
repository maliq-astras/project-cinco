'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { dropZoneIndicatorStyles } from './dropZoneIndicatorStyles';

interface DropZoneIndicatorProps {
  isVisible: boolean;
  className?: string;
}

/**
 * Component that displays a visual indicator for the drop zone
 * Appears when a bubble is being dragged to help users understand where to drop it
 */
export default function DropZoneIndicator({ 
  isVisible,
  className = ''
}: DropZoneIndicatorProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      className={`${dropZoneIndicatorStyles.container} ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.98
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      <motion.div
        className={dropZoneIndicatorStyles.textContainer}
        initial={{ opacity: 0, y: 5 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 5
        }}
        transition={{ 
          duration: 0.2,
          delay: 0.1,
          ease: "easeOut"
        }}
      >
        <p className={dropZoneIndicatorStyles.text}>
          {t('game.actions.dropToReveal', 'Drop here to reveal')}
        </p>
      </motion.div>
    </motion.div>
  );
} 