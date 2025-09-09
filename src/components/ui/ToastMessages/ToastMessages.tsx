import React, { RefObject } from 'react';
import { useToastMessages } from './hooks';
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
  const { duplicateMessage, skipMessage } = useToastMessages();

  return (
    <div className={styles.container}>
      {/* Duplicate guess toast */}
      <div 
        ref={duplicateErrorRef}
        id="duplicate-error" 
        className={styles.duplicateToast}
      >
        {duplicateMessage}
      </div>

      {/* Skip message toast */}
      <div 
        ref={skipMessageRef}
        id="skip-message" 
        className={styles.skipToast}
      >
        {skipMessage}
      </div>
    </div>
  );
}
