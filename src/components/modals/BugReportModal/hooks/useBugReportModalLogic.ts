import { useMemo } from 'react';
import { useResponsive } from '@/hooks/responsive';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useThemeDOM } from '@/hooks/theme';
import { calculateMobileHeight, calculateContentHeight } from '../helpers';

interface BugReportFormData {
  bugType?: string[];
  deviceType?: string;
  bugDetails?: string;
  file?: File | null;
}

interface BugReportStep {
  id: string;
  title: string;
  isValid?: boolean;
}

interface BugReportModalLogicProps {
  steps: BugReportStep[];
  initialFormData: BugReportFormData;
  handleSubmit: (formData: BugReportFormData) => Promise<void>;
}

export const useBugReportModalLogic = (_props: BugReportModalLogicProps) => {
  const { isMobileMenu, width, height, heightBreakpoint } = useResponsive();
  const { colors } = useTheme();
  const { hasClass } = useThemeDOM();
  
  // Use responsive system for mobile detection
  const isMobile = isMobileMenu;
  
  // Theme-related computed values
  const isDarkMode = hasClass('dark');
  const textSegmentBg = isDarkMode ? '#18181b' : 'white';

  // Dynamic mobile height using responsive system (includes width check for narrow phones)
  const mobileHeight = useMemo(() => 
    calculateMobileHeight(width, height, heightBreakpoint), 
    [width, height, heightBreakpoint]
  );

  const getMobileHeight = useMemo(() => {
    return () => mobileHeight;
  }, [mobileHeight]);

  // Custom desktop height logic for BugReport
  const getDesktopMaxHeight = useMemo(() => {
    return () => {
      if (typeof window === 'undefined') return '90dvh';
      return window.innerHeight < 715 ? '100dvh' : '90dvh';
    };
  }, []);

  const contentStyle = useMemo(() => ({
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'space-between' as const,
    height: calculateContentHeight(isMobile, mobileHeight),
  }), [isMobile, mobileHeight]);

  return {
    // Theme
    colors,
    isDarkMode,
    textSegmentBg,
    
    // Responsive
    isMobile,
    
    // Height calculations
    getMobileHeight,
    getDesktopMaxHeight,
    contentStyle,
  };
};