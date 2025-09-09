import { useLanguageSwitchLoaderLogic } from './useLanguageSwitchLoaderLogic';

interface UseLanguageSwitchLoaderProps {
  isVisible: boolean;
}

export const useLanguageSwitchLoader = ({ isVisible }: UseLanguageSwitchLoaderProps) => {
  return useLanguageSwitchLoaderLogic({ isVisible });
};