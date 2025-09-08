'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './EmptyStackPlaceholder.module.css';
import { useEmptyStackPlaceholder } from './hooks';
import { getEmptyStackPlaceholderAnimationProps } from './helpers';

const EmptyStackPlaceholder = React.memo(() => {
  const { t } = useEmptyStackPlaceholder();
  const animationProps = getEmptyStackPlaceholderAnimationProps();

  return (
    <motion.div 
      className={styles.container}
      {...animationProps}
    >
      <div className={styles.element}>
        <div className={styles.text}>
          {t('game.facts.placeholder', 'Revealed facts will appear here')}
        </div>
      </div>
    </motion.div>
  );
});

EmptyStackPlaceholder.displayName = 'EmptyStackPlaceholder';

export default EmptyStackPlaceholder; 