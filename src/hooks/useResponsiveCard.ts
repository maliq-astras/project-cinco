import { useState, useEffect, RefObject } from 'react';

export function useResponsiveCard(cardRef: RefObject<HTMLDivElement | null>) {
  const [iconSize, setIconSize] = useState(40);

  // Dynamically adjust icon size based on card size
  useEffect(() => {
    const updateIconSize = () => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
        const newIconSize = Math.max(40, Math.round(cardWidth * 0.18));
        setIconSize(newIconSize);
      }
    };
    
    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    
    return () => {
      window.removeEventListener('resize', updateIconSize);
    };
  }, [cardRef]);

  return { iconSize };
} 