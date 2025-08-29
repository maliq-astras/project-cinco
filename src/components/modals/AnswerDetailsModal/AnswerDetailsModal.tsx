import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { capitalizeAnswer } from '@/helpers/gameLogic';
import { getFactIcon } from '@/helpers/iconHelpers';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { answerDetailsModalStyles } from './AnswerDetailsModal.styles';
import { useAnswerDetailsModal } from './useAnswerDetailsModal';

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
  const { colors, darkMode } = useTheme();
  const { language } = useLanguage();
  const challenge = useGameStore(state => state.gameState.challenge);
  
  const {
    selectedFact,
    setSelectedFact,
    isMobileDevice,
    isExtraNarrowPhone,
    isNarrowPhone,
    isBigMobileDevice,
    isLimitedHeightLandscape,
    isLandscape
  } = useAnswerDetailsModal({ isOpen });

  // Get the actual 8 fact types from the current game
  const factTypes = challenge?.facts?.map(fact => fact.factType) || [];
  const category = challenge?.category?.toString().toLowerCase() || 'countries';



  // Placeholder facts
  const placeholderFacts = factTypes.map((factType) => {
    const factTypeMap: { [key: string]: string } = {
      'Language(s)': "Detailed information about the languages spoken in this country, including official languages, dialects, and linguistic diversity.",
      'Flag': "The story behind the flag design, its colors, symbols, and what they represent in the country's history and culture.",
      'Notable City': "Information about major cities, their significance, population, and what makes them important to the country.",
      'Political History': "The political system, government structure, and major historical political events that shaped the nation.",
      'Economy': "Economic data including major industries, exports, GDP information, and what drives the country's economy.",
      'Culture & Tradition': "Cultural practices, festivals, traditions, cuisine, and customs that define the country's identity.",
      'Geography & Border': "Physical geography, neighboring countries, major landforms, climate, and geographical features.",
      'Wildcard': "Unique and interesting facts that don't fit into other categories but are fascinating about this country."
    };
    
    return factTypeMap[factType] || `Detailed information about ${factType.toLowerCase()} related to this answer.`;
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderPhotoSection = () => (
    <div className={`${answerDetailsModalStyles.photoSection} ${answerDetailsModalStyles.photoSize(isLimitedHeightLandscape, isMobileDevice, isLandscape)}`}>
      <div className={answerDetailsModalStyles.photoContainer}>
        {challenge?.youtubeUrl ? (
          // YouTube video embed
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <iframe
              src={challenge.youtubeUrl}
              title={`Video of ${capitalizeAnswer(answer)}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : challenge?.imageUrl ? (
          // Cloudinary image
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={challenge.imageUrl}
              alt={`Photo of ${capitalizeAnswer(answer)}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          // Placeholder
          <div className={answerDetailsModalStyles.placeholderPhoto}>
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-400">Media for {capitalizeAnswer(answer)}</p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-500">(Placeholder)</p>
            </div>
          </div>
        )}
        
        {/* Citation text */}
        {challenge?.citation && (
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs text-white/80">{challenge.citation}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFactsGrid = () => (
    <div className={answerDetailsModalStyles.gridContainer(isMobileDevice, isLandscape)}>
      <div className={answerDetailsModalStyles.factsGrid(isMobileDevice, isExtraNarrowPhone, isNarrowPhone)}>
        {factTypes.map((factType, index) => {
          const icon = getFactIcon(factType, false, 32, category);
          
          return (
            <motion.div
              key={index}
              className={answerDetailsModalStyles.factIcon(isMobileDevice, isNarrowPhone, isExtraNarrowPhone)}
              onClick={() => setSelectedFact(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: `var(--color-${colors.primary})`,
                borderColor: `var(--color-${colors.primary})`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <img 
                src={`/icons/${icon.iconName}.svg`}
                alt={factType}
                className={answerDetailsModalStyles.factIconImage}
                style={{
                  filter: 'brightness(0) invert(1)', // Makes icons white
                  opacity: 1
                }}
                draggable="false"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderFactDetails = () => (
    <motion.div 
      className={answerDetailsModalStyles.detailContainer()}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Centered category title */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-white dark:text-white" style={{ color: darkMode ? `var(--color-${colors.primary})` : 'white' }}>
          {factTypes[selectedFact!]}
        </h3>
      </div>
      
      {/* Fact content */}
      <div 
        className={answerDetailsModalStyles.detailContent(isMobileDevice)}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `var(--color-${colors.primary}) transparent`
        }}
      >
        {challenge?.expanded?.[factTypes[selectedFact!]]?.[language] || placeholderFacts[selectedFact!]}
      </div>
      
      {/* Left-aligned rounded back arrow button */}
      <div className="flex justify-start mt-6">
        <button
          onClick={() => setSelectedFact(null)}
          className="flex items-center gap-2 px-3 py-2 rounded-full transition-colors hover:opacity-80"
          style={{ color: darkMode ? `var(--color-${colors.primary})` : 'white' }}
          aria-label="Go back to facts grid"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
    </motion.div>
  );

  const renderRightPanel = () => (
    <div className={answerDetailsModalStyles.rightPanel(isLimitedHeightLandscape, isMobileDevice, isLandscape)}>
      {selectedFact === null ? renderFactsGrid() : renderFactDetails()}
    </div>
  );

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
          {/* Close button */}
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

          {/* Content */}
          <motion.div 
            className={answerDetailsModalStyles.content(isBigMobileDevice, isMobileDevice, isLandscape)}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderPhotoSection()}
            {renderRightPanel()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render using portal to document.body
  if (typeof window !== 'undefined') {
    return createPortal(overlayContent, document.body);
  }

  // Fallback for SSR
  return null;
};

export default AnswerDetailsModal;
