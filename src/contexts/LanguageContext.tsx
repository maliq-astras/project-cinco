import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import i18n from '../i18n/config';

// Define supported languages and coming soon languages
export const SUPPORTED_LANGUAGES = ['en', 'es'];
export const COMING_SOON_LANGUAGES = ['fr', 'de', 'pt', 'it', 'ru', 'zh', 'ja', 'ko'];

// Type definitions
export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
  isLanguageLocked: boolean;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// LanguageProvider props
interface LanguageProviderProps {
  children: ReactNode;
}

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
  const { i18n } = useTranslation();
  const { hasMadeGuess } = useGameStore();
  const fetchChallenge = useGameStore(state => state.fetchChallenge);

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
    
    // When language changes, refetch the challenge in the new language
    fetchChallenge(language);
  }, [language, i18n, fetchChallenge]);

  const changeLanguage = (newLanguage: Language) => {
    if (hasMadeGuess) {
      return; // Don't allow language changes after a guess has been made
    }
    setLanguage(newLanguage);
  };

  // Check if language is supported
  const isSupportedLanguage = (lang: string) => {
    return SUPPORTED_LANGUAGES.includes(lang);
  };

  // Context value
  const value = {
    language,
    changeLanguage,
    isLanguageLocked: hasMadeGuess
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