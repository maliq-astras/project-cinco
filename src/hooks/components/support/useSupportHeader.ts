import { useTheme } from '../../../contexts/ThemeContext';
import { useSupportPage } from './useSupportPage';

export const useSupportHeader = () => {
  const { colors } = useTheme();
  const { isThemeReady } = useSupportPage('');

  return {
    colors,
    isThemeReady
  };
}; 