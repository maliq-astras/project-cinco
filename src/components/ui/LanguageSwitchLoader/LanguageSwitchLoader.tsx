'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './LanguageSwitchLoader.module.css';

interface LanguageSwitchLoaderProps {
  isVisible: boolean;
}

/**
 * Language Switch Loader Component
 * 
 * Shows a theme-colored loading circle in the center of the screen
 * when the user switches languages, providing visual feedback
 * during the soft reset process.
 */
export default function LanguageSwitchLoader({ isVisible }: LanguageSwitchLoaderProps) {
  const { colors } = useTheme();

  if (!isVisible) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading Circle */}
      <div 
        className={styles.loadingCircle}
        style={{
          borderTopColor: `var(--color-${colors.primary})`,
          borderRightColor: `var(--color-${colors.primary})`,
        }}
      />
    </motion.div>
  );
}
