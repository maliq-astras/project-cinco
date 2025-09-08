import React from 'react';
import { Inter } from 'next/font/google';
import { MenuItem } from '@/types/navigation';
import styles from './NavDropdownMenu.module.css';
import { useNavDropdownMenu } from './hooks';

const inter = Inter({ subsets: ['latin'] });

interface NavDropdownMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  colors: {
    primary: string;
    secondary: string;
  };
  menuTitle?: string;
  onClose: () => void;
}

/**
 * NavDropdownMenu component
 * 
 * Renders a dropdown menu with navigation items that supports i18n
 * translation for all text content and accessibility labels.
 */
const NavDropdownMenu: React.FC<NavDropdownMenuProps> = ({ 
  isOpen, 
  menuItems, 
  colors,
  menuTitle = 'ui.navigation.menu',
  onClose
}) => {
  const {
    t,
    menuRef,
    handleKeyDown,
    menuContainerStyle,
    menuItemStyle
  } = useNavDropdownMenu({
    isOpen,
    menuItems,
    colors,
    menuTitle,
    onClose
  });
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={menuRef}
      className={styles.menuContainer}
      style={menuContainerStyle}
      role="menu"
      aria-label={t(menuTitle)}
      onKeyDown={handleKeyDown}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`${inter.className} ${styles.menuItem}`}
          style={menuItemStyle}
          role="menuitem"
          aria-label={item.ariaLabel ? t(item.ariaLabel) : t(item.label)}
        >
          <span className={styles.textContainer}>{t(item.label)}</span>
          {item.showArrow && (
            <div className={styles.arrowContainer}>
              <svg 
                className={styles.arrowIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 17L17 7M17 7H8M17 7V16" 
                />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default NavDropdownMenu; 