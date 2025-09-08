import { Fact, CategoryType } from '@/types';

export const getCategoryFromFact = (fact: Fact<CategoryType>): string => {
  if (!fact.category) return 'countries';
  return typeof fact.category === 'string' ? fact.category : fact.category.toString();
};