import { useSlideOutMenuState } from './useSlideOutMenuState';
import { useSlideOutMenuLogic } from './useSlideOutMenuLogic';
import { MenuItem } from '@/types/navigation';

interface UseSlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export const useSlideOutMenu = ({ isOpen, onClose, menuItems }: UseSlideOutMenuProps) => {
  // State hook
  useSlideOutMenuState({ isOpen, onClose });
  
  // Logic hook
  const logic = useSlideOutMenuLogic({ menuItems, onClose });

  return {
    handleMenuItemClick: logic.handleMenuItemClick
  };
};