import { useEmptyStackPlaceholderState } from './useEmptyStackPlaceholderState';

export const useEmptyStackPlaceholder = () => {
  const state = useEmptyStackPlaceholderState();

  return {
    // State
    t: state.t
  };
};