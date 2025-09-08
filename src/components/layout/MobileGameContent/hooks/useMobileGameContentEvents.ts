import { useEffect } from 'react';

interface UseMobileGameContentEventsProps {
  isDragging: boolean;
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  registerElement: (key: string, element: HTMLElement) => void;
  unregisterElement: (key: string) => void;
}

export const useMobileGameContentEvents = ({
  isDragging,
  dropZoneRef,
  registerElement,
  unregisterElement
}: UseMobileGameContentEventsProps) => {
  // Register the drop zone as the drop target when dragging in mobile layout
  useEffect(() => {
    if (isDragging && dropZoneRef.current) {
      registerElement('fact-card-stack-container', dropZoneRef.current);
    }
    return () => {
      if (isDragging) {
        unregisterElement('fact-card-stack-container');
      }
    };
  }, [isDragging, registerElement, unregisterElement]);

  return {};
};