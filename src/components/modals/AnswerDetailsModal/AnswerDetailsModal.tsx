import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useGameStore } from '@/store/gameStore';
import { capitalizeAnswer } from '@/helpers/gameLogic';
import { getFactIcon, useIconFilter } from '@/helpers/iconHelpers';
import { deviceDetection } from '@/helpers/deviceHelpers';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface AnswerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  answer: string;
}

const answerDetailsModalStyles = {
  // Overlay
  overlay: "fixed inset-0 bg-black bg-opacity-70 z-50 backdrop-blur-md flex items-center justify-center p-4",
  
  // Close button
  closeButton: "absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10",
  
  // Content containers
  content: (isBigMobileDevice: boolean, isSurfaceDuo: boolean, isMobileDevice: boolean, isLandscape: boolean) => {
    if (isSurfaceDuo) {
      return "flex flex-col h-full gap-2 justify-center overflow-hidden max-w-xs mx-auto"; // Minimal spacing for Surface Duo
    }
    if (isMobileDevice) {
      return "flex flex-col h-[92vh] gap-4 justify-start items-stretch overflow-hidden w-full px-4 pt-10"; // Fill viewport height on mobile and avoid X overlap
    }
    if (isLandscape) {
      return "flex flex-row h-full gap-8 items-center justify-center overflow-hidden w-full px-8"; // Side-by-side in landscape
    }
    // Stacked tablet/desktop portrait: avoid vertical re-centering shifts
    return "flex flex-col h-[92vh] gap-6 justify-start items-stretch overflow-hidden w-full max-w-none px-8 pt-8";
  },
  
  // Photo section - larger on mobile to fill space better
  photoSection: "flex-shrink-0",
  photoSize: (isLimitedHeightLandscape: boolean, isMobileDevice: boolean, isSurfaceDuo: boolean, isLandscape: boolean) => {
    if (isSurfaceDuo) {
      // Treat Surface Duo like stacked-tablet portrait to avoid “zoomed” look
      return 'w-full h-[38vh]';
    }
    if (isMobileDevice) {
      return 'w-full aspect-[3/2]'; // Mobile aspect ratio, full width
    }
    if (isLandscape) {
      return 'w-1/2 aspect-[16/10] max-h-[70vh]'; // Half width in landscape, taller aspect ratio
    }
    // Stacked tablet/desktop portrait: fixed height to avoid content shift
    return 'w-full h-[40vh]';
  },
  photoContainer: "relative bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden w-full h-full",
  placeholderPhoto: "w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600",
  
  // Right panel section - larger on mobile 
  rightPanel: (isLimitedHeightLandscape: boolean, isMobileDevice: boolean, isSurfaceDuo: boolean, isLandscape: boolean) => {
    if (isSurfaceDuo) {
      return 'flex-1 min-h-0 w-full overflow-hidden';
    }
    if (isMobileDevice) {
      return 'flex-1 min-h-0 w-full overflow-hidden'; // Flexible height panel on mobile; uses remaining space
    }
    if (isLandscape) {
      return 'flex-shrink-0 w-1/2 aspect-[16/10] max-h-[70vh]'; // Match landscape photo dimensions
    }
    // Stacked tablet/desktop portrait: let panel take remaining space and scroll internally
    return 'flex-1 min-h-0 w-full overflow-hidden';
  },
  
  // Grid view - adjusted for mobile
  gridContainer: (isMobileDevice: boolean, isSurfaceDuo: boolean, isLandscape: boolean) => {
    if (isMobileDevice) {
      return "w-full h-full overflow-y-auto"; // Allow internal scroll on mobile to avoid overlap
    }
    if (!isLandscape) {
      // Stacked tablet/desktop portrait
      return "w-full h-full overflow-y-auto";
    }
    return "w-full h-full flex items-center justify-center"; // Fill the rightPanel container on larger screens
  },
  factsGrid: (isMobileDevice: boolean, isSurfaceDuo: boolean, isExtraNarrowPhone?: boolean, isNarrowPhone?: boolean) => {
    if (isSurfaceDuo) {
      return "grid grid-cols-4 grid-rows-2 gap-2 w-full h-full max-w-none"; // Duo: tighter spacing
    }
    if (isMobileDevice) {
      const gap = isExtraNarrowPhone ? 'gap-1 px-1' : (isNarrowPhone ? 'gap-1 px-2' : 'gap-2 px-2');
      return `grid grid-cols-2 grid-rows-4 ${gap} w-full h-full max-w-none justify-center`;
    }
    return "grid grid-cols-4 grid-rows-2 gap-3 w-full h-full max-w-none px-4"; // Desktop/tablet: slightly tighter too
  },
  factIcon: (isMobileDevice: boolean, isNarrowPhone?: boolean, isExtraNarrowPhone?: boolean) => {
    const base = "aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 border-2";
    if (!isMobileDevice) return base;
    const widthClass = isExtraNarrowPhone ? 'w-[68%]' : (isNarrowPhone ? 'w-[57%]' : 'w-[78%]');
    return `${base} ${widthClass} mx-auto`;
  },
  factIconActive: "border-2",
  factIconImage: "w-9 h-9", // Slightly smaller to improve fit
  
  // Detail view - fills available space on mobile
  detailContainer: (isMobileDevice: boolean, isSurfaceDuo: boolean, isLandscape: boolean) => {
    return "w-full h-full flex flex-col"; // Simply fill the rightPanel container
  },
  backButton: "flex items-center gap-2 mb-3 text-sm cursor-pointer hover:opacity-70 transition-opacity",
  detailTitle: "text-lg font-bold mb-3 text-white",
  detailContent: (isMobileDevice: boolean) => {
    if (isMobileDevice) {
      return "flex-1 text-white leading-relaxed overflow-y-auto text-sm pr-2 scrollbar-always-visible"; // Fill panel and scroll internally
    }
    return "flex-1 text-white leading-relaxed overflow-y-auto text-lg pr-2 scrollbar-always-visible"; // Larger text on desktop
  },
};

const AnswerDetailsModal: React.FC<AnswerDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  answer 
}) => {
  const { colors, darkMode } = useTheme();
  const { language } = useLanguage();
  const challenge = useGameStore(state => state.gameState.challenge);
  const getFilter = useIconFilter();
  
  // Detect mobile device for special mobile styling
  const isMobileDevice = typeof window !== 'undefined' ? 
    window.innerWidth < 480 && Math.max(window.innerWidth, window.innerHeight) < 1000 : false;
  const isExtraNarrowPhone = typeof window !== 'undefined' ? window.innerWidth <= 330 : false;
  const isNarrowPhone = typeof window !== 'undefined' ? !isExtraNarrowPhone && window.innerWidth <= 375 : false;
  
  // Detect bigger phones that need extra spacing
  const isBigMobileDevice = typeof window !== 'undefined' ? 
    isMobileDevice && Math.max(window.innerWidth, window.innerHeight) > 850 : false;
  
  // Detect landscape screens with limited height that need smaller content
  const isLimitedHeightLandscape = typeof window !== 'undefined' ? 
    window.innerWidth > window.innerHeight && 
    window.innerHeight < 1000 : false;
  
  // Detect regular landscape (tablets)
  const isLandscape = typeof window !== 'undefined' ? 
    window.innerWidth > window.innerHeight : false;
  
  // Detect Surface Duo for special sizing
  const isSurfaceDuo = typeof window !== 'undefined' ? deviceDetection.isSurfaceDuo() : false;
  
  const [selectedFact, setSelectedFact] = useState<number | null>(null);

  // Get the actual 8 fact types from the current game
  const factTypes = challenge?.facts?.map(fact => fact.factType) || [];
  const category = challenge?.category?.toString().toLowerCase() || 'countries';

  // Get the proper icon filter for this category
  const iconFilter = getFilter(category);

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
    <div className={`${answerDetailsModalStyles.photoSection} ${answerDetailsModalStyles.photoSize(isLimitedHeightLandscape, isMobileDevice, isSurfaceDuo, isLandscape)}`}>
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
    <div className={answerDetailsModalStyles.gridContainer(isMobileDevice, isSurfaceDuo, isLandscape)}>
      <div className={answerDetailsModalStyles.factsGrid(isMobileDevice, isSurfaceDuo, isExtraNarrowPhone, isNarrowPhone)}>
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
      className={answerDetailsModalStyles.detailContainer(isMobileDevice, isSurfaceDuo, isLandscape)}
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
    <div className={answerDetailsModalStyles.rightPanel(isLimitedHeightLandscape, isMobileDevice, isSurfaceDuo, isLandscape)}>
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
            className={answerDetailsModalStyles.content(isBigMobileDevice, isSurfaceDuo, isMobileDevice, isLandscape)}
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