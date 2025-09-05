'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './EmptyStackPlaceholder.module.css';

const EmptyStackPlaceholder: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.element}>
        <div className={styles.text}>
          {t('game.facts.placeholder', 'Revealed facts will appear here')}
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyStackPlaceholder; 