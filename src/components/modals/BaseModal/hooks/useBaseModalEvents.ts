import React from 'react';

interface UseBaseModalEventsProps {
  onClose: () => void;
  isMobile: boolean;
  dismissible: boolean;
}

export const useBaseModalEvents = ({ onClose, isMobile, dismissible }: UseBaseModalEventsProps) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile && dismissible) {
      onClose();
    }
  };

  const getAriaLabel = (title: React.ReactNode | undefined, action: 'close') => {
    if (action === 'close') {
      if (title && typeof title === 'string') {
        return `Close ${title}`;
      }
      return 'Close modal';
    }
    return '';
  };

  return {
    handleOverlayClick,
    getAriaLabel,
  };
};