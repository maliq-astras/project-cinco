import { useFactCardBackState } from './useFactCardBackState';
import { useFactCardBackLogic } from './useFactCardBackLogic';
import { Fact, CategoryType } from '@/types';

interface UseFactCardBackProps {
  fact: Fact<CategoryType>;
  size: 'small' | 'large';
  isRevealed: boolean;
  inStack: boolean;
}

export const useFactCardBack = (props: UseFactCardBackProps) => {
  const state = useFactCardBackState();
  
  const logic = useFactCardBackLogic({
    ...props,
    colors: state.colors,
    getResponsiveValue: state.getResponsiveValue
  });

  return logic;
};