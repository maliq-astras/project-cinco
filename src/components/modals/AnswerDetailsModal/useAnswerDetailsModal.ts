import { useState } from 'react';
import { deviceDetection } from '@/helpers/deviceHelpers';

interface UseAnswerDetailsModalProps {
  isOpen: boolean;
}

export const useAnswerDetailsModal = ({}: UseAnswerDetailsModalProps) => {
  const [selectedFact, setSelectedFact] = useState<number | null>(null);

  // Detect mobile device for special mobile styling
  const isMobileDevice = typeof window !== 'undefined' ? 
    window.innerWidth < 480 && Math.max(window.innerWidth, window.innerHeight) < 1000 : false;
  const isExtraNarrowPhone = typeof window !== 'undefined' ? window.innerWidth <= 330 : false;
  const isNarrowPhone = typeof window !== 'undefined' ? !isExtraNarrowPhone && window.innerWidth <= 375 : false;
  
  // Detect bigger phones that need extra spacing
  const isBigMobileDevice = typeof window !== 'undefined' ? 
    isMobileDevice && Math.max(window.innerWidth, window.innerHeight) > 850 : false;
  
  // Detect landscape screens with limited height that need smaller content
  const isLimitedHeightLandscape = typeof window !== 'undefined' ? 
    window.innerWidth > window.innerHeight && 
    window.innerHeight < 1000 : false;
  
  // Detect regular landscape (tablets)
  const isLandscape = typeof window !== 'undefined' ? 
    window.innerWidth > window.innerHeight : false;
  
  // Detect Surface Duo for special sizing
  const isSurfaceDuo = typeof window !== 'undefined' ? deviceDetection.isSurfaceDuo() : false;

  return {
    selectedFact,
    setSelectedFact,
    isMobileDevice,
    isExtraNarrowPhone,
    isNarrowPhone,
    isBigMobileDevice,
    isLimitedHeightLandscape,
    isLandscape,
    isSurfaceDuo
  };
};
