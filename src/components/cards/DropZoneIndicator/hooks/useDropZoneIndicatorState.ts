import { useTranslation } from 'react-i18next';

export const useDropZoneIndicatorState = () => {
  const { t } = useTranslation();

  return {
    t
  };
};