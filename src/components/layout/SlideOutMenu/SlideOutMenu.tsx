'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Righteous } from 'next/font/google';
import { MenuItem } from '@/types/navigation';
import { useSlideOutMenu } from './hooks';
import {
  getBackdropAnimationProps,
  getSlideMenuAnimationProps,
  getCloseButtonAnimationProps,
  getMenuItemAnimationProps,
  getBackdropStyle,
  getMenuTitleStyle,
  getCloseButtonStyle,
  getMenuItemIcon
} from './helpers';

const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  colors: {
    primary: string;
    secondary: string;
  };
}

const SlideOutMenu = React.memo(function SlideOutMenu({
  isOpen,
  onClose,
  menuItems,
  colors
}: SlideOutMenuProps) {
  const { t } = useTranslation();
  const { handleMenuItemClick } = useSlideOutMenu({ isOpen, onClose, menuItems });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            {...getBackdropAnimationProps()}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black bg-opacity-70"
            style={getBackdropStyle()}
          />

          {/* Slide-out menu */}
          <motion.div
            {...getSlideMenuAnimationProps()}
            className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-[1000] bg-white dark:bg-black shadow-2xl border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 
                className={`${righteous.className} text-xl font-normal`}
                style={getMenuTitleStyle(colors.primary)}
              >
                MENU
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2"
                {...getCloseButtonAnimationProps()}
                aria-label={t('ui.buttons.close')}
              >
                <X 
                  className="w-5 h-5" 
                  style={getCloseButtonStyle(colors.primary)}
                />
              </motion.button>
            </div>

            {/* Menu items */}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    {...getMenuItemAnimationProps(index)}
                  >
                    <button
                      onClick={() => handleMenuItemClick(item)}
                      className={`${righteous.className} w-full text-left p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-normal uppercase tracking-wide flex items-center gap-3`}
                      aria-label={item.ariaLabel ? t(item.ariaLabel) : t(item.label)}
                    >
                      {getMenuItemIcon(item.icon, `var(--color-${colors.primary})`, 20)}
                      {t(item.label)}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

SlideOutMenu.displayName = 'SlideOutMenu';

export default SlideOutMenu;