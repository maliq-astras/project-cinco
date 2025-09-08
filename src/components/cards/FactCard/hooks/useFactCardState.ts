import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

export const useFactCardState = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { language } = useLanguage();
  const currentLanguage = language as 'en' | 'es';

  return {
    cardRef,
    t,
    currentLanguage
  };
};