import { useNavDropdownMenuState } from './useNavDropdownMenuState';
import { useNavDropdownMenuEvents } from './useNavDropdownMenuEvents';
import { useNavDropdownMenuLogic } from './useNavDropdownMenuLogic';
import { MenuItem } from '@/types/navigation';

interface UseNavDropdownMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  colors: {
    primary: string;
    secondary: string;
  };
  menuTitle?: string;
  onClose: () => void;
}

export const useNavDropdownMenu = ({
  isOpen,
  menuItems,
  colors,
  menuTitle = 'ui.navigation.menu',
  onClose
}: UseNavDropdownMenuProps) => {
  const state = useNavDropdownMenuState();
  
  const events = useNavDropdownMenuEvents({
    onClose
  });
  
  const logic = useNavDropdownMenuLogic({
    colors
  });

  return {
    // Props pass-through
    isOpen,
    menuItems,
    colors,
    menuTitle,
    onClose,
    
    // State
    t: state.t,
    menuRef: state.menuRef,
    
    // Events
    handleKeyDown: events.handleKeyDown,
    
    // Logic
    menuContainerStyle: logic.menuContainerStyle,
    menuItemStyle: logic.menuItemStyle
  };
};