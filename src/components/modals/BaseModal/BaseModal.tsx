import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inter } from 'next/font/google';
import { useBaseModal } from './hooks';
import { baseModalStyles, getMobilePanelClass, getMobilePanelStyle, getDesktopPanelStyle } from './helpers';
import { baseModalAnimations } from './helpers';
import { createModalPortal } from './helpers';

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
  desktopMaxHeight?: string; // New prop for custom desktop max height
}

const BaseModal = React.memo<BaseModalProps>(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  colors,
  className,
  dismissible = true,
  mobileHeight = '75dvh',
  desktopMaxHeight // New prop
}) => {
  const { 
    isMobile, 
    shouldRenderAsPortal, 
    handleOverlayClick, 
    getAriaLabel 
  } = useBaseModal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    colors, 
    className, 
    dismissible, 
    mobileHeight,
    desktopMaxHeight
  });

  const modalContent = (() => {
    if (isMobile) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              key="mobile-modal"
              className={baseModalStyles.mobileContainer}
              {...baseModalAnimations.overlay}
            >
              <motion.div
                className={getMobilePanelClass() + (className ? ` ${className}` : '')}
                style={getMobilePanelStyle(colors.primary, mobileHeight)}
                {...baseModalAnimations.mobilePanel}
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
                          aria-label={getAriaLabel(title, 'close')}
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
                        aria-label={getAriaLabel(undefined, 'close')}
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

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="desktop-modal"
            className={baseModalStyles.desktopContainer}
            onClick={handleOverlayClick}
            {...baseModalAnimations.overlay}
          >
            <motion.div 
              className={`${inter.className} ${baseModalStyles.desktopPanelClass} ${className || 'max-w-2xl'}`}
              style={getDesktopPanelStyle(colors.primary, desktopMaxHeight)}
              {...baseModalAnimations.desktopPanel}
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
                      aria-label={getAriaLabel(title, 'close')}
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
                    aria-label={getAriaLabel(undefined, 'close')}
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

  return shouldRenderAsPortal ? createModalPortal(modalContent) : null;
});

BaseModal.displayName = 'BaseModal';
export default BaseModal; 