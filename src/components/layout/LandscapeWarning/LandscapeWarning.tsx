'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './LandscapeWarning.module.css';

interface LandscapeWarningProps {
  context?: 'game';
}

const LandscapeWarning: React.FC<LandscapeWarningProps> = ({ context = 'game' }) => {
  const { t } = useTranslation();
  
  return (
      <motion.div 
        className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.content}>
        <svg 
          className={styles.icon}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
          </svg>
        <h2 className={styles.title}>
          {t('ui.landscapeWarning.title')}
        </h2>
        <p className={styles.message}>
          {context === 'game' 
            ? t('ui.landscapeWarning.gameMessage')
            : t('ui.landscapeWarning.gameMessage')}
        </p>
      </div>
      </motion.div>
  );
};

export default LandscapeWarning; 