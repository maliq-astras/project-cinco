import React from 'react';
import { useTranslation } from 'react-i18next';
import { toastMessagesStyles } from './ToastMessages.styles';

/**
 * Toast messages component for game feedback (duplicate guesses, skipped turns)
 */
export default function ToastMessages() {
  const { t } = useTranslation();

  return (
    <div className={toastMessagesStyles.container}>
      {/* Duplicate guess toast */}
      <div id="duplicate-error" className={toastMessagesStyles.duplicateToast}>
        {t('game.status.duplicate')}
      </div>

      {/* Skip message toast */}
      <div id="skip-message" className={toastMessagesStyles.skipToast}>
        {t('game.status.skipped')}
      </div>
    </div>
  );
}
