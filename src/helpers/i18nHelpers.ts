import { TFunction } from 'i18next';
import { CategoryType } from '../types';

/**
 * Get the translated category name in the current language
 * 
 * @param category The category from the challenge
 * @param t The translation function from useTranslation
 * @returns The translated category name in uppercase
 */
export const getCategoryName = (category: CategoryType | string | undefined, t: TFunction): string => {
  if (!category) return '';
  
  // Convert category to lowercase to match translation key format
  const categoryKey = category.toLowerCase();
  
  // Try to get translation with the exact key
  const translation = t(`categories.${categoryKey}`, { defaultValue: '' });
  
  // If translation is missing, fallback to the original category name
  return (translation || category).toUpperCase();
}; 

/**
 * Get the translated fact type name in the current language
 * 
 * @param factType The fact type from the challenge
 * @param t The translation function from useTranslation
 * @returns The translated fact type name
 */
export const getFactTypeName = (factType: string, t: TFunction): string => {
  if (!factType) return '';
  
  // Convert fact type to lowercase to match translation key format
  const factTypeKey = factType.toLowerCase();
  
  // Try to get translation with the exact key
  const translation = t(`factTypes.${factTypeKey}`, { defaultValue: '' });
  
  // If translation is missing, fallback to the original fact type
  return translation || factType;
}; 