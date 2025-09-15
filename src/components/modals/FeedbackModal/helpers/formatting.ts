import { getCategoryName } from '@/helpers/i18nHelpers';

export const formatStepLabel = (label: string) => {
  return label.toUpperCase();
};

export const formatCategoryName = (option: string, t: (key: string, options?: string | Record<string, unknown>) => string) => {
  return getCategoryName(option, t);
};