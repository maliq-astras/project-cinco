import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Righteous } from 'next/font/google';
import Logo from '../Logo';
import GameTutorial from '../../game/GameTutorial';
import SettingsPanel from '../../modals/SettingsPanel';
import FeedbackModal from '../../modals/FeedbackModal';
import BugReportModal from '../../modals/BugReportModal';
import SlideOutMenu from '../SlideOutMenu';
import { useCompactHeader, type MenuItem } from './useCompactHeader';
import { getCategoryName } from '@/helpers/i18nHelpers';
import styles from './CompactHeader.module.css';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface CompactHeaderProps {
  headerEntranceComplete?: boolean;
}

const CompactHeader: React.FC<CompactHeaderProps> = ({ headerEntranceComplete = false }) => {
  const { t } = useTranslation();
  const {
    colors,
    challenge,
    logoRef,
    categoryTitleRef,
    isMenuOpen,
    toggleMenu,
    menuItems,
    isSettingsOpen,
    closeSettings,
    isTutorialOpen,
    closeTutorial,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isBugReportModalOpen,
    setIsBugReportModalOpen,
    compactSizes,
    hardMode,
    isHardModeEnabled
  } = useCompactHeader();

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.content}>
            {/* Left side - Logo and Category title */}
            <div className={styles.leftSection}>
              <motion.div 
                ref={logoRef}
                id="header-area"
                className={styles.logoContainer}
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={headerEntranceComplete ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: -20 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Logo height="128px" />
              </motion.div>
              
              {/* Category title */}
              {challenge?.category && (
                <motion.h1 
                  ref={categoryTitleRef}
                  id="category-title"
                  className={`${styles.categoryTitle} ${righteous.className}`}
                  style={{
                    fontSize: compactSizes.titleFontSize,
                    maxWidth: compactSizes.titleMaxWidth
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={headerEntranceComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {getCategoryName(challenge.category, t)}
                </motion.h1>
              )}
            </div>
            
            {/* Right side - Hard Mode Badge + Hamburger menu */}
            <div className={styles.rightSection}>
              {/* Hard Mode Badge */}
              {(hardMode || isHardModeEnabled) && (
                <motion.div 
                  className={styles.hardModeBadge}
                  style={{
                    backgroundColor: `var(--color-${colors.primary})`
                  }}
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={headerEntranceComplete ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {t('ui.settings.hard')}
                </motion.div>
              )}
              
              <motion.button
                className={`${styles.hamburgerButton} ${isMenuOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                aria-label={t('ui.buttons.menu')}
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={headerEntranceComplete ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <motion.svg
                  className={styles.hamburgerIcon}
                  style={{
                    width: compactSizes.iconSize,
                    height: compactSizes.iconSize
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </motion.svg>
              </motion.button>
            </div>
          </div>
        </header>
        
      </div>
      
      {/* Slide-out menu */}
      <SlideOutMenu 
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        menuItems={menuItems}
        colors={colors}
      />
      
      {/* Modals */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
      
      <GameTutorial 
        isOpen={isTutorialOpen}
        onClose={closeTutorial}
      />
      
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      
      <BugReportModal 
        isOpen={isBugReportModalOpen}
        onClose={() => setIsBugReportModalOpen(false)}
      />
    </>
  );
};

export default CompactHeader;
