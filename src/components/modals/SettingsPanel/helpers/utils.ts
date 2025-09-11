import { SUPPORTED_LANGUAGES } from '@/contexts/LanguageContext';

export const languages = [
  ...SUPPORTED_LANGUAGES.map(code => ({ 
    code, 
    name: code === 'en' ? 'English' : code === 'es' ? 'Español' : code 
  })),
  { code: 'more', name: 'More coming soon!' }
];

export const getAriaLabel = (title: string, action: string) => {
  return `${action} ${title.toLowerCase()}`;
};