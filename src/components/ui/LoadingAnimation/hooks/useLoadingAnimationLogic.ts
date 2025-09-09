import React, { useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeDOM } from '@/hooks/theme';
import { useTranslation } from 'react-i18next';
import { ThemeColors, categoryColorMap } from '@/types';
import { SAMPLE_CATEGORIES, shuffleArray, categoryNameToType } from '@/utils/loadingAnimationUtils';
import { TIMING_CONSTANTS, calculateAnimationSpeed } from '../helpers';
import { getThemeAdjustedPrimaryColor } from '../helpers';
import { getCategoryName } from '@/helpers/i18nHelpers';

const LOADING_PLACEHOLDER = "PLEASE WAIT...";
const PLACEHOLDER_COLORS: ThemeColors = {
  primary: 'gray-500',
  secondary: 'gray-400',
  accent: 'gray-600',
  light: 'gray-100',
  dark: 'gray-900'
};

interface UseLoadingAnimationLogicProps {
  finalCategory: string;
  isChallengeFetched: boolean;
  onComplete: () => void;
  mounted: boolean;
  setMounted: React.Dispatch<React.SetStateAction<boolean>>;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  isAnimationComplete: boolean;
  setIsAnimationComplete: React.Dispatch<React.SetStateAction<boolean>>;
  currentColor: ThemeColors;
  setCurrentColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

export const useLoadingAnimationLogic = ({
  finalCategory,
  isChallengeFetched,
  onComplete,
  mounted,
  setMounted,
  categories,
  setCategories,
  currentIndex,
  setCurrentIndex,
  isAnimationComplete,
  setIsAnimationComplete,
  currentColor,
  setCurrentColor
}: UseLoadingAnimationLogicProps) => {
  const { darkMode, highContrastMode, getAdjustedColorClass } = useTheme();
  const { isBrowser, getCSSProperty, hasClass } = useThemeDOM();
  const { t } = useTranslation('common');

  // Set mounted to true after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  // Initialize categories
  useEffect(() => {
    if (mounted) {
      const filteredCategories = SAMPLE_CATEGORIES.filter(
        category => category.toUpperCase() !== finalCategory.toUpperCase()
      );
      const shuffled = shuffleArray(filteredCategories);
      setCategories([...shuffled, finalCategory.toUpperCase()]);
    }
  }, [mounted, finalCategory, setCategories]);

  // Update current color when index changes
  useEffect(() => {
    if (categories.length > 0 && currentIndex < categories.length) {
      const categoryName = categories[currentIndex];
      setCurrentColor(
        categoryName === LOADING_PLACEHOLDER 
          ? PLACEHOLDER_COLORS 
          : categoryColorMap[categoryNameToType[categoryName] || categoryNameToType.COUNTRIES]
      );
    }
  }, [categories, currentIndex, setCurrentColor]);

  // Handle animation
  useEffect(() => {
    if (!mounted || categories.length === 0) return;
    
    let timeoutId: NodeJS.Timeout;
    
    const animate = () => {
      if (currentIndex >= categories.length - 1) {
        setCurrentIndex(categories.length - 1);
        setIsAnimationComplete(true);
        
        if (isChallengeFetched) {
          timeoutId = setTimeout(onComplete, TIMING_CONSTANTS.FINAL_CATEGORY_HOLD_TIME);
        }
        return;
      }
      
      setCurrentIndex(prev => prev + 1);
      
      const nextDelay = calculateAnimationSpeed(currentIndex, categories.length);
      timeoutId = setTimeout(animate, nextDelay);
    };
    
    timeoutId = setTimeout(animate, TIMING_CONSTANTS.INITIAL_DELAY);
    
    return () => clearTimeout(timeoutId);
  }, [categories, currentIndex, isChallengeFetched, onComplete, mounted, setCurrentIndex, setIsAnimationComplete]);

  // Watch for challenge fetch completion
  useEffect(() => {
    if (!mounted) return;
    if (isAnimationComplete && isChallengeFetched) {
      const timeoutId = setTimeout(onComplete, TIMING_CONSTANTS.COMPLETION_DELAY);
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimationComplete, isChallengeFetched, onComplete, mounted]);

  // Get theme-adjusted color info
  const colorInfo = getThemeAdjustedPrimaryColor(
    currentColor,
    darkMode,
    highContrastMode,
    isBrowser,
    getCSSProperty,
    getAdjustedColorClass
  );

  // Get current category and related computed values
  const currentCategory = categories.length > 0 ? categories[currentIndex] : "";
  const isShowingFinalCategory = currentIndex === categories.length - 1 && currentCategory !== "Please wait...";
  const translatedCategory = currentCategory ? getCategoryName(currentCategory, t) : '';
  const isPlaceholder = currentCategory === "PLEASE WAIT...";
  const isHighContrast = hasClass('high-contrast');

  return {
    currentCategory,
    isShowingFinalCategory,
    colorInfo,
    translatedCategory,
    isPlaceholder,
    isHighContrast,
    darkMode,
    challengeFetched: isChallengeFetched,
    getCSSProperty,
    t
  };
};