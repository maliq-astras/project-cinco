import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsPanel } from './useSettingsPanel';
import { settingsPanelStyles } from './SettingsPanel.styles';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';


const inter = Inter({ subsets: ['latin'] });

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  const {
    colors,
    darkMode,
    toggleDarkMode,
    isHardModeEnabled,
    toggleHardMode,
    hasSeenClue,
    isSoundEnabled,
    toggleSound,
    isHighContrast,
    toggleHighContrast,
    selectedLanguage,
    handleLanguageChange,
    isMobile,
    handleOverlayClick
  } = useSettingsPanel({ isOpen, onClose });

  // Toggle switch component with theme color
  const ToggleSwitch = ({ isOn, onToggle, disabled = false }: { isOn: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button 
      onClick={onToggle}
      className={settingsPanelStyles.toggleSwitchClass}
      style={settingsPanelStyles.toggleSwitch(isOn, colors.primary, disabled)}
      disabled={disabled}
    >
      <div className={settingsPanelStyles.toggleDot(isOn)}></div>
    </button>
  );

  // Content is the same regardless of mobile or desktop
  const settingsContent = (
    <>
      <div className={settingsPanelStyles.header}>
        <h2 
          className={settingsPanelStyles.titleClass}
          style={settingsPanelStyles.title(darkMode, colors.primary)}
        >
          {t('ui.buttons.settings')}
        </h2>
        <button 
          onClick={onClose}
          className={settingsPanelStyles.closeButtonClass}
          style={settingsPanelStyles.closeButton(darkMode, colors.primary)}
          aria-label={`${t('ui.buttons.close')} ${t('ui.buttons.settings').toLowerCase()}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={settingsPanelStyles.settingsContainer}>
        {/* Theme Toggle */}
        <div className={settingsPanelStyles.settingRow}>
          <div className={settingsPanelStyles.settingTextContainer}>
            <p className={settingsPanelStyles.settingTitle}>{t('ui.settings.darkMode')}</p>
            <p className={settingsPanelStyles.settingDescription}>{t('ui.settings.darkModeDesc')}</p>
          </div>
          <ToggleSwitch isOn={darkMode} onToggle={toggleDarkMode} />
        </div>

        {/* Hard Mode Toggle */}
        <div className={settingsPanelStyles.settingRow}>
          <div className={settingsPanelStyles.settingTextContainer}>
            <p className={settingsPanelStyles.settingTitle}>{t('ui.settings.hardMode')}</p>
            <p className={settingsPanelStyles.settingDescription}>{t('ui.settings.hardModeDesc')}</p>
            {hasSeenClue && (
              <p className={settingsPanelStyles.settingErrorText}>{t('ui.settings.cannotChangeDifficulty')}</p>
            )}
          </div>
          <ToggleSwitch 
            isOn={isHardModeEnabled} 
            onToggle={toggleHardMode} 
            disabled={hasSeenClue}
          />
        </div>

        {/* Sound Toggle - Hidden for future implementation */}
        {false && (
          <div className={settingsPanelStyles.settingRow}>
            <div className={settingsPanelStyles.settingTextContainer}>
              <p className={settingsPanelStyles.settingTitle}>{t('ui.settings.sound')}</p>
              <p className={settingsPanelStyles.settingDescription}>{t('ui.settings.soundDesc')}</p>
            </div>
            <ToggleSwitch isOn={isSoundEnabled} onToggle={toggleSound} />
          </div>
        )}

        {/* High Contrast Mode */}
        <div className={settingsPanelStyles.settingRow}>
          <div className={settingsPanelStyles.settingTextContainer}>
            <p className={settingsPanelStyles.settingTitle}>{t('ui.settings.highContrast')}</p>
            <p className={settingsPanelStyles.settingDescription}>{t('ui.settings.highContrastDesc')}</p>
          </div>
          <ToggleSwitch isOn={isHighContrast} onToggle={toggleHighContrast} />
        </div>

        {/* Language Dropdown */}
        <div className={settingsPanelStyles.settingRow}>
          <div className={settingsPanelStyles.settingTextContainer}>
            <p className={settingsPanelStyles.settingTitle}>{t('ui.language.select')}</p>
          </div>
          <div className={settingsPanelStyles.languageSelectContainer}>
            <div 
              className={settingsPanelStyles.languageSelectClass}
              style={settingsPanelStyles.languageSelect(darkMode, colors.primary)}
              onClick={() => {
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
              }}
            >
              <span>{SUPPORTED_LANGUAGES.includes(selectedLanguage) ? t(`ui.language.${selectedLanguage}`) : selectedLanguage}</span>
              <div className={settingsPanelStyles.languageSelectArrow}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Simple dropdown - no portal, just absolute positioning */}
            {isLanguageDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-32 overflow-y-auto z-50">
                {SUPPORTED_LANGUAGES.map(langCode => (
                  <div
                    key={langCode}
                    className={`px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0 ${
                      selectedLanguage === langCode ? 'font-medium' : ''
                    }`}
                    style={{
                      backgroundColor: selectedLanguage === langCode ? `var(--color-${colors.primary})` : 'transparent',
                      color: selectedLanguage === langCode ? 'white' : 'inherit',
                    }}
                    onClick={() => {
                      handleLanguageChange({ target: { value: langCode } } as React.ChangeEvent<HTMLSelectElement>);
                      setIsLanguageDropdownOpen(false);
                    }}
                  >
                    {t(`ui.language.${langCode}`)}
                  </div>
                ))}
                <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed border-b-0">
                  More coming soon!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={settingsPanelStyles.footer}>
        <p className={settingsPanelStyles.footerText}>
          {t('ui.settings.autoSave')}
        </p>
      </div>
      

    </>
  );

  // For mobile, render a slide-up panel similar to Final Five
  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              key="mobile-settings"
              className={settingsPanelStyles.mobileContainer}
              {...settingsPanelStyles.overlayAnimation}
            >
              <motion.div
                className={settingsPanelStyles.mobilePanelClass}
                style={settingsPanelStyles.mobilePanel(colors.primary)}
                {...settingsPanelStyles.mobilePanelAnimation}
              >
                <div className={settingsPanelStyles.mobileDragIndicator}></div>
                <div className={`${inter.className} ${settingsPanelStyles.contentContainer}`}>
                  {settingsContent}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        


      </>
    );
  }

  // For desktop, render a centered modal
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="desktop-settings"
            className={settingsPanelStyles.desktopContainer}
            onClick={handleOverlayClick}
            {...settingsPanelStyles.overlayAnimation}
          >
            <motion.div 
              className={`${inter.className} ${settingsPanelStyles.desktopPanelClass}`}
              style={settingsPanelStyles.desktopPanel(colors.primary)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {settingsContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      

    </>
  );
};

export default SettingsPanel; 