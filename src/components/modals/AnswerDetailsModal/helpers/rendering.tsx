import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { capitalizeAnswer } from '@/helpers/gameLogic';
import { getFactIcon } from '@/helpers/iconHelpers';
import { answerDetailsModalStyles } from './styles';
import { Quicksand } from 'next/font/google';
import { Challenge, ThemeColors } from '@/types';

const quicksand = Quicksand({ subsets: ['latin'] });

interface Dimensions {
  videoWidth: number;
  videoHeight: number;
  squareSize: number;
  rectHeight: number;
  gridGap: number;
  gridWidth: number;
  gridHeight: number;
  isMobileLayout: boolean;
}

interface RenderingHelpers {
  answer: string;
  challenge: Challenge;
  dimensions: Dimensions;
  factTypes: string[];
  category: string;
  colors: ThemeColors;
  placeholderFacts: string[];
  language: string;
  useTopDownLayout: boolean;
  darkMode: boolean;
  handleFactSelect: (index: number) => void;
  handleBackToGrid: () => void;
}

export const createRenderingHelpers = (props: RenderingHelpers) => {
  const {
    answer,
    challenge,
    dimensions,
    factTypes,
    category,
    colors,
    placeholderFacts,
    language,
    useTopDownLayout,
    darkMode,
    handleFactSelect,
    handleBackToGrid
  } = props;

  const renderPhotoSection = () => (
    <div style={answerDetailsModalStyles.photoSection(dimensions)}>
      <div className={answerDetailsModalStyles.photoContainer}>
        {challenge?.youtubeUrl ? (
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
        ) : challenge?.metadata?.imageUrl ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={challenge.metadata.imageUrl}
              alt={`Photo of ${capitalizeAnswer(answer)}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        ) : (
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
        
        {challenge?.citation && (
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs text-white/80">{challenge.citation}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFactsGrid = () => (
    <div style={answerDetailsModalStyles.gridContainer(dimensions)}>
      <div style={answerDetailsModalStyles.factsGrid(dimensions)}>
        {factTypes.map((factType, index) => {
          const icon = getFactIcon(factType, false, Math.round(dimensions.squareSize * 0.4), category);
          
          return (
            <motion.div
              key={index}
              onClick={() => handleFactSelect(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...answerDetailsModalStyles.factIcon(dimensions),
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
                  filter: 'brightness(0) invert(1)',
                  opacity: 1,
                  width: `${Math.round(dimensions.squareSize * 0.4)}px`,
                  height: `${Math.round(dimensions.squareSize * 0.4)}px`
                }}
                draggable="false"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const renderFactDetails = (selectedFact: number) => (
    <motion.div 
      style={answerDetailsModalStyles.detailContainer(dimensions)}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ 
        marginBottom: useTopDownLayout ? '16px' : '24px', 
        width: useTopDownLayout ? '100%' : `${dimensions.videoWidth}px`
      }}>
        <h3 
          style={{ 
            fontSize: useTopDownLayout ? '20px' : '24px',
            fontWeight: 'bold',
            color: darkMode ? `var(--color-${colors.primary})` : 'white',
            margin: 0,
            textAlign: 'center'
          }}
        >
          {factTypes[selectedFact]}
        </h3>
      </div>
      
      <div 
        className={`answer-details-scrollbar ${quicksand.className}`}
        style={{
          ...answerDetailsModalStyles.detailContent(useTopDownLayout, dimensions)
        }}
      >
        {challenge?.expanded?.[factTypes[selectedFact]]?.[language as 'en' | 'es'] || placeholderFacts[selectedFact]}
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-start',
        marginTop: useTopDownLayout ? '16px' : '24px',
        width: useTopDownLayout ? '100%' : `${dimensions.videoWidth}px`
      }}>
        <button
          onClick={handleBackToGrid}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '50%',
            transition: 'opacity 0.2s',
            color: darkMode ? `var(--color-${colors.primary})` : 'white',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="Go back to facts grid"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );

  const renderRightPanel = (selectedFact: number | null) => (
    <div style={answerDetailsModalStyles.rightPanel(useTopDownLayout, dimensions)}>
      {selectedFact === null ? renderFactsGrid() : renderFactDetails(selectedFact)}
    </div>
  );

  return {
    renderPhotoSection,
    renderFactsGrid,
    renderFactDetails,
    renderRightPanel
  };
};