import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { toastMessagesStyles } from './ToastMessages.styles';

interface ToastMessagesProps {
  duplicateErrorRef?: RefObject<HTMLDivElement>;
  skipMessageRef?: RefObject<HTMLDivElement>;
}

/**
 * Toast messages component for game feedback (duplicate guesses, skipped turns)
 */
export default function ToastMessages({ 
  duplicateErrorRef, 
  skipMessageRef 
}: ToastMessagesProps) {
  const { t } = useTranslation();

  return (
    <div className={toastMessagesStyles.container}>
      {/* Duplicate guess toast */}
      <div 
        ref={duplicateErrorRef}
        id="duplicate-error" 
        className={toastMessagesStyles.duplicateToast}
      >
        {t('game.status.duplicate')}
      </div>

      {/* Skip message toast */}
      <div 
        ref={skipMessageRef}
        id="skip-message" 
        className={toastMessagesStyles.skipToast}
      >
        {t('game.status.skipped')}
      </div>
    </div>
  );
}
