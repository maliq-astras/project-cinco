import { useState } from 'react';
import { useResponsive } from '@/hooks/responsive';

interface UseAnswerDetailsModalProps {
  isOpen: boolean;
}

export const useAnswerDetailsModal = ({}: UseAnswerDetailsModalProps) => {
  const [selectedFact, setSelectedFact] = useState<number | null>(null);

  const { 
    breakpoint, 
    heightBreakpoint, 
    isLandscape, 
    isPortrait,
    responsiveValues,
    width,
    height
  } = useResponsive();

  const isMobileDevice = breakpoint === 'xs';
  const isExtraNarrowPhone = breakpoint === 'xs' && width <= 330;
  const isNarrowPhone = breakpoint === 'xs' && width > 330 && width <= 375;
  const isBigMobileDevice = breakpoint === 'sm' && height > 850;
  const isLimitedHeightLandscape = isLandscape && heightBreakpoint === 'short';


  return {
    selectedFact,
    setSelectedFact,
    isMobileDevice,
    isExtraNarrowPhone,
    isNarrowPhone,
    isBigMobileDevice,
    isLimitedHeightLandscape,
    isLandscape,
    // Responsive utilities
    breakpoint,
    heightBreakpoint,
    isPortrait,
    responsiveValues
  };
};
