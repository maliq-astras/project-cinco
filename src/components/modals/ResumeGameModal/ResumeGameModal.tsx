'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '@/components/ui/Timer/helpers/formatting';
import Logo from '@/components/layout/Logo/Logo';
import { useResumeGameModal } from './hooks';
import { getModalStyle, getTimeDisplayStyle, getResumeButtonStyle } from './helpers';
import styles from './ResumeGameModal.module.css';

interface ResumeGameModalProps {
  isOpen: boolean;
  onResume: () => void;
}

export default React.memo(function ResumeGameModal({ isOpen, onResume }: ResumeGameModalProps) {
  const {
    colors,
    frozenTime,
    modalSize,
    logoHeight,
    timerFontSize,
    buttonPadding,
    buttonFontSize,
    labelFontSize,
  } = useResumeGameModal({ isOpen, onResume });

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={styles.modal}
        style={getModalStyle(modalSize)}
      >
        {/* Logo Section */}
        <div className={styles.headerSection}>
          <Logo height={logoHeight} />
        </div>

        {/* Timer Section */}
        <div className={styles.timerSection}>
          <div
            className={styles.timeLabel}
            style={{ fontSize: `${labelFontSize}px` }}
          >
            TIME REMAINING
          </div>
          <div
            className={styles.timeDisplay}
            style={getTimeDisplayStyle(colors.primary, timerFontSize)}
          >
            {formatTime(frozenTime)}
          </div>
        </div>

        {/* Button Section */}
        <div className={styles.buttonSection}>
          <button
            onClick={onResume}
            className={styles.resumeButton}
            style={getResumeButtonStyle(colors.primary, buttonPadding, buttonFontSize)}
          >
            RESUME
          </button>
        </div>
      </motion.div>
    </div>
  );
});