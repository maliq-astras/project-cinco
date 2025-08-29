import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';
import { createPortal } from 'react-dom';
import { baseModalStyles } from './BaseModal.styles';
import { useResponsive } from '@/hooks/responsive';

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
  dismissible?: boolean;
  mobileHeight?: string; 
}



const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  colors,
  className,
  dismissible = true, // Default to true for backwards compatibility
  mobileHeight = '75vh' // Default to 75vh if not provided
}) => {

  // Use our new responsive system
  const { isMobileMenu } = useResponsive();
  
  // Only use slide-up modals for actual mobile phones (not tablets)
  // Tablets in landscape should use regular modals like desktop
  const isMobile = isMobileMenu;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isMobile && dismissible) {
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
                className={baseModalStyles.mobilePanelClass(mobileHeight) + (className ? ` ${className}` : '')}
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
                      {dismissible && (
                      <button 
                        onClick={onClose}
                        className={baseModalStyles.closeButtonClass}
                        aria-label={`Close ${typeof title === 'string' ? title : 'modal'}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      )}
                    </div>
                  )}
                  {!title && dismissible && (
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
                  {dismissible && (
                  <button 
                    onClick={onClose}
                    className={baseModalStyles.closeButtonClass}
                    aria-label={`Close ${typeof title === 'string' ? title : 'modal'}`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  )}
                </div>
              )}
              {!title && dismissible && (
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