import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

// Define supported languages and coming soon languages
export const SUPPORTED_LANGUAGES = ['en', 'es'];
export const COMING_SOON_LANGUAGES = ['fr', 'de', 'pt', 'it', 'ru', 'zh', 'ja', 'ko'];

// Type definitions
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  changeLanguage: (lang: string) => void;
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
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with 'en' as default, we'll update from localStorage after mount
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check localStorage after component mounts (client-side only)
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  // Update localStorage and i18n when language changes
  useEffect(() => {
    localStorage.setItem('i18nextLng', language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  // Function to change language
  const changeLanguage = (lang: string) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguage(lang);
    }
  };

  // Check if language is supported
  const isSupportedLanguage = (lang: string) => {
    return SUPPORTED_LANGUAGES.includes(lang);
  };

  // Context value
  const contextValue = {
    language,
    setLanguage,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export default context
export default LanguageContext; 