'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { factCardStackContainerStyles } from '../styles/factCardStackContainerStyles';

/**
 * Placeholder component displayed when no fact cards are visible
 */
const EmptyStackPlaceholder: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className={factCardStackContainerStyles.placeholder.container}>
      <motion.div 
        className={factCardStackContainerStyles.placeholder.element}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={factCardStackContainerStyles.placeholder.text}>
          {t('game.facts.placeholder', 'Revealed facts will appear here')}
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyStackPlaceholder; 