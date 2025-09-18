import { TFunction } from 'i18next';
import { getCategoryName } from '@/helpers/i18nHelpers';

export const formatStepLabel = (label: string) => {
  return label.toUpperCase();
};

export const formatCategoryName = (option: string, t: TFunction) => {
  return getCategoryName(option, t);
};