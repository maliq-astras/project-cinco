import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import Logo from '../Logo';
import { useHeader } from './hooks';
import styles from './Header.module.css';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface HeaderProps {
  headerEntranceComplete?: boolean;
}

const Header: React.FC<HeaderProps> = React.memo(({ headerEntranceComplete = false }) => {
  const {
    challenge,
    logoRef,
    categoryTitleRef,
    titleStyle,
    headerClasses,
    categoryName,
    logoAnimationProps,
    titleAnimationProps
  } = useHeader({ headerEntranceComplete });

  return (
    <div className={headerClasses.container}>
      <header className={styles.header}>
        <div className={headerClasses.content}>
          <motion.div 
            ref={logoRef}
            id="header-area" 
            className={headerClasses.logoContainer}
            {...logoAnimationProps}
          >
            <Logo height="100%"/>
          </motion.div>
          
          {challenge?.category && (
            <motion.h1 
              ref={categoryTitleRef}
              id="category-title"
              className={`${headerClasses.title} ${righteous.className} header-title`}
              style={titleStyle}
              {...titleAnimationProps}
            >
              {categoryName}
            </motion.h1>
          )}
        </div>
      </header>
    </div>
  );
});

Header.displayName = 'Header';

export default Header; 