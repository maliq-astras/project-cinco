import styles from './AnswerDetailsModal.module.css';

export const answerDetailsModalStyles = {
  // Static styles from CSS modules
  overlay: styles.overlay,
  closeButton: styles.closeButton,
  photoSection: styles.photoSection,
  photoContainer: styles.photoContainer,
  placeholderPhoto: styles.placeholderPhoto,
  factIconActive: styles.factIconActive,
  factIconImage: styles.factIconImage,
  backButton: styles.backButton,
  detailTitle: styles.detailTitle,
  
  // Dynamic content container styles
  content: (isBigMobileDevice: boolean, isMobileDevice: boolean, isLandscape: boolean) => {
    if (isMobileDevice) {
      return "flex flex-col h-[92vh] gap-4 justify-start items-stretch overflow-hidden w-full px-4 pt-10"; // Fill viewport height on mobile and avoid X overlap
    }
    if (isLandscape) {
      return "flex flex-row h-full gap-8 items-center justify-center overflow-hidden w-full px-8"; // Side-by-side in landscape
    }
    // Stacked tablet/desktop portrait: avoid vertical re-centering shifts
    return "flex flex-col h-[92vh] gap-6 justify-start items-stretch overflow-hidden w-full max-w-none px-8 pt-8";
  },
  
  // Dynamic photo size styles
  photoSize: (isLimitedHeightLandscape: boolean, isMobileDevice: boolean, isLandscape: boolean) => {
    if (isMobileDevice) {
      return 'w-full aspect-[3/2]'; // Mobile aspect ratio, full width
    }
    if (isLandscape) {
      return 'w-1/2 aspect-[16/10] max-h-[70vh]'; // Half width in landscape, taller aspect ratio
    }
    // Stacked tablet/desktop portrait: fixed height to avoid content shift
    return 'w-full h-[40vh]';
  },
  
  // Dynamic right panel styles
  rightPanel: (isLimitedHeightLandscape: boolean, isMobileDevice: boolean, isLandscape: boolean) => {
    if (isMobileDevice) {
      return 'flex-1 min-h-0 w-full overflow-hidden'; // Flexible height panel on mobile; uses remaining space
    }
    if (isLandscape) {
      return 'flex-shrink-0 w-1/2 aspect-[16/10] max-h-[70vh]'; // Match landscape photo dimensions
    }
    // Stacked tablet/desktop portrait: let panel take remaining space and scroll internally
    return 'flex-1 min-h-0 w-full overflow-hidden';
  },
  
  // Dynamic grid container styles
  gridContainer: (isMobileDevice: boolean, isLandscape: boolean) => {
    if (isMobileDevice) {
      return "w-full h-full overflow-y-auto"; // Allow internal scroll on mobile to avoid overlap
    }
    if (!isLandscape) {
      // Stacked tablet/desktop portrait
      return "w-full h-full overflow-y-auto";
    }
    return "w-full h-full flex items-center justify-center"; // Fill the rightPanel container on larger screens
  },
  
  // Dynamic facts grid styles
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
  
  // Dynamic fact icon styles
  factIcon: (isMobileDevice: boolean, isNarrowPhone?: boolean, isExtraNarrowPhone?: boolean) => {
    const base = "aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 border-2";
    if (!isMobileDevice) return base;
    const widthClass = isExtraNarrowPhone ? 'w-[68%]' : (isNarrowPhone ? 'w-[57%]' : 'w-[78%]');
    return `${base} ${widthClass} mx-auto`;
  },
  
  // Dynamic detail container styles
  detailContainer: () => {
    return "w-full h-full flex flex-col"; // Simply fill the rightPanel container
  },
  
  // Dynamic detail content styles
  detailContent: (isMobileDevice: boolean) => {
    if (isMobileDevice) {
      return "flex-1 text-white leading-relaxed overflow-y-auto text-sm pr-2 scrollbar-always-visible"; // Fill panel and scroll internally
    }
    return "flex-1 text-white leading-relaxed overflow-y-auto text-lg pr-2 scrollbar-always-visible"; // Larger text on desktop
  },
} as const;
