import { useState } from 'react';
import { ThemeColors, categoryColorMap } from '@/types';
import { categoryNameToType } from '@/utils/loadingAnimationUtils';

interface UseLoadingAnimationStateProps {
  finalCategory: string;
}

export const useLoadingAnimationState = ({ finalCategory }: UseLoadingAnimationStateProps) => {
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [currentColor, setCurrentColor] = useState<ThemeColors>(
    categoryColorMap[categoryNameToType.COUNTRIES]
  );

  return {
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
  };
};