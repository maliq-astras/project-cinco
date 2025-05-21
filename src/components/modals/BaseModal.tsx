import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  colors: {
    primary: string;
  };
  isMobile: boolean;
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
  mobilePanelClass: "absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-xl shadow-lg min-h-[510px]",
  mobileDragIndicator: "w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto my-2 max-w-[4rem]",
  
  desktopContainer: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 backdrop-blur-md",
  desktopPanel: (primaryColor: string) => ({
    border: `2px solid var(--color-${primaryColor})`,
    maxHeight: '90vh'
  }),
  desktopPanelClass: "bg-white dark:bg-black rounded-xl shadow-lg p-8 max-w-2xl w-full mx-4",
  
  contentContainer: "p-6",
  
  // Header
  header: "flex justify-between items-center mb-6",
  title: (darkMode: boolean, primaryColor: string) => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  titleClass: "text-xl font-bold dark:text-white",
  closeButton: (darkMode: boolean, primaryColor: string) => ({
    color: darkMode ? 'white' : `var(--color-${primaryColor})`
  }),
  closeButtonClass: "p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
  
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
  isMobile,
  className
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile) {
      onClose();
    }
  };

  // For mobile, render a slide-up panel
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div 
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
              <div className={baseModalStyles.header}>
                <h2 
                  className={baseModalStyles.titleClass}
                  style={baseModalStyles.title(false, colors.primary)}
                >
                  {title}
                </h2>
                <button 
                  onClick={onClose}
                  className={baseModalStyles.closeButtonClass}
                  style={baseModalStyles.closeButton(false, colors.primary)}
                  aria-label={`Close ${typeof title === 'string' ? title : 'modal'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // For desktop, render a centered modal
  return (
    <div 
      className={baseModalStyles.desktopContainer}
      onClick={handleOverlayClick}
    >
      <div 
        className={`${inter.className} ${baseModalStyles.desktopPanelClass}${className ? ` ${className}` : ''}`}
        style={baseModalStyles.desktopPanel(colors.primary)}
      >
        <div className={baseModalStyles.header}>
          <h2 
            className={baseModalStyles.titleClass}
            style={baseModalStyles.title(false, colors.primary)}
          >
            {title}
          </h2>
          <button 
            onClick={onClose}
            className={baseModalStyles.closeButtonClass}
            style={baseModalStyles.closeButton(false, colors.primary)}
            aria-label={`Close ${typeof title === 'string' ? title : 'modal'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BaseModal; 