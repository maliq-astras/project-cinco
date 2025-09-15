import { Fact, CategoryType } from '@/types';

export const getCategoryFromFact = (fact: Fact<CategoryType>): string => {
  if (!fact.category) return 'countries';
  return fact.category.toString();
};