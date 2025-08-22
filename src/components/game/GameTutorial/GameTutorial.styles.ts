import { CSSProperties } from 'react';
import styles from './GameTutorial.module.css';

/**
 * Hybrid styles for GameTutorial component
 * 
 * This file acts as a bridge between the component and CSS modules:
 * - Static styles are imported from GameTutorial.module.css
 * - Complex dynamic functions remain for DOM queries and calculations
 * - Animation-critical styles remain as objects
 */

export const gameTutorialStyles = {
  // Static styles from CSS modules
  container: styles.container,
  overlay: styles.overlay,
  overlayMask: (spotlightStyles: { left: string; top: string; width: string; height: string }, isLogo: boolean = false): CSSProperties => {
    // Calculate the center and radius for the ellipse when highlighting the logo
    const x = parseFloat(spotlightStyles.left);
    const y = parseFloat(spotlightStyles.top);
    const width = parseFloat(spotlightStyles.width);
    const height = parseFloat(spotlightStyles.height);
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    // Use rounded rectangle for logo, standard rect for other elements
    const maskShape = isLogo
      ? `<rect x='${x}' y='${y}' width='${width}' height='${height}' rx='12' fill='black'/>`
      : `<rect x='${x}' y='${y}' width='${width}' height='${height}' rx='8' fill='black'/>`;
    
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='mask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E${encodeURIComponent(maskShape)}%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' mask='url(%23mask)' fill='black'/%3E%3C/svg%3E")`,
      maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cmask id='mask'%3E%3Crect width='100%25' height='100%25' fill='white'/%3E${encodeURIComponent(maskShape)}%3C/mask%3E%3C/defs%3E%3Crect width='100%25' height='100%25' mask='url(%23mask)' fill='black'/%3E%3C/svg%3E")`,
    };
  },
  spotlight: (spotlightStyles: { top: string; left: string; width: string; height: string }, isLogo: boolean = false, isDarkMode: boolean = false): CSSProperties => {
    // Use the same positioning as the mask for perfect alignment
    const y = parseFloat(spotlightStyles.top);
    const width = parseFloat(spotlightStyles.width);
    const height = parseFloat(spotlightStyles.height);
    const x = parseFloat(spotlightStyles.left);
    
    return {
      top: y + 'px',
      left: x + 'px',
      width: width + 'px',
      height: height + 'px',
      borderRadius: isLogo ? '12px' : '10px',
      pointerEvents: 'none' as const,
      border: 'none',
      outline: isDarkMode 
        ? '3px solid rgba(255, 255, 255, 0.8)' 
        : '3px solid white',
      outlineOffset: '0px',
      boxShadow: isDarkMode 
        ? '0 0 20px 5px rgba(255, 255, 255, 0.5)' 
        : '0 0 20px 5px rgba(255, 255, 255, 0.8)',
      backgroundColor: 'transparent',
    };
  },
  spotlightWrapper: styles.spotlightWrapper,
  textBox: styles.textBox,
  textBoxTitle: styles.textBoxTitle,
  textBoxDescription: styles.textBoxDescription,
  progressContainer: styles.progressContainer,
  progressDots: styles.progressDots,
  progressDot: styles.progressDot,
  progressText: styles.progressText,

  // Animations
  textBoxAnimation: {
    initial: { opacity: 0, scale: 0.9 },
    animate: (textBoxStyles: { left: string; top: string; width: string }) => ({ 
      opacity: 1,
      scale: 1,
      x: parseFloat(textBoxStyles.left),
      y: parseFloat(textBoxStyles.top),
      width: parseFloat(textBoxStyles.width)
    }),
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
      layout: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  },
  progressAnimation: {
    initial: { opacity: 0 },
    animate: () => ({ 
      opacity: 1,
      y: 0
    }),
    transition: { 
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  },

  // Text box styles
  textBoxBorder: (primaryColor: string, isDarkMode: boolean = false): CSSProperties => {
    return {
      borderColor: `var(--color-${primaryColor})`,
      boxShadow: isDarkMode 
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.5)' 
        : '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
    };
  },
  
  // Progress dot styles
  progressDotColor: (primaryColor: string, isActive: boolean): CSSProperties => ({
    backgroundColor: isActive 
      ? `var(--color-${primaryColor})`
      : `var(--color-${primaryColor}30)`
  }),
  
  // Progress text styles
  progressTextShadow: {
    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
  },
} as const; 