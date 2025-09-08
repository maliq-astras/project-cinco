import { useFactCardState } from './useFactCardState';
import { useFactCardLogic } from './useFactCardLogic';
import { Fact, CategoryType } from '@/types';

interface UseFactCardProps {
  fact: Fact<CategoryType>;
  visibleStackCount?: number;
}

export const useFactCard = ({ fact, visibleStackCount = 0 }: UseFactCardProps) => {
  const state = useFactCardState();
  
  const logic = useFactCardLogic({
    fact,
    visibleStackCount,
    cardRef: state.cardRef
  });

  return {
    // State
    cardRef: state.cardRef,
    t: state.t,
    currentLanguage: state.currentLanguage,
    
    // Logic
    ...logic
  };
};