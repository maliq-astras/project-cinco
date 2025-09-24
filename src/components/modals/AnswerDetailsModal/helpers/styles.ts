import styles from '../AnswerDetailsModal.module.css';

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

export const answerDetailsModalStyles = {
  // Static styles from CSS modules
  overlay: styles.overlay,
  closeButton: styles.closeButton,
  photoContainer: styles.photoContainer,
  placeholderPhoto: styles.placeholderPhoto,
  factIconImage: styles.factIconImage,
  
  // 2 states: top/down (mobile) vs side/side (desktop) 
  content: (useTopDownLayout: boolean) => {
    if (useTopDownLayout) {
      return "flex flex-col gap-4 items-center justify-start overflow-hidden w-full px-4 py-4 max-h-[95dvh]";
    } else {
      return "flex flex-row gap-8 items-center justify-center overflow-hidden w-full px-8 py-8 max-h-[90dvh]";
    }
  },
  
  // Video/photo section with exact calculated dimensions
  photoSection: (dimensions: Dimensions) => ({
    width: `${dimensions.videoWidth}px`,
    height: `${dimensions.videoHeight}px`,
    flexShrink: 0
  }),
  
  // Right panel (side-by-side) or bottom panel (top/down) 
  rightPanel: (useTopDownLayout: boolean, dimensions: Dimensions) => {
    if (useTopDownLayout) {
      // Mobile: same as before
      return {
        width: `${dimensions.gridWidth}px`,
        height: `${dimensions.gridHeight}px`,
        flexShrink: 0
      };
    } else {
      // Desktop: extra height for title above + arrow below
      const titleHeight = 60; // Space for title above
      const arrowHeight = 60; // Space for arrow below
      const totalHeight = dimensions.videoHeight + titleHeight + arrowHeight;
      
      return {
        width: `${dimensions.gridWidth}px`,
        height: `${totalHeight}px`,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center'
      };
    }
  },
  
  // Grid container - matches exact dimensions
  gridContainer: (dimensions: Dimensions) => ({
    width: `${dimensions.gridWidth}px`,
    height: `${dimensions.gridHeight}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  
  // Facts grid - 2x4 rectangles (mobile) or 4x2 squares (desktop)
  factsGrid: (dimensions: Dimensions) => ({
    display: 'grid',
    gridTemplateColumns: dimensions.isMobileLayout 
      ? `repeat(2, ${dimensions.squareSize}px)` 
      : `repeat(4, ${dimensions.squareSize}px)`,
    gridTemplateRows: dimensions.isMobileLayout 
      ? `repeat(4, ${dimensions.rectHeight}px)` 
      : `repeat(2, ${dimensions.rectHeight}px)`,
    gap: `${dimensions.gridGap}px`,
    width: `${dimensions.gridWidth}px`,
    height: `${dimensions.gridHeight}px`
  }),
  
  // Fact icon - width x height (rectangle on mobile, square elsewhere)
  factIcon: (dimensions: Dimensions) => ({
    width: `${dimensions.squareSize}px`,
    height: `${dimensions.rectHeight}px`,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid'
  }),
  
  // Detail container - organized layout for category + text + arrow
  detailContainer: (dimensions: Dimensions) => {
    if (dimensions.isMobileLayout) {
      // Mobile: same as before
      return {
        width: `${dimensions.gridWidth}px`,
        height: `${dimensions.gridHeight}px`,
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '16px',
        boxSizing: 'border-box' as const
      };
    } else {
      // Desktop: no height constraint, let it expand naturally
      return {
        width: `${dimensions.gridWidth}px`,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center'
      };
    }
  },
  
  // Detail content - matches video dimensions on desktop, flexible on mobile
  detailContent: (isMobileLayout: boolean, dimensions: Dimensions) => {
    const fontSize = isMobileLayout ? '16px' : '18px'; // Bigger font sizes
    
    if (isMobileLayout) {
      // Mobile: flexible height
      return {
        flex: 1,
        color: 'white',
        lineHeight: '1.6',
        overflowY: 'auto' as const,
        fontSize,
        paddingRight: '8px',
        minHeight: 0
      };
    } else {
      // Desktop: match video dimensions exactly
      return {
        width: `${dimensions.videoWidth}px`,
        height: `${dimensions.videoHeight}px`,
        color: 'white',
        lineHeight: '1.6',
        overflowY: 'auto' as const,
        fontSize,
        padding: '16px',
        boxSizing: 'border-box' as const,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px'
      };
    }
  }
} as const;