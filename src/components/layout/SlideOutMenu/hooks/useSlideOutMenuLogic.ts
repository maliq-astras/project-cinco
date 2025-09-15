import { MenuItem } from '@/types/navigation';

interface UseSlideOutMenuLogicProps {
  menuItems: MenuItem[];
  onClose: () => void;
}

export const useSlideOutMenuLogic = ({ menuItems: _menuItems, onClose: _onClose }: UseSlideOutMenuLogicProps) => {
  const handleMenuItemClick = (item: MenuItem) => {
    item.onClick();
  };

  return {
    handleMenuItemClick
  };
};