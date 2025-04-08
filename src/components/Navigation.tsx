import React from 'react';
import { Inter } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import GameTutorial from './GameTutorial';
import SettingsPanel from './SettingsPanel';
import NavDropdownMenu from './NavDropdownMenu';
import { useNavigation } from '../hooks/components/navigation';
import { navigationStyles } from '../styles/navigationStyles';

const inter = Inter({ subsets: ['latin'] });

export default function Navigation() {
  const { t } = useTranslation();
  const {
    colors,
    isDropdownOpen,
    isTutorialOpen,
    isSettingsOpen,
    dropdownRef,
    hardMode,
    isHardModeEnabled,
    menuItems,
    toggleDropdown,
    openSettings,
    closeSettings,
    closeTutorial
  } = useNavigation();

  return (
    <>
      <div className={navigationStyles.container}>
        <div className={navigationStyles.innerContainer}>
          <div className={navigationStyles.navBar}>
            {/* Hard Mode Badge */}
            <div className={navigationStyles.badgeContainer}>
              {(hardMode || isHardModeEnabled) && (
                <div 
                  className={navigationStyles.hardModeBadgeText}
                  style={navigationStyles.hardModeBadge(colors.primary)}
                >
                  {t('ui.settings.hardMode')}
                </div>
              )}
            </div>
            
            <nav className={navigationStyles.nav}>
              <div className={navigationStyles.dropdownContainer} ref={dropdownRef}>
                <button 
                  className={navigationStyles.dropdownButtonClass(isDropdownOpen)} 
                  style={navigationStyles.dropdownButton(isDropdownOpen, colors.primary)}
                  onClick={toggleDropdown}
                  aria-label={t('ui.buttons.info')}
                >
                  <svg className={navigationStyles.iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Use the NavDropdownMenu component */}
                <NavDropdownMenu 
                  isOpen={isDropdownOpen}
                  menuItems={menuItems}
                  colors={colors}
                />
              </div>
              <button 
                className={navigationStyles.navIconClass}
                style={navigationStyles.navIcon(colors.primary)}
                aria-label={t('ui.buttons.profile')}
              >
                <svg className={navigationStyles.iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button 
                className={navigationStyles.navIconClass}
                style={navigationStyles.navIcon(colors.primary)}
                onClick={openSettings}
                aria-label={t('ui.buttons.settings')}
              >
                <svg className={navigationStyles.iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Game Tutorial Modal */}
      <GameTutorial 
        isOpen={isTutorialOpen}
        onClose={closeTutorial}
      />

      {/* Settings Panel Modal */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={closeSettings}
      />
    </>
  );
} 