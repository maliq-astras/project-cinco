import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock body scroll
 * Uses CSS classes instead of direct style manipulation
 */
export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLocked) {
      // Add a class to the body to lock scroll
      document.body.classList.add('overflow-hidden');
    } else {
      // Remove the class to unlock scroll
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function to ensure scroll is unlocked when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isLocked]);
};
