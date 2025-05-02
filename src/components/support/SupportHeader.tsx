'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Righteous } from 'next/font/google';
import Logo from '../Logo';
import { useSupportHeader } from '../../hooks/components/support/useSupportHeader';
import { supportHeaderStyles } from '../../styles/supportHeaderStyles';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

const SupportHeader: React.FC = () => {
  const { colors, isThemeReady } = useSupportHeader();
  
  return (
    <AnimatePresence>
      {isThemeReady && (
        <motion.div 
          className={supportHeaderStyles.container}
          initial={supportHeaderStyles.headerAnimation.initial}
          animate={supportHeaderStyles.headerAnimation.animate}
          transition={supportHeaderStyles.headerAnimation.transition}
        >
          <div className={supportHeaderStyles.contentContainer}>
            <div className={supportHeaderStyles.logoContainer}>
              <Logo height="100%"/>
            </div>
            
            <h1 
              className={`${supportHeaderStyles.title} ${righteous.className}`}
              style={supportHeaderStyles.getTitleStyle(colors.primary)}
            >
              SUPPORT
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SupportHeader; 