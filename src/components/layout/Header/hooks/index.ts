import { useHeaderState } from './useHeaderState';
import { useHeaderLogic } from './useHeaderLogic';

interface UseHeaderProps {
  headerEntranceComplete?: boolean;
}

export const useHeader = (props: UseHeaderProps = {}) => {
  const state = useHeaderState();
  
  const logic = useHeaderLogic({
    colors: state.colors,
    challenge: state.challenge,
    responsiveValues: state.responsiveValues,
    breakpoint: state.breakpoint,
    headerEntranceComplete: props.headerEntranceComplete || false
  });

  return {
    // State
    colors: state.colors,
    challenge: state.challenge,
    logoRef: state.logoRef,
    categoryTitleRef: state.categoryTitleRef,
    responsiveValues: state.responsiveValues,
    breakpoint: state.breakpoint,
    
    // Logic
    titleStyle: logic.titleStyle,
    headerClasses: logic.headerClasses,
    categoryName: logic.categoryName,
    logoAnimationProps: logic.logoAnimationProps,
    titleAnimationProps: logic.titleAnimationProps
  };
};