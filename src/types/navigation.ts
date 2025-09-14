/**
 * Shared navigation type definitions for menu items across layout components
 */

export interface MenuItem {
  label: string;
  onClick: () => void;
  showArrow?: boolean;
  ariaLabel?: string;
  icon?: 'settings' | 'help' | 'feedback' | 'bug';
}