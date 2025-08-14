import React from 'react';
import { motion } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import GameTutorial from '../../game/GameTutorial';
import SettingsPanel from '../../ui/SettingsPanel';
import NavDropdownMenu from '../NavDropdownMenu';
import FeedbackModal from '@/components/modals/FeedbackModal';
import BugReportModal from '@/components/modals/BugReportModal';
import { useNavigation } from './useNavigation';
import { navigationStyles } from './Navigation.styles';
import { useMainContainer } from '../../game/MainContainer';

const inter = Inter({ subsets: ['latin'] });

interface NavigationProps {
  headerEntranceComplete?: boolean;
}

export default function Navigation({ headerEntranceComplete = false }: NavigationProps) {
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
    menuItems,
    toggleDropdown,
    openSettings,
    closeSettings,
    closeTutorial,
    setIsFeedbackModalOpen,
    setIsBugReportModalOpen
  } = useNavigation();
  
  const { isCompactHeader } = useMainContainer();

  return (
    <>
      <div className={isCompactHeader ? navigationStyles.compactContainer : navigationStyles.container}>
        <div className={isCompactHeader ? navigationStyles.compactInnerContainer : navigationStyles.innerContainer}>
          <div className={isCompactHeader ? navigationStyles.compactNavBar : navigationStyles.navBar}>
            {/* Hard Mode Badge */}
            <div className={navigationStyles.badgeContainer}>
              {(hardMode || isHardModeEnabled) && (
                <div 
                  className={isCompactHeader ? navigationStyles.compactHardModeBadgeText : navigationStyles.hardModeBadgeText}
                  style={navigationStyles.hardModeBadge(colors.primary)}
                >
                  {t('ui.settings.hardMode')}
                </div>
              )}
            </div>
            
            <nav className={isCompactHeader ? navigationStyles.compactNav : navigationStyles.nav}>
              <div className={navigationStyles.dropdownContainer} ref={dropdownRef}>
                <motion.button 
                  className={isCompactHeader ? navigationStyles.compactDropdownButtonClass(isDropdownOpen) : navigationStyles.dropdownButtonClass(isDropdownOpen)} 
                  style={isCompactHeader ? navigationStyles.compactDropdownButton(isDropdownOpen, colors.primary) : navigationStyles.dropdownButton(isDropdownOpen, colors.primary)}
                  onClick={toggleDropdown}
                  aria-label={t('ui.buttons.info')}
                  {...navigationStyles.headerAnimations.navigationIcons}
                  animate={headerEntranceComplete ? navigationStyles.headerAnimations.navigationIcons.animate : navigationStyles.headerAnimations.navigationIcons.initial}
                >
                  <motion.svg 
                    className={isCompactHeader ? navigationStyles.compactIconSize : navigationStyles.iconSize} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    initial={{ rotate: -90 }}
                    animate={headerEntranceComplete ? { rotate: 0 } : { rotate: -90 }}
                    transition={{ duration: 0.3, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                </motion.button>

                {/* Use the NavDropdownMenu component */}
                <NavDropdownMenu 
                  isOpen={isDropdownOpen}
                  menuItems={menuItems}
                  colors={colors}
                />
              </div>
              <motion.button 
                className={isCompactHeader ? navigationStyles.compactNavIconClass : navigationStyles.navIconClass}
                style={navigationStyles.navIcon(colors.primary)}
                onClick={openSettings}
                aria-label={t('ui.buttons.settings')}
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={headerEntranceComplete ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -90 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.svg 
                  className={isCompactHeader ? navigationStyles.compactIconSize : navigationStyles.iconSize} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: -90 }}
                  animate={headerEntranceComplete ? { rotate: 0 } : { rotate: -90 }}
                  transition={{ duration: 0.3, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
} 