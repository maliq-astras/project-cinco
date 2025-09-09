import { CSSProperties } from 'react';
import styles from '../EndGameMessage.module.css';

export const endGameMessageStyles = {
  container: styles.container,
  messageWrapper: styles.messageWrapper,
  messageContent: styles.messageContent,
  timeDisplay: styles.timeDisplay,
  shareIcon: styles.shareIcon,
  tomorrowMessage: styles.tomorrowMessage,
  confettiPiece: styles.confettiPiece
} as const;

export const getAnswerTextStyle = (primaryColor: string): CSSProperties => ({
  fontWeight: 'bold',
  color: `var(--color-${primaryColor})`
});

export const getConfettiPieceStyle = (size: number, color: string): CSSProperties => ({
  width: size,
  height: size,
  backgroundColor: color,
  borderRadius: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  left: '50%',
  top: '50%'
});

export const getTimeDisplayTextStyle = (primaryColor: string): CSSProperties => ({
  color: `var(--color-${primaryColor})`
});