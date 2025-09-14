import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Righteous } from 'next/font/google';
import Logo from '../Logo';
import GameTutorial from '../../game/GameTutorial';
import SettingsPanel from '../../modals/SettingsPanel';
import BugReportModal from '../../modals/BugReportModal';
import FeedbackModal from '../../modals/FeedbackModal';
import SlideOutMenu from '../SlideOutMenu';
import { useCompactHeader } from './hooks';
import { getCategoryName } from '@/helpers/i18nHelpers';
import styles from './CompactHeader.module.css';
import { ANIMATIONS } from '@/constants/animations';
import { SIZES } from '@/constants/sizes';
import { SVG } from '@/constants/svg';
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
    openSettings,
    closeSettings,
    isTutorialOpen,
    closeTutorial,
    isBugReportModalOpen,
    setIsBugReportModalOpen,
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    compactSizes,
    hardMode,
    isHardModeEnabled
  } = useCompactHeader();

  return (
    <>
      <div className={styles.container}>
        <header className={styles.header}>
          {/* Top row - HARD badge and hamburger menu */}
          <div className={styles.topControls}>
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
            
            {/* Hamburger menu */}
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
                viewBox={SVG.HAMBURGER_MENU.viewBox}
                animate={isMenuOpen ? { rotate: ANIMATIONS.HAMBURGER_ICON.rotate.open } : { rotate: ANIMATIONS.HAMBURGER_ICON.rotate.closed }}
                transition={ANIMATIONS.HAMBURGER_ICON.transition}
              >
                <path 
                  strokeLinecap={SVG.HAMBURGER_MENU.strokeLinecap} 
                  strokeLinejoin={SVG.HAMBURGER_MENU.strokeLinejoin} 
                  strokeWidth={SVG.HAMBURGER_MENU.strokeWidth} 
                  d={SVG.HAMBURGER_MENU.path} 
                />
              </motion.svg>
            </motion.button>
          </div>

          {/* Bottom row - Logo and Category title */}
          <div className={styles.content}>
            <div className={styles.leftSection}>
              <motion.div 
                ref={logoRef}
                id="header-area"
                className={styles.logoContainer}
                initial={ANIMATIONS.LOGO.initial}
                animate={headerEntranceComplete ? ANIMATIONS.LOGO.animate : ANIMATIONS.LOGO.initial}
                transition={ANIMATIONS.LOGO.transition}
              >
                <Logo height={SIZES.DIMENSIONS.LOGO_HEIGHT_COMPACT} />
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
      
      <BugReportModal 
        isOpen={isBugReportModalOpen}
        onClose={() => setIsBugReportModalOpen(false)}
      />
      
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
      
    </>
  );
});

CompactHeader.displayName = 'CompactHeader';

export default CompactHeader;