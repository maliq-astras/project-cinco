import { CSSProperties } from 'react';
import { CATEGORY_COLOR_MAPPING, categoryColorMap, CategoryType } from '@/types';

export const getStarColor = (star: number, value: number, primaryColor: string, isDark: boolean) => {
  if (star <= value) {
    return `var(--color-${primaryColor})`;
  }
  return isDark ? '#444' : '#ccc';
};

export const getDifficultyButtonStyle = (
  idx: number, 
  isActive: boolean, 
  primaryColor: string, 
  sizes: number[]
) => ({
  width: sizes[idx - 1],
  height: sizes[idx - 1],
  borderRadius: '50%',
  border: `3px solid var(--color-${primaryColor})`,
  background: isActive ? `var(--color-${primaryColor})` : 'transparent',
  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  cursor: 'pointer',
  transition: 'background 0.15s, box-shadow 0.15s',
});

export const getCategoryButtonStyle = (
  option: string,
  selected: boolean,
  disabled: boolean
): {
  borderClass: string;
  textClass: string;
  bgClass: string;
  style: {
    opacity: number;
    cursor: string;
  };
} => {
  // Find the category type enum value that matches the option
  const categoryType = Object.values(CategoryType).find(cat => cat === option);
  const colorFamily = categoryType ? CATEGORY_COLOR_MAPPING[categoryType]?.tailwind || 'gray' : 'gray';
  const colorShade = categoryType ? categoryColorMap[categoryType]?.primary?.split('-')[1] || '400' : '400';
  
  return {
    borderClass: `border-${colorFamily}-${colorShade}`,
    textClass: selected ? 'text-white' : `text-${colorFamily}-${colorShade}`,
    bgClass: selected ? `bg-${colorFamily}-${colorShade}` : 'bg-transparent',
    style: {
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }
  };
};

export const getPrimaryButtonStyle = (primaryColor: string): CSSProperties => ({
  backgroundColor: `var(--color-${primaryColor})`,
  color: 'white'
});

export const getProgressBarStyle = (primaryColor: string, progress: number): CSSProperties => ({
  width: `${progress}%`,
  backgroundColor: `var(--color-${primaryColor})`,
  height: '100%',
  borderRadius: '9999px',
  transition: 'width 0.3s ease-in-out'
});