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
import { useCompactHeader } from './useCompactHeader';
import { getCategoryName } from '@/helpers/i18nHelpers';
import styles from './CompactHeader.module.css';
import { ANIMATIONS } from '@/constants/animations';
import { getHardModeBadgeStyle } from '@/utils/layout';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface CompactHeaderProps {
  headerEntranceComplete?: boolean;
}

const CompactHeader: React.FC<CompactHeaderProps> = React.memo(({ headerEntranceComplete = false }) => {
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
                initial={ANIMATIONS.LOGO.initial}
                animate={headerEntranceComplete ? ANIMATIONS.LOGO.animate : ANIMATIONS.LOGO.initial}
                transition={ANIMATIONS.LOGO.transition}
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
                  initial={ANIMATIONS.CATEGORY_TITLE.initial}
                  animate={headerEntranceComplete ? ANIMATIONS.CATEGORY_TITLE.animate : ANIMATIONS.CATEGORY_TITLE.initial}
                  transition={ANIMATIONS.CATEGORY_TITLE.transition}
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
                  style={getHardModeBadgeStyle(colors.primary)}
                  initial={ANIMATIONS.HARD_MODE_BADGE.initial}
                  animate={headerEntranceComplete ? ANIMATIONS.HARD_MODE_BADGE.animate : ANIMATIONS.HARD_MODE_BADGE.initial}
                  transition={ANIMATIONS.HARD_MODE_BADGE.transition}
                >
                  {t('ui.settings.hard')}
                </motion.div>
              )}
              
              <motion.button
                className={`${styles.hamburgerButton} ${isMenuOpen ? styles.active : ''}`}
                onClick={toggleMenu}
                aria-label={t('ui.buttons.menu')}
                initial={ANIMATIONS.HAMBURGER_BUTTON.initial}
                animate={headerEntranceComplete ? ANIMATIONS.HAMBURGER_BUTTON.animate : ANIMATIONS.HAMBURGER_BUTTON.initial}
                transition={ANIMATIONS.HAMBURGER_BUTTON.transition}
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
});

CompactHeader.displayName = 'CompactHeader';

export default CompactHeader;
