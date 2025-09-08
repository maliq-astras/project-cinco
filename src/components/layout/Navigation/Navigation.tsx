import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GameTutorial from '../../game/GameTutorial';
import SettingsPanel from '../../modals/SettingsPanel';
import NavDropdownMenu from '../NavDropdownMenu';
import FeedbackModal from '@/components/modals/FeedbackModal';
import BugReportModal from '@/components/modals/BugReportModal';
import { useNavigation } from './hooks';
import styles from './Navigation.module.css';
import { 
  getDropdownButtonStyle, 
  getDropdownButtonClass, 
  getNavIconStyle
} from './helpers';
import { getHardModeBadgeStyle } from '@/utils/layout';



interface NavigationProps {
  headerEntranceComplete?: boolean;
}

const Navigation = React.memo(function Navigation({ headerEntranceComplete = false }: NavigationProps) {
  const { t } = useTranslation();
  const {
    colors,
    isDropdownOpen,
    isTutorialOpen,
    isSettingsOpen,
    isFeedbackModalOpen,
    isBugReportModalOpen,
    dropdownRef,
    hardMode,
    isHardModeEnabled,
    responsiveValues,
    setIsFeedbackModalOpen,
    setIsBugReportModalOpen,
    setIsDropdownOpen,
    navigationAnimation,
    navClasses,
    menuItems,
    toggleDropdown,
    openSettings,
    closeSettings,
    closeTutorial,
    hardModeBadgeAnimationProps,
    dropdownIconAnimationProps,
    settingsButtonAnimationProps,
    settingsIconAnimationProps
  } = useNavigation({ headerEntranceComplete });

  return (
    <>
      <div className={navClasses.container}>
        <div className={navClasses.innerContainer}>
          <div className={navClasses.navBar}>
            {/* Hard Mode Badge */}
            <div className={styles.badgeContainer}>
              {(hardMode || isHardModeEnabled) && (
                <motion.div 
                  className={styles.hardModeBadgeText}
                  style={getHardModeBadgeStyle(colors.primary)}
                  {...hardModeBadgeAnimationProps}
                >
                  {t('ui.settings.hardMode')}
                </motion.div>
              )}
            </div>
            
            <nav className={navClasses.nav}>
              <div className={styles.dropdownContainer} ref={dropdownRef}>
                <motion.button 
                  className={getDropdownButtonClass(isDropdownOpen)} 
                  style={getDropdownButtonStyle(isDropdownOpen, colors.primary, responsiveValues.navigation.dropdownButtonPadding)}
                  onClick={toggleDropdown}
                  aria-label={t('ui.buttons.info')}
                  {...navigationAnimation}
                  animate={headerEntranceComplete ? navigationAnimation.animate : navigationAnimation.initial}
                >
                  <motion.svg 
                    className={navClasses.iconSize} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    {...dropdownIconAnimationProps}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                </motion.button>

                {/* Use the NavDropdownMenu component */}
                <NavDropdownMenu 
                  isOpen={isDropdownOpen}
                  menuItems={menuItems}
                  colors={colors}
                  onClose={() => setIsDropdownOpen(false)}
                />
              </div>
              <motion.button 
                className={navClasses.navIconClass}
                style={getNavIconStyle(colors.primary)}
                onClick={openSettings}
                aria-label={t('ui.buttons.settings')}
                {...settingsButtonAnimationProps}
              >
                <motion.svg 
                  className={navClasses.iconSize} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  {...settingsIconAnimationProps}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </motion.svg>
              </motion.button>
            </nav>
          </div>
        </div>
      </div>
      
      <GameTutorial 
        isOpen={isTutorialOpen}
        onClose={closeTutorial}
      />
      
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={closeSettings}
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

Navigation.displayName = 'Navigation';

export default Navigation;