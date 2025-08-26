'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Inter, Righteous } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const righteous = Righteous({ weight: '400', subsets: ['latin'] });

interface MenuItem {
  label: string;
  onClick: () => void;
  ariaLabel?: string;
}

interface SlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  colors: {
    primary: string;
    secondary: string;
  };
}

const SlideOutMenu: React.FC<SlideOutMenuProps> = ({
  isOpen,
  onClose,
  menuItems,
  colors
}) => {
  const { t } = useTranslation();

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-black bg-opacity-70"
            style={{
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* Slide-out menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-[1000] bg-white dark:bg-black shadow-2xl border-l border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 
                className={`${righteous.className} text-xl font-normal`}
                style={{ color: `var(--color-${colors.primary})` }}
              >
                Menu
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={t('ui.buttons.close')}
              >
                <X 
                  className="w-5 h-5" 
                  style={{ color: `var(--color-${colors.primary})` }}
                />
              </motion.button>
            </div>

            {/* Menu items */}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => {
                        item.onClick();
                        onClose();
                      }}
                      className={`${inter.className} w-full text-left p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white font-medium`}
                      aria-label={item.ariaLabel ? t(item.ariaLabel) : t(item.label)}
                    >
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
};

export default SlideOutMenu;