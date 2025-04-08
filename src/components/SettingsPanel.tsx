import React from 'react';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsPanel, languages } from '../hooks/components/settingsPanel';
import { settingsPanelStyles } from '../styles/settingsPanelStyles';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../context/LanguageContext';

const inter = Inter({ subsets: ['latin'] });

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const {
    colors,
    darkMode,
    toggleDarkMode,
    isHardModeEnabled,
    toggleHardMode,
    hasSeenClue,
    isRandomizer,
    toggleRandomizer,
    isHighContrast,
    toggleHighContrast,
    selectedLanguage,
    handleLanguageChange,
    isMobile,
    handleOverlayClick
  } = useSettingsPanel({ isOpen, onClose });

  if (!isOpen) return null;

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

        {/* Randomizer Toggle */}
        <div className={settingsPanelStyles.settingRow}>
          <div className={settingsPanelStyles.settingTextContainer}>
            <p className={settingsPanelStyles.settingTitle}>{t('ui.settings.randomizer')}</p>
            <p className={settingsPanelStyles.settingDescription}>{t('ui.settings.randomizerDesc')}</p>
          </div>
          <ToggleSwitch isOn={isRandomizer} onToggle={toggleRandomizer} />
        </div>

        {/* High Contrast Mode */}
        <div className={settingsPanelStyles.settingRow}>
          <div className={settingsPanelStyles.settingTextContainer}>
            <p className={settingsPanelStyles.settingTitle}>{t('ui.settings.highContrast')}</p>
            <p className={settingsPanelStyles.settingDescription}>{t('ui.settings.highContrastDesc')}</p>
          </div>
          <ToggleSwitch isOn={isHighContrast} onToggle={toggleHighContrast} />
        </div>

        {/* Language Dropdown */}
        <div className={settingsPanelStyles.languageContainer}>
          <label htmlFor="language" className={settingsPanelStyles.languageLabel}>{t('ui.language.select')}</label>
          <select 
            id="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className={settingsPanelStyles.languageSelectClass}
            style={settingsPanelStyles.languageSelect(darkMode, colors.primary)}
          >
            {languages.map((lang) => (
              <option 
                key={lang.code} 
                value={lang.code}
                disabled={!SUPPORTED_LANGUAGES.includes(lang.code)}
              >
                {SUPPORTED_LANGUAGES.includes(lang.code) ? t(`ui.language.${lang.code}`) : lang.name}
              </option>
            ))}
          </select>
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
      <AnimatePresence>
        <motion.div 
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
      </AnimatePresence>
    );
  }

  // For desktop, render a centered modal
  return (
    <div 
      className={settingsPanelStyles.desktopContainer}
      onClick={handleOverlayClick}
    >
      <div 
        className={`${inter.className} ${settingsPanelStyles.desktopPanelClass}`}
        style={settingsPanelStyles.desktopPanel(colors.primary)}
      >
        {settingsContent}
      </div>
    </div>
  );
};

export default SettingsPanel; 