'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './DropZoneIndicator.module.css';

interface DropZoneIndicatorProps {
  isVisible: boolean;
  className?: string;
}

export default function DropZoneIndicator({ 
  isVisible,
  className = ''
}: DropZoneIndicatorProps) {
  const { t } = useTranslation();
  
  return (
    <motion.div
      className={`${styles.container} ${className}`}
      initial={{ opacity: 0, scale: 0.98, y: 5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.98,
        y: isVisible ? 0 : 5
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      <p className={styles.text}>
        {t('game.actions.dropToReveal', 'Drop here to reveal')}
      </p>
    </motion.div>
  );
} 