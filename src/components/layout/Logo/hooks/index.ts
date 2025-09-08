import { useLogoState } from './useLogoState';
import { useLogoEffects } from './useLogoEffects';
import { useLogoLogic } from './useLogoLogic';

interface UseLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const useLogo = (props: UseLogoProps = {}) => {
  const state = useLogoState();
  useLogoEffects(state);
  const logic = useLogoLogic({
    mounted: state.mounted,
    width: props.width,
    height: props.height,
    className: props.className
  });
  
  return { 
    ...logic
  };
};