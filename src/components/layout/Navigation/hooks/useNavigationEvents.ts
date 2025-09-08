import { useEffect } from 'react';
import { useDOMRefs } from '@/providers/DOMRefsProvider';

interface UseNavigationEventsProps {
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  setIsDropdownOpen: (value: boolean) => void;
}

export const useNavigationEvents = ({
  isDropdownOpen,
  dropdownRef,
  setIsDropdownOpen
}: UseNavigationEventsProps) => {
  const { registerElement, unregisterElement, getElement } = useDOMRefs();

  // Register body element for global click detection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.document?.body) {
      registerElement('body', window.document.body);
    }
    return () => {
      unregisterElement('body');
    };
  }, [registerElement, unregisterElement]);

  // Add click listener to body when dropdown is open
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleGlobalClick = (event: Event) => {
      const clickedElement = event.target as Node;
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(clickedElement);
      
      if (isOutsideDropdown) {
        setIsDropdownOpen(false);
      }
    };

    const bodyElement = getElement('body');
    if (bodyElement) {
      bodyElement.addEventListener('click', handleGlobalClick);
    }

    return () => {
      if (bodyElement) {
        bodyElement.removeEventListener('click', handleGlobalClick);
      }
    };
  }, [isDropdownOpen, getElement, dropdownRef, setIsDropdownOpen]);

  return {};
};