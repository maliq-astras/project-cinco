import { useTranslation } from 'react-i18next';
import { getCategoryName } from '@/helpers/i18nHelpers';
import { getTitleStyle, getResponsiveClasses, getLogoAnimationProps, getTitleAnimationProps } from '../helpers';

interface UseHeaderLogicProps {
  colors: {
    primary: string;
  };
  challenge: any;
  responsiveValues: any;
  breakpoint: string;
  headerEntranceComplete: boolean;
}

export const useHeaderLogic = ({
  colors,
  challenge,
  responsiveValues,
  breakpoint,
  headerEntranceComplete
}: UseHeaderLogicProps) => {
  const { t } = useTranslation();

  // Generate dynamic title styling
  const titleStyle = getTitleStyle(responsiveValues, colors.primary);
  
  // Get responsive CSS classes
  const headerClasses = getResponsiveClasses(breakpoint);
  
  // Get category name for display
  const categoryName = challenge?.category ? getCategoryName(challenge.category, t) : null;

  // Get animation props using constants
  const logoAnimationProps = getLogoAnimationProps(headerEntranceComplete);
  const titleAnimationProps = getTitleAnimationProps(headerEntranceComplete);

  return {
    titleStyle,
    headerClasses,
    categoryName,
    logoAnimationProps,
    titleAnimationProps
  };
};