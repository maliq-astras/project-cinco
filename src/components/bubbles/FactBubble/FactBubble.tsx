'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFactBubble } from './useFactBubble';
import { useDragState } from '@/hooks/useDragState';
import { factBubbleStyles, getBubbleClassNames } from './FactBubble.styles';
import { getFactTypeName } from '@/helpers/i18nHelpers';

interface FactBubbleProps {
  factType: string;
  isRevealed: boolean;
  'data-fact-index': number;
  className?: string;
  style?: React.CSSProperties;
  category?: string;
  id?: string;
}

/**
 * Component that displays a circular bubble representing a fact type
 * Supports interactions, animations, and responsive design
 */
export default function FactBubble({ 
  factType, 
  isRevealed, 
  'data-fact-index': factIndex,
  className = '',
  style = {},
  category = 'countries',
  id
}: FactBubbleProps) {
  const { t } = useTranslation();
  const setIsDragging = useDragState(state => state.setIsDragging);
  
  const {
    // State
    isPopping,
    isClickable,
    
    // UI Elements
    icon,
    particles,
    colors,
    
    // Animation
    bubbleAnimation,
    
    // Handlers
    handleDragStart,
    handleDragEnd,
    mouseHandlers,
    
    // Styling
    getIconFilter,
    popPosition
  } = useFactBubble({
    factType,
    isRevealed,
    factIndex,
    category
  });

  // Get appropriate classNames
  const bubbleClassNames = getBubbleClassNames({
    isClickable
  });

  // Get translated fact type
  const translatedFactType = getFactTypeName(factType, t);

  // Handle drag start - now uses the hook's handleDragStart
  const onDragStart = () => {
    if (isClickable) {
      setIsDragging(true);
      handleDragStart(); // This will set hoveredFact to show category name
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      style={style}
      {...mouseHandlers}
    >
      <div className={factBubbleStyles.container}>
        <AnimatePresence>
          {!isRevealed && !isPopping && (
            <motion.button
              key={`bubble-${factIndex}`}
              className={bubbleClassNames}
              style={{
                borderColor: `var(--color-${colors.primary})`
              }}
              drag={isClickable}
              dragConstraints={false}
              dragElastic={0.1}
              dragMomentum={false}
              dragSnapToOrigin={true}
              onDragStart={onDragStart}
              onDragEnd={(event, info) => {
                setIsDragging(false);
                handleDragEnd(event, info);
              }}
              whileHover={{ scale: isClickable ? 1.05 : 1 }}
              whileTap={{ scale: isClickable ? 0.95 : 1 }}
              animate={isPopping ? bubbleAnimation : {}}
              whileDrag={{ zIndex: 50 }}
            >
              <img 
                src={`/icons/${icon.iconName}.svg`}
                alt={translatedFactType}
                width={icon.size}
                height={icon.size}
                style={{
                  ...factBubbleStyles.icon(isClickable),
                  filter: getIconFilter(icon.category)
                }}
                draggable="false"
              />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Particle effects that appear during pop animation */}
        <AnimatePresence>
          {isPopping && !isRevealed && (
            <>
              {particles.map((particle, index) => (
                <motion.div
                  key={`particle-${index}`}
                  className={`${factBubbleStyles.particle} bg-${colors.primary}`}
                  style={factBubbleStyles.particleContainer(popPosition.x, popPosition.y)}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ 
                    x: particle.x, 
                    y: particle.y, 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: particle.rotate
                  }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.3, 1],
                    ease: "easeOut" 
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 