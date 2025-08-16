'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './EmptyStackPlaceholder.module.css';

/**
 * Placeholder component displayed when no fact cards are visible
 */
const EmptyStackPlaceholder: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.element}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.text}>
          {t('game.facts.placeholder', 'Revealed facts will appear here')}
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyStackPlaceholder; 