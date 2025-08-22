import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GameTutorial from '../../game/GameTutorial';
import SettingsPanel from '../../modals/SettingsPanel';
import NavDropdownMenu from '../NavDropdownMenu';
import FeedbackModal from '@/components/modals/FeedbackModal';
import BugReportModal from '@/components/modals/BugReportModal';
import { useNavigation } from './useNavigation';
import { navigationStyles } from './Navigation.styles';
import { useMainContainer } from '../MainContainer';



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
  
  const { isCompactHeader, headerSizeMode } = useMainContainer();

  // Get navigation size classes based on headerSizeMode
  const getNavigationSizeClasses = () => {
    switch (headerSizeMode) {
      case 'xs':
        return {
          container: navigationStyles.containerXs,
          innerContainer: navigationStyles.innerContainerXs,
          navBar: navigationStyles.navBarXs,
          nav: navigationStyles.navXs,
          dropdownButton: navigationStyles.dropdownButtonXs,
          dropdownButtonClass: navigationStyles.dropdownButtonClassXs,
          navIconClass: navigationStyles.navIconClassXs,
          iconSize: navigationStyles.iconSizeXs
        };
      case 'sm':
        return {
          container: navigationStyles.containerSm,
          innerContainer: navigationStyles.innerContainerSm,
          navBar: navigationStyles.navBarSm,
          nav: navigationStyles.navSm,
          dropdownButton: navigationStyles.dropdownButtonSm,
          dropdownButtonClass: navigationStyles.dropdownButtonClassSm,
          navIconClass: navigationStyles.navIconClassSm,
          iconSize: navigationStyles.iconSizeSm
        };
      case 'md':
        return {
          container: navigationStyles.containerMd,
          innerContainer: navigationStyles.innerContainerMd,
          navBar: navigationStyles.navBarMd,
          nav: navigationStyles.navMd,
          dropdownButton: navigationStyles.dropdownButtonMd,
          dropdownButtonClass: navigationStyles.dropdownButtonClassMd,
          navIconClass: navigationStyles.navIconClassMd,
          iconSize: navigationStyles.iconSizeMd
        };
      case 'lg':
        return {
          container: navigationStyles.containerLg,
          innerContainer: navigationStyles.innerContainerLg,
          navBar: navigationStyles.navBarLg,
          nav: navigationStyles.navLg,
          dropdownButton: navigationStyles.dropdownButtonLg,
          dropdownButtonClass: navigationStyles.dropdownButtonClassLg,
          navIconClass: navigationStyles.navIconClassLg,
          iconSize: navigationStyles.iconSizeLg
        };
      case 'xl':
        return {
          container: navigationStyles.containerXl,
          innerContainer: navigationStyles.innerContainerXl,
          navBar: navigationStyles.navBarXl,
          nav: navigationStyles.navXl,
          dropdownButton: navigationStyles.dropdownButtonXl,
          dropdownButtonClass: navigationStyles.dropdownButtonClassXl,
          navIconClass: navigationStyles.navIconClassXl,
          iconSize: navigationStyles.iconSizeXl
        };
      default:
        return {
          container: navigationStyles.containerMd,
          innerContainer: navigationStyles.innerContainerMd,
          navBar: navigationStyles.navBarMd,
          nav: navigationStyles.navMd,
          dropdownButton: navigationStyles.dropdownButtonMd,
          dropdownButtonClass: navigationStyles.dropdownButtonClassMd,
          navIconClass: navigationStyles.navIconClassMd,
          iconSize: navigationStyles.iconSizeMd
        };
    }
  };

  const navClasses = getNavigationSizeClasses();

  return (
    <>
      <div className={navClasses.container}>
        <div className={navClasses.innerContainer}>
          <div className={navClasses.navBar}>
            {/* Hard Mode Badge */}
            <div className={navigationStyles.badgeContainer}>
              {(hardMode || isHardModeEnabled) && (
                <motion.div 
                  className={isCompactHeader ? navigationStyles.compactHardModeBadgeText : navigationStyles.hardModeBadgeText}
                  style={navigationStyles.hardModeBadge(colors.primary)}
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={headerEntranceComplete ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                >
                  {t('ui.settings.hardMode')}
                </motion.div>
              )}
            </div>
            
            <nav className={navClasses.nav}>
              <div className={navigationStyles.dropdownContainer} ref={dropdownRef}>
                <motion.button 
                  className={navClasses.dropdownButtonClass(isDropdownOpen)} 
                  style={navClasses.dropdownButton(isDropdownOpen, colors.primary)}
                  onClick={toggleDropdown}
                  aria-label={t('ui.buttons.info')}
                  {...navigationStyles.headerAnimations.navigationIcons}
                  animate={headerEntranceComplete ? navigationStyles.headerAnimations.navigationIcons.animate : navigationStyles.headerAnimations.navigationIcons.initial}
                >
                  <motion.svg 
                    className={navClasses.iconSize} 
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
                  onClose={() => setIsDropdownOpen(false)}
                />
              </div>
              <motion.button 
                className={navClasses.navIconClass}
                style={navigationStyles.navIcon(colors.primary)}
                onClick={openSettings}
                aria-label={t('ui.buttons.settings')}
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={headerEntranceComplete ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: -90 }}
                transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.svg 
                  className={navClasses.iconSize} 
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