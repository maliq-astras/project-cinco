import { useEffect } from 'react';

interface UseLogoEffectsParams {
  setMounted: (mounted: boolean) => void;
}

export const useLogoEffects = ({ setMounted }: UseLogoEffectsParams) => {
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);
};