import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAnswerDetailsModal } from './hooks';
import { answerDetailsModalStyles } from './helpers';

interface AnswerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: string;
}

const AnswerDetailsModal: React.FC<AnswerDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  answer 
}) => {
  const {
    colors,
    darkMode,
    useTopDownLayout,
    selectedFact,
    handleOverlayClick,
    renderPhotoSection,
    renderRightPanel
  } = useAnswerDetailsModal({ isOpen, onClose, answer });

  const overlayContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={answerDetailsModalStyles.overlay}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={onClose}
            className={answerDetailsModalStyles.closeButton}
            style={{ color: 'white' }}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div 
            className={answerDetailsModalStyles.content(useTopDownLayout)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderPhotoSection()}
            {renderRightPanel(selectedFact)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window !== 'undefined') {
    return (
      <>
        {createPortal(overlayContent, document.body)}
        <style jsx global>{`
          .answer-details-scrollbar {
            scrollbar-width: auto;
          }
          .answer-details-scrollbar::-webkit-scrollbar {
            width: 4px;
            background: ${darkMode ? '#222' : '#555'};
          }
          .answer-details-scrollbar::-webkit-scrollbar-thumb {
            background: var(--color-${colors.primary});
            border-radius: 4px;
          }
        `}</style>
      </>
    );
  }

  return null;
};

export default AnswerDetailsModal;