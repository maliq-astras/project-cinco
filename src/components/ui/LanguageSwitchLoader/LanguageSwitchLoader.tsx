'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageSwitchLoader } from './hooks';
import { loaderAnimations } from './helpers';
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
  const { isVisible: showLoader, loadingCircleStyle } = useLanguageSwitchLoader({ isVisible });

  if (!showLoader) return null;

  return (
    <motion.div
      className={styles.container}
      {...loaderAnimations.container}
    >
      {/* Loading Circle */}
      <div 
        className={styles.loadingCircle}
        style={loadingCircleStyle}
      />
    </motion.div>
  );
}
