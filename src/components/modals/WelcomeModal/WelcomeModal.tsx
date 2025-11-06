'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Righteous } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useWelcomeModal } from './hooks';
import { getModalStyle, getButtonStyle, getTextStyle } from './helpers';
import styles from './WelcomeModal.module.css';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface WelcomeModalProps {
  isOpen: boolean;
  onComplete: (preferences: { theme: 'light' | 'dark'; language: string; showTutorial: boolean }) => void;
}

export default React.memo(function WelcomeModal({ isOpen, onComplete }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [preferences, setPreferences] = React.useState({
    theme: 'light' as 'light' | 'dark',
    language: 'en',
    showTutorial: false
  });
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);

  const { t } = useTranslation();
  const { colors, darkMode, toggleDarkMode } = useTheme();
  const { changeLanguage } = useLanguage();

  const {
    modalSize,
    buttonPadding,
    buttonFontSize,
    textFontSize,
  } = useWelcomeModal({ isOpen });

  // Reset to first step when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setPreferences({ theme: darkMode ? 'dark' : 'light', language: 'en', showTutorial: false });
      setIsLanguageDropdownOpen(false);
    }
  }, [isOpen, darkMode]);

  // Note: Theme changes are applied when the user completes the modal
  // This prevents interference with the normal theme toggle functionality

  if (!isOpen) return null;

  const handleThemeToggle = () => {
    // Apply theme change immediately for instant feedback
    toggleDarkMode();

    // Also update our preference tracking
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    setPreferences(prev => ({ ...prev, theme: newTheme }));
  };

  const handleLanguageSelect = (language: string) => {
    // Apply language change immediately for instant feedback
    changeLanguage(language as 'en' | 'es');

    // Also update our preference tracking
    setPreferences(prev => ({ ...prev, language }));
  };

  const handleContinueToTutorial = () => {
    setCurrentStep(1);
  };

  const handleTutorialChoice = (showTutorial: boolean) => {
    const finalPreferences = { ...preferences, showTutorial };
    setPreferences(finalPreferences);
    onComplete(finalPreferences);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Theme + Language selection
        return (
          <>
            <div className={styles.textSection}>
              <motion.div
                className={styles.iconContainer}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src="/icon0.svg" alt="Fact 5 Logo" className={styles.welcomeIcon} />
              </motion.div>
              <motion.h2
                className={styles.title}
                style={getTextStyle(colors.primary, textFontSize)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome to <span className={`${styles.fact5} ${righteous.className}`}>Fact 5</span>
              </motion.h2>
              <motion.p
                className={styles.description}
                style={{ fontSize: `${textFontSize}px` }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {t('setup.welcome.subtitle')}
              </motion.p>
            </div>

            <motion.div
              className={styles.contentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.settingsSection}>
              {/* Theme Toggle */}
              <div className={styles.settingRow}>
                <div className={styles.settingTextContainer}>
                  <p className={styles.settingTitle}>{t('ui.settings.darkMode')}</p>
                  <p className={styles.settingDescription}>{t('ui.settings.darkModeDesc')}</p>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={styles.toggleSwitch}
                  style={{
                    backgroundColor: darkMode ? `var(--color-${colors.primary})` : '#e5e7eb',
                    borderColor: darkMode ? `var(--color-${colors.primary})` : '#d1d5db'
                  }}
                >
                  <div
                    className={styles.toggleDot}
                    style={{
                      transform: darkMode ? 'translateX(20px)' : 'translateX(2px)',
                      backgroundColor: darkMode ? 'white' : '#6b7280'
                    }}
                  />
                </button>
              </div>

              {/* Language Dropdown */}
              <div className={styles.settingRow}>
                <div className={styles.settingTextContainer}>
                  <p className={styles.settingTitle}>{t('ui.language.select')}</p>
                </div>
                <div className={styles.languageSelectContainer}>
                  <div
                    className={styles.languageSelect}
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  >
                    <span>{SUPPORTED_LANGUAGES.includes(preferences.language) ? t(`ui.language.${preferences.language}`) : preferences.language}</span>
                    <div className={styles.languageSelectArrow}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Language dropdown - matches SettingsPanel exactly */}
                  {isLanguageDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-32 overflow-y-auto z-50">
                      {SUPPORTED_LANGUAGES.map(langCode => (
                        <div
                          key={langCode}
                          className={`px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm border-b border-gray-200 dark:border-gray-600 last:border-b-0 ${
                            preferences.language === langCode ? 'font-medium' : ''
                          }`}
                          style={{
                            backgroundColor: preferences.language === langCode ? `var(--color-${colors.primary})` : 'transparent',
                            color: preferences.language === langCode ? 'white' : 'inherit',
                          }}
                          onClick={() => {
                            handleLanguageSelect(langCode);
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
            </motion.div>

            <motion.div
              className={styles.buttonSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={handleContinueToTutorial}
                className={styles.continueButton}
                style={getButtonStyle(colors.primary, buttonPadding, buttonFontSize)}
              >
                {t('setup.continue')} ›
              </button>
            </motion.div>
          </>
        );

      case 1: // Tutorial choice
        return (
          <>
            <div className={styles.textSection}>
              <motion.div
                className={styles.iconContainer}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src="/icon0.svg" alt="Fact 5 Logo" className={styles.welcomeIcon} />
              </motion.div>
              <motion.h2
                className={styles.title}
                style={getTextStyle(colors.primary, textFontSize)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('setup.tutorial.title')}
              </motion.h2>
              <motion.p
                className={styles.description}
                style={{ fontSize: `${textFontSize}px` }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {t('setup.tutorial.description')}
              </motion.p>
            </div>

            <motion.div
              className={styles.contentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.buttonSection}>
                <motion.button
                  onClick={() => handleTutorialChoice(false)}
                  className={styles.tutorialButton}
                  style={getButtonStyle(colors.secondary, buttonPadding, buttonFontSize)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  {t('setup.tutorial.skip')}
                </motion.button>
                <motion.button
                  onClick={() => handleTutorialChoice(true)}
                  className={styles.tutorialButton}
                  style={getButtonStyle(colors.primary, buttonPadding, buttonFontSize)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  {t('setup.tutorial.view')}
                </motion.button>
              </div>
            </motion.div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay}>
        <motion.div
          key={currentStep} // Re-animate on step change
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smoother animation
            scale: { duration: 0.3 },
            y: { duration: 0.3 }
          }}
          className={styles.modal}
          style={getModalStyle(modalSize)}
        >
        {renderStepContent()}
      </motion.div>
    </div>
  );
});
