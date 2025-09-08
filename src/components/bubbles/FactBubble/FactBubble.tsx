'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDragState } from '@/hooks/ui';
import styles from './FactBubble.module.css';
import { useFactBubble } from './hooks';
import { getBubbleClassNames, getIconClassNames, getResponsiveStyle, getTranslatedFactType } from './helpers';

interface FactBubbleProps {
  factType: string;
  isRevealed: boolean;
  'data-fact-index': number;
  className?: string;
  style?: React.CSSProperties;
  category?: string;
  slotIndex?: number;
}

const FactBubble = React.memo<FactBubbleProps>(({ 
  factType, 
  isRevealed, 
  'data-fact-index': factIndex,
  className = '',
  style = {},
  category = 'countries',
  slotIndex
}) => {
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

  const bubbleClassNames = getBubbleClassNames(isClickable);
  const iconClassNames = getIconClassNames(isClickable);
  const translatedFactType = getTranslatedFactType(factType, t);
  const responsiveStyle = getResponsiveStyle(style, responsiveValues.bubbleSize, responsiveValues.bubbleSpacing);

  const onDragStart = () => {
    if (isClickable) {
      setIsDragging(true);
      handleDragStart();
    }
  };

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
              className={styles[bubbleClassNames]}
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
                className={styles[iconClassNames]}
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
});

FactBubble.displayName = 'FactBubble';

export default FactBubble;