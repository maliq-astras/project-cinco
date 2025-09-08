import React from 'react';
import { Inter } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '@/types/navigation';
import styles from './NavDropdownMenu.module.css';

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
  const { t } = useTranslation();
  const menuRef = React.useRef<HTMLDivElement>(null);
  
  // Helper functions for dynamic styles
  const getMenuContainerStyle = (primaryColor: string) => ({
    borderColor: `var(--color-${primaryColor})`
  });
  
  const getMenuItemStyle = (primaryColor: string) => ({
    color: `var(--color-${primaryColor})`
  });
  
  
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={menuRef}
      className={styles.menuContainer}
      style={getMenuContainerStyle(colors.primary)}
      role="menu"
      aria-label={t(menuTitle)}
      onKeyDown={handleKeyDown}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`${inter.className} ${styles.menuItem}`}
          style={getMenuItemStyle(colors.primary)}
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