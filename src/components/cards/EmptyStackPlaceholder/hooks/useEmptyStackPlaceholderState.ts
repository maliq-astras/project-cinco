import { useTranslation } from 'react-i18next';

export const useEmptyStackPlaceholderState = () => {
  const { t } = useTranslation('common');

  return {
    t
  };
};