import { getMenuContainerStyle, getMenuItemStyle } from '../helpers';

interface UseNavDropdownMenuLogicProps {
  colors: {
    primary: string;
    secondary: string;
  };
}

export const useNavDropdownMenuLogic = ({
  colors
}: UseNavDropdownMenuLogicProps) => {
  // Style calculations using helpers
  const menuContainerStyle = getMenuContainerStyle(colors.primary);
  const menuItemStyle = getMenuItemStyle(colors.primary);

  return {
    menuContainerStyle,
    menuItemStyle
  };
};