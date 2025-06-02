import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';
import { createPortal } from 'react-dom';
import { deviceDetection } from '../../helpers/deviceHelpers';
import { useTheme } from '../../contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  colors: {
    primary: string;
  };
  className?: string;
}

const baseModalStyles = {
  // Main containers
  mobileContainer: "fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-md",
  mobilePanel: (primaryColor: string) => ({
    borderTop: `4px solid var(--color-${primaryColor})`,
    borderLeft: `1px solid var(--color-${primaryColor})`,
    borderRight: `1px solid var(--color-${primaryColor})`,
    maxHeight: '95vh'
  }),
  mobilePanelClass: "absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-lg h-[75vh]",
  mobileDragIndicator: "w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto my-2 max-w-[4rem]",
  
  desktopContainer: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-md",
  desktopPanel: (primaryColor: string) => ({
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight: '90vh'
  }),
  desktopPanelClass: "bg-white dark:bg-black rounded-xl shadow-lg p-8 w-full mx-4 overflow-hidden",
  
  contentContainer: "p-4",
  
  // Header
  header: "flex justify-between items-center mb-6 relative",
  titleClass: "text-xl font-bold text-gray-800 dark:text-white absolute left-1/2 transform -translate-x-1/2",
  closeButtonClass: "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-auto text-gray-800 dark:text-white",
  
  // Animations
  overlayAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  mobilePanelAnimation: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'tween', duration: 0.3 }
  }
};

const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  colors,
  className
}) => {
  // Get dark mode state from theme context
  const { darkMode } = useTheme();
  
  // Use proper device detection from deviceHelpers
  const isMobile = typeof window !== 'undefined' ? deviceDetection.isMobilePhone() : false;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose();
    }
  };

  // Create portal content
  const modalContent = (() => {
    // For mobile, render a slide-up panel
    if (isMobile) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              key="mobile-modal"
              className={baseModalStyles.mobileContainer}
              {...baseModalStyles.overlayAnimation}
            >
              <motion.div
                className={baseModalStyles.mobilePanelClass + (className ? ` ${className}` : '')}
                style={baseModalStyles.mobilePanel(colors.primary)}
                {...baseModalStyles.mobilePanelAnimation}
              >
                <div className={baseModalStyles.mobileDragIndicator}></div>
                <div className={`${inter.className} ${baseModalStyles.contentContainer}`}>
                  {title && (
                    <div className={baseModalStyles.header}>
                      <h1 className={baseModalStyles.titleClass}>
                        {title}
                      </h1>
                      <button 
                        onClick={onClose}
                        className={baseModalStyles.closeButtonClass}
                        aria-label={`Close ${typeof title === 'string' ? title : 'modal'}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {!title && (
                    <div className="flex justify-end mb-4">
                      <button 
                        onClick={onClose}
                        className={baseModalStyles.closeButtonClass}
                        aria-label="Close modal"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {children}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      );
    }

    // For desktop, render a centered modal
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="desktop-modal"
            className={baseModalStyles.desktopContainer}
            onClick={handleOverlayClick}
            {...baseModalStyles.overlayAnimation}
          >
            <motion.div 
              className={`${inter.className} ${baseModalStyles.desktopPanelClass} ${className || 'max-w-2xl'}`}
              style={baseModalStyles.desktopPanel(colors.primary)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {title && (
                <div className={baseModalStyles.header}>
                  <h1 className={baseModalStyles.titleClass}>
                    {title}
                  </h1>
                  <button 
                    onClick={onClose}
                    className={baseModalStyles.closeButtonClass}
                    aria-label={`Close ${typeof title === 'string' ? title : 'modal'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {!title && (
                <div className="flex justify-end mb-6">
                  <button 
                    onClick={onClose}
                    className={baseModalStyles.closeButtonClass}
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  })();

  // Render using portal to document.body, bypassing any parent transforms
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  // Fallback for SSR
  return null;
};

export default BaseModal; 