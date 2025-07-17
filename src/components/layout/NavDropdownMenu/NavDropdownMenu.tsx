import React from 'react';
import { Inter } from 'next/font/google';
import { useTranslation } from 'react-i18next';
import { navDropdownMenuStyles } from './navDropdownMenuStyles';

const inter = Inter({ subsets: ['latin'] });

interface MenuItem {
  label: string;
  onClick: () => void;
  showArrow?: boolean;
  ariaLabel?: string;
}

interface NavDropdownMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  colors: {
    primary: string;
    secondary: string;
  };
  menuTitle?: string;
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
  menuTitle = 'ui.navigation.menu' 
}) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={navDropdownMenuStyles.menuContainer}
      style={navDropdownMenuStyles.menuContainerStyle(colors.primary)}
      role="menu"
      aria-label={t(menuTitle)}
    >
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`${inter.className} ${navDropdownMenuStyles.menuItem}`}
          style={navDropdownMenuStyles.menuItemStyle(colors.primary)}
          role="menuitem"
          aria-label={item.ariaLabel ? t(item.ariaLabel) : t(item.label)}
        >
          <span style={navDropdownMenuStyles.textContainer}>{t(item.label)}</span>
          {item.showArrow && (
            <div style={navDropdownMenuStyles.arrowContainer}>
              <svg 
                className={navDropdownMenuStyles.arrowIcon}
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