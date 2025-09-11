import { MenuItem } from '@/types/navigation';

interface UseSlideOutMenuLogicProps {
  menuItems: MenuItem[];
  onClose: () => void;
}

export const useSlideOutMenuLogic = ({ menuItems, onClose }: UseSlideOutMenuLogicProps) => {
  const handleMenuItemClick = (item: MenuItem) => {
    item.onClick();
  };

  return {
    handleMenuItemClick
  };
};