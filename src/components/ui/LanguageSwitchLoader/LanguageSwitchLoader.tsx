'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-white dark:bg-black z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading Circle */}
      <div 
        className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"
        style={{
          borderTopColor: `var(--color-${colors.primary})`,
          borderRightColor: `var(--color-${colors.primary})`,
        }}
      />
    </motion.div>
  );
}
