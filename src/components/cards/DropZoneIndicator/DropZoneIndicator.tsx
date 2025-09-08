'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './DropZoneIndicator.module.css';
import { useDropZoneIndicator } from './hooks';
import { getDropZoneAnimationProps } from './helpers';

interface DropZoneIndicatorProps {
  isVisible: boolean;
  className?: string;
}

const DropZoneIndicator = React.memo<DropZoneIndicatorProps>(({ 
  isVisible,
  className = ''
}) => {
  const { t } = useDropZoneIndicator({ isVisible });
  const animationProps = getDropZoneAnimationProps(isVisible);
  
  return (
    <motion.div
      className={`${styles.container} ${className}`}
      {...animationProps}
    >
      <p className={styles.text}>
        {t('game.actions.dropToReveal', 'Drop here to reveal')}
      </p>
    </motion.div>
  );
});

DropZoneIndicator.displayName = 'DropZoneIndicator';

export default DropZoneIndicator; 