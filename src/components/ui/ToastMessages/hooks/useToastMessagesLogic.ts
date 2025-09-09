import { useTranslation } from 'react-i18next';
import { getToastMessage } from '../helpers';

export const useToastMessagesLogic = () => {
  const { t } = useTranslation();

  const duplicateMessage = getToastMessage('duplicate', t);
  const skipMessage = getToastMessage('skip', t);

  return {
    duplicateMessage,
    skipMessage
  };
};