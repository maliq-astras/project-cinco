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
    isPopping,
    isClickable,
    icon,
    particles,
    colors,
    bubbleAnimation,
    handleDragStart,
    handleDragEnd,
    mouseHandlers,
    getIconFilter,
    popPosition,
    bubbleRef,
    responsiveValues
  } = useFactBubble({
    factType,
    isRevealed,
    factIndex,
    category,
    slotIndex
  });

  const bubbleClassNames = isClickable ? styles.bubbleClickable : styles.bubbleNotClickable;
  const translatedFactType = getFactTypeName(factType, t);

  const onDragStart = () => {
    if (isClickable) {
      setIsDragging(true);
      handleDragStart();
    }
  };

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