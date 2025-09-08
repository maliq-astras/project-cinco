import { Fact, CategoryType } from '@/types';

export const getContentForLanguage = (fact: Fact<CategoryType>, currentLanguage: 'en' | 'es'): string => {
  if (fact.content && typeof fact.content === 'object') {
    return fact.content[currentLanguage] || fact.content.en || '';
  }
  
  if (typeof fact.content === 'string') {
    return fact.content;
  }
  
  return '';
};