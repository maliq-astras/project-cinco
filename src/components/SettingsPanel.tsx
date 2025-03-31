import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';

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
  const { colors } = useTheme();
  
  // These would be hooked up to actual state management in a real implementation
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isHardMode, setIsHardMode] = React.useState(false);
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
  const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full p-1 transition-colors`}
      style={{ 
        backgroundColor: isOn 
          ? `var(--color-${colors.primary})` 
          : 'rgb(209, 213, 219)' // gray-300
      }}
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
        <h2 className="text-xl font-bold" style={{ color: `var(--color-${colors.primary})` }}>Settings</h2>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: `var(--color-${colors.primary})` }}
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
            <p className="font-medium text-gray-800">Dark Mode</p>
            <p className="text-sm text-gray-500">Switch between light and dark theme</p>
          </div>
          <ToggleSwitch isOn={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        </div>

        {/* Hard Mode Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Hard Mode</p>
            <p className="text-sm text-gray-500">No hints, fewer guesses</p>
          </div>
          <ToggleSwitch isOn={isHardMode} onToggle={() => setIsHardMode(!isHardMode)} />
        </div>

        {/* Randomizer Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Randomizer</p>
            <p className="text-sm text-gray-500">Get random categories each day</p>
          </div>
          <ToggleSwitch isOn={isRandomizer} onToggle={() => setIsRandomizer(!isRandomizer)} />
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">High Contrast Mode</p>
            <p className="text-sm text-gray-500">Increase color contrast</p>
          </div>
          <ToggleSwitch isOn={isHighContrast} onToggle={() => setIsHighContrast(!isHighContrast)} />
        </div>

        {/* Language Dropdown */}
        <div className="flex flex-col">
          <label htmlFor="language" className="font-medium text-gray-800 mb-1">Language</label>
          <select 
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
            style={{ 
              borderColor: `var(--color-${colors.primary})`, 
              color: `var(--color-${colors.primary})` 
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

      <div className="mt-8 border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-500 text-center">
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
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="w-full h-1 bg-gray-200 rounded-full mx-auto my-2 max-w-[4rem]"></div>
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOverlayClick}
    >
      <div className={`${inter.className} bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto`}>
        {settingsContent}
      </div>
    </div>
  );
};

export default SettingsPanel; 