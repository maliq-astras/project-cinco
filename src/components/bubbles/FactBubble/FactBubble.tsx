'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useFactBubble } from './useFactBubble';
import { useDragState } from '@/hooks/ui';
import styles from './FactBubble.module.css';
import { getFactTypeName } from '@/helpers/i18nHelpers';

interface FactBubbleProps {
  factType: string;
  isRevealed: boolean;
  'data-fact-index': number;
  className?: string;
  style?: React.CSSProperties;
  category?: string;
  id?: string;
  slotIndex?: number;
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
  id,
  slotIndex
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
    popPosition,
    
    // DOM refs
    bubbleRef,
    
    // Responsive values from our new system
    responsiveValues
  } = useFactBubble({
    factType,
    isRevealed,
    factIndex,
    category,
    slotIndex
  });

  // Get appropriate classNames using CSS modules
  const bubbleClassNames = isClickable ? styles.bubbleClickable : styles.bubbleNotClickable;

  // Get translated fact type
  const translatedFactType = getFactTypeName(factType, t);

  // Handle drag start - now uses the hook's handleDragStart
  const onDragStart = () => {
    if (isClickable) {
      setIsDragging(true);
      handleDragStart(); // This will set hoveredFact to show category name
    }
  };

  // Create responsive style with bubble size from our new system
  const responsiveStyle = {
    ...style,
    '--bubble-size': `${responsiveValues.bubbleSize}px`,
    '--bubble-spacing': `${responsiveValues.bubbleSpacing}px`
  } as React.CSSProperties;

  return (
    <div 
      className={`relative ${className}`}
      style={responsiveStyle}
      {...mouseHandlers}
    >
      <div className={styles.container}>
        <AnimatePresence>
          {!isRevealed && !isPopping && (
            <motion.button
              ref={bubbleRef}
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
                className={isClickable ? styles.iconClickable : styles.iconNotClickable}
                style={{
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
                  className={`${styles.particle} bg-${colors.primary}`}
                  style={{
                    position: 'fixed',
                    left: popPosition.x,
                    top: popPosition.y,
                    transform: 'translate(-50%, -50%)'
                  }}
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