import { CSSProperties } from 'react';

export const getTagButtonStyle = (
  selected: boolean,
  primaryColor: string,
  textSegmentBg: string
): CSSProperties => ({
  border: `2px solid var(--color-${primaryColor})`,
  background: selected ? `var(--color-${primaryColor})` : textSegmentBg,
  color: selected ? 'white' : `var(--color-${primaryColor})`,
  margin: '2px',
});

export const getDeviceButtonStyle = (
  selected: boolean,
  primaryColor: string,
  textSegmentBg: string
): CSSProperties => ({
  border: `2px solid var(--color-${primaryColor})`,
  background: selected ? `var(--color-${primaryColor})` : textSegmentBg,
  color: selected ? 'white' : `var(--color-${primaryColor})`,
  margin: '2px',
});

export const getFileUploadContainerStyle = (
  isDragging: boolean,
  primaryColor: string
): string => {
  const baseClasses = 'w-full border-2 dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer transition-all duration-200';
  
  if (isDragging) {
    return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-900/20`;
  }
  
  return baseClasses;
};

export const getProgressBarStyle = (primaryColor: string, progress: number): CSSProperties => ({
  width: `${progress}%`,
  backgroundColor: `var(--color-${primaryColor})`,
  height: '100%',
  borderRadius: '9999px',
  transition: 'width 0.3s ease-in-out'
});