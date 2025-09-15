import { useMemo } from 'react';
import { useResponsive } from '@/hooks/responsive';
import { calculateMobileHeight, calculateContentHeight } from '../helpers';

interface FeedbackFormData {
  rating?: number;
  difficulty?: number;
  favoriteCategory?: string[];
  leastFavoriteCategory?: string[];
}

interface FeedbackStep {
  id: string;
  title: string;
  isValid?: boolean;
}

interface FeedbackModalLogicProps {
  steps: FeedbackStep[];
  initialFormData: FeedbackFormData;
  handleSubmit: (formData: FeedbackFormData) => Promise<void>;
}

export const useFeedbackModalLogic = (_props: FeedbackModalLogicProps) => {
  const { isMobileMenu, width, height, heightBreakpoint } = useResponsive();
  
  // Use responsive system for mobile detection
  const isMobile = isMobileMenu;

  // Dynamic mobile height using responsive system (includes width check for narrow phones)
  const mobileHeight = useMemo(() => 
    calculateMobileHeight(width, height, heightBreakpoint), 
    [width, height, heightBreakpoint]
  );

  const getMobileHeight = useMemo(() => {
    return () => mobileHeight;
  }, [mobileHeight]);

  const contentStyle = useMemo(() => ({
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'space-between' as const,
    height: calculateContentHeight(isMobile, mobileHeight),
  }), [isMobile, mobileHeight]);

  return {
    isMobile,
    getMobileHeight,
    contentStyle,
  };
};