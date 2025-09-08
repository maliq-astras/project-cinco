import React from 'react';

interface UseNavDropdownMenuEventsProps {
  onClose: () => void;
}

export const useNavDropdownMenuEvents = ({
  onClose
}: UseNavDropdownMenuEventsProps) => {
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  return {
    handleKeyDown
  };
};