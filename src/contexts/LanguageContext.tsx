import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';

// Define supported languages and coming soon languages
export const SUPPORTED_LANGUAGES = ['en', 'es'];
export const COMING_SOON_LANGUAGES = ['fr', 'de', 'pt', 'it', 'ru', 'zh', 'ja', 'ko'];

// Type definitions
export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
  isLanguageLocked: boolean;
  isLanguageSwitching: boolean;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


/**
 * Language Provider component
 * 
 * Provides language state and methods for i18n throughout the app.
 * - Tracks the current language
 * - Provides a method to change the language
 * - Persists language choice in localStorage
 */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      return (savedLanguage as Language) || 'en';
    }
    return 'en';
  });
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
  const { i18n } = useTranslation();
  const fetchChallenge = useGameStore(state => state.fetchChallenge);
  const setShouldPauseTimer = useGameStore(state => state.setShouldPauseTimer);

  useEffect(() => {
    
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
        
    // Only fetch challenge if we're not in the middle of a language switch
    // The changeLanguage function will handle fetching after reset
    if (!isLanguageSwitching) {
      fetchChallenge(language);
    } else {
    }
  }, [language, i18n, fetchChallenge, isLanguageSwitching]);

  const changeLanguage = async (newLanguage: Language) => {
    
    // Remove the restriction - users can now change language anytime
    if (language === newLanguage) {
      return; // No change needed
    }
    
    // Start the language switching process - show loader FIRST
    setIsLanguageSwitching(true);
    setShouldPauseTimer(true); // Pause the game timer
    
    // Wait longer to ensure the loader is fully visible before changing anything
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Change the language first
      setLanguage(newLanguage);
      
      // Wait a bit to ensure language change is processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Just fetch the challenge in the new language - don't reset game state
      // This preserves user progress, revealed facts, guesses, timer, etc.
      const gameStore = useGameStore.getState();
      await gameStore.fetchChallenge(newLanguage);
      
      // Ensure minimum loading time of 2.5 seconds
      const minLoadingTime = 2500;
      
      // Wait for minimum loading time
      await new Promise(resolve => setTimeout(resolve, minLoadingTime));
      
    } catch (error) {
      console.error('Error during language change:', error);
    } finally {
      // Always restore timer and hide loading after minimum time
      setIsLanguageSwitching(false);
      setShouldPauseTimer(false); // Resume the game timer
    }
  };


  // Context value
  const value = {
    language,
    changeLanguage,
    isLanguageLocked: false, // Remove the restriction - language can always be changed
    isLanguageSwitching
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export default context
export default LanguageContext; 