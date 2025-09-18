import { CSSProperties } from 'react';

export const getModalStyle = (modalSize: number): CSSProperties => ({
  width: `${modalSize}px`,
  height: `${modalSize}px`,
});

export const getTimeDisplayStyle = (primaryColor: string, fontSize: number): CSSProperties => ({
  color: `var(--color-${primaryColor})`,
  fontSize: `${fontSize}px`,
});

export const getResumeButtonStyle = (primaryColor: string, padding: number, fontSize: number): CSSProperties => ({
  backgroundColor: `var(--color-${primaryColor})`,
  padding: `${padding}px ${padding * 2}px`,
  fontSize: `${fontSize}px`,
});