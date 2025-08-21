import React from 'react';
import styles from './ModalNavButton.module.css';

interface ModalNavButtonProps {
  direction: 'next' | 'prev';
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primaryColor: string;
  textSegmentBg: string;
}

const ModalNavButton: React.FC<ModalNavButtonProps> = ({
  direction,
  label,
  onClick,
  disabled = false,
  primaryColor,
  textSegmentBg,
}) => {
  const isNext = direction === 'next';
  return (
    <button
      onClick={onClick}
      className={styles.button}
      style={{
        background: textSegmentBg,
        color: `var(--color-${primaryColor})`,
        borderColor: `var(--color-${primaryColor})`,
      }}
      disabled={disabled}
    >
      {/* Arrow segment (left for prev, right for next) */}
      {isNext ? null : (
        <span 
          className={`${styles.arrowSegment} ${styles.arrowSegmentPrev}`}
          style={{
            background: `var(--color-${primaryColor})`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M14 5L8 11L14 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
      {/* Text segment */}
      <span 
        className={`${styles.textSegment} ${isNext ? styles.textSegmentNext : styles.textSegmentPrev}`}
        style={{
          color: `var(--color-${primaryColor})`,
          background: textSegmentBg,
        }}
      >
        {label}
      </span>
      {/* Arrow segment (right for next) */}
      {isNext ? (
        <span 
          className={`${styles.arrowSegment} ${styles.arrowSegmentNext}`}
          style={{
            background: `var(--color-${primaryColor})`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8 5L14 11L8 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      ) : null}
    </button>
  );
};

export default ModalNavButton; 