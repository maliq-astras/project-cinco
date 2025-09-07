import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ToastMessages.module.css';

interface ToastMessagesProps {
  duplicateErrorRef?: RefObject<HTMLDivElement | null>;
  skipMessageRef?: RefObject<HTMLDivElement | null>;
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
    <div className={styles.container}>
      {/* Duplicate guess toast */}
      <div 
        ref={duplicateErrorRef}
        id="duplicate-error" 
        className={styles.duplicateToast}
      >
        {t('game.status.duplicate')}
      </div>

      {/* Skip message toast */}
      <div 
        ref={skipMessageRef}
        id="skip-message" 
        className={styles.skipToast}
      >
        {t('game.status.skipped')}
      </div>
    </div>
  );
}
