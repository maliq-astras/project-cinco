import { useTheme } from '@/contexts/ThemeContext';
import { getLoadingCircleStyle } from '../helpers';

interface UseLanguageSwitchLoaderLogicProps {
  isVisible: boolean;
}

export const useLanguageSwitchLoaderLogic = ({ isVisible }: UseLanguageSwitchLoaderLogicProps) => {
  const { colors } = useTheme();

  const loadingCircleStyle = getLoadingCircleStyle(colors.primary);

  return {
    isVisible,
    loadingCircleStyle
  };
};