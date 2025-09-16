import { useState, useEffect } from 'react';
import { useResponsive } from '@/hooks/responsive';

interface UseAnswerDetailsModalStateProps {
  isOpen: boolean;
  onClose: () => void;
  answer: string;
}

export const useAnswerDetailsModalState = ({ isOpen, onClose, answer }: UseAnswerDetailsModalStateProps) => {
  const [selectedFact, setSelectedFact] = useState<number | null>(null);
  
  const { 
    isMobileLayout,
    responsiveValues,
    width
  } = useResponsive();

  // Track viewport height for vertical resize
  const [viewportHeight, setViewportHeight] = useState(() => 
    typeof window !== 'undefined' ? window.innerHeight : 0
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    selectedFact,
    setSelectedFact,
    isMobileLayout,
    responsiveValues,
    width,
    viewportHeight,
    isOpen,
    onClose,
    answer
  };
};