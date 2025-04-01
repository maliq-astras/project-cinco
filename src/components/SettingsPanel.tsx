import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

const inter = Inter({ subsets: ['latin'] });

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for languages (would come from actual i18n system)
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { colors, darkMode, toggleDarkMode } = useTheme();
  
  // Use separate selectors for each state value to avoid the infinite loop
  const isHardModeEnabled = useGameStore(state => state.isHardModeEnabled);
  const setHardModeEnabled = useGameStore(state => state.setHardModeEnabled);
  const hasSeenClue = useGameStore(state => state.hasSeenClue);
  
  // These would be hooked up to actual state management in a real implementation
  // Dark mode is now managed by ThemeContext
  const [isRandomizer, setIsRandomizer] = React.useState(false);
  const [isHighContrast, setIsHighContrast] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Detect if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Handle body scroll locking when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose();
    }
  };
  
  // Toggle switch component with theme color
  const ToggleSwitch = ({ isOn, onToggle, disabled = false }: { isOn: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ 
        backgroundColor: isOn 
          ? `var(--color-${colors.primary})` 
          : 'rgb(209, 213, 219)' // gray-300
      }}
      disabled={disabled}
    >
      <div 
        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0'}`}
      ></div>
    </button>
  );

  // Content is the same regardless of mobile or desktop
  const settingsContent = (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold dark:text-white" style={{ color: darkMode ? 'white' : `var(--color-${colors.primary})` }}>Settings</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          style={{ color: darkMode ? 'white' : `var(--color-${colors.primary})` }}
          aria-label="Close settings"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
          </div>
          <ToggleSwitch isOn={darkMode} onToggle={toggleDarkMode} />
        </div>

        {/* Hard Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Hard Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Less time to guess!</p>
            {hasSeenClue && (
              <p className="text-xs text-red-500 mt-1">Cannot change difficulty after game has started</p>
            )}
          </div>
          <ToggleSwitch 
            isOn={isHardModeEnabled} 
            onToggle={() => setHardModeEnabled(!isHardModeEnabled)} 
            disabled={hasSeenClue}
          />
        </div>

        {/* Randomizer Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Randomizer</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Get random categories each day</p>
          </div>
          <ToggleSwitch isOn={isRandomizer} onToggle={() => setIsRandomizer(!isRandomizer)} />
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">High Contrast Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Increase color contrast</p>
          </div>
          <ToggleSwitch isOn={isHighContrast} onToggle={() => setIsHighContrast(!isHighContrast)} />
        </div>

        {/* Language Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="language" className="font-medium text-gray-800 dark:text-gray-200 mb-1">Language</label>
          <select 
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white"
            style={{ 
              borderColor: `var(--color-${colors.primary})`, 
              color: darkMode ? 'white' : `var(--color-${colors.primary})` 
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Settings will be saved automatically.
        </p>
      </div>
    </>
  );

  // For mobile, render a slide-up panel similar to Final Five
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-lg"
            style={{ 
              borderTop: `4px solid var(--color-${colors.primary})`,
              borderLeft: `1px solid var(--color-${colors.primary})`,
              borderRight: `1px solid var(--color-${colors.primary})`
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto my-2 max-w-[4rem]"></div>
            <div className={`${inter.className} p-6 max-h-[80vh] overflow-y-auto`}>
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      onClick={handleOverlayClick}
    >
      <div 
        className={`${inter.className} bg-white dark:bg-black rounded-xl shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}
        style={{ 
          border: `2px solid var(--color-${colors.primary})`
        }}
      >
        {settingsContent}
      </div>
    </div>
  );
};

export default SettingsPanel; 