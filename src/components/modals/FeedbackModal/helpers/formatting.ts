import { getCategoryName } from '@/helpers/i18nHelpers';

export const formatStepLabel = (label: string) => {
  return label.toUpperCase();
};

export const formatCategoryName = (option: string, t: any) => {
  return getCategoryName(option, t);
};