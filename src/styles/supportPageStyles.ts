import { CSSProperties } from 'react';

export const supportPageStyles = {
  // Main container - updated to prevent scrolling and use flex centering
  container: "h-screen bg-white dark:bg-gray-950 overflow-hidden flex flex-col",
  
  // Content container - updated to ensure proper centering
  contentContainer: "flex flex-col max-w-7xl mx-auto px-4 flex-1 overflow-hidden w-full",
  
  // Main content - use transform to push content down in portrait mode with better spacing
  mainContent: "flex-1 flex items-center justify-center overflow-hidden w-full",
  
  // Section styles - adjusted push down for portrait mode
  section: "flex flex-col justify-center items-center w-full md:portrait:translate-y-32 lg:portrait:translate-y-36 short:portrait:translate-y-8",
  
  // CARD STYLES - CRITICAL FOR CONSISTENCY
  // Fixed dimensions and styling for all support section cards - MUST BE UNIFORM ACROSS SCREENS
  // Added higher z-index to make sure cards appear in front of header
  card: "bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg flex flex-col overflow-hidden border-2 relative z-10",
  
  // Card dimensions - increasing height for portrait mode on tablets
  cardDimensions: "w-[95%] sm:w-[90%] md:w-[700px] h-[75vh] min-h-[450px] max-h-[550px] mx-auto max-[375px]:h-[65vh] max-[375px]:min-h-[400px] max-[375px]:w-[95%] portrait:h-[70vh] portrait:min-h-[450px] portrait:max-h-[650px] md:portrait:h-[75vh] md:portrait:min-h-[500px] md:portrait:max-h-[750px] short:h-[55vh] short:min-h-[350px] short:max-h-[420px] shorter:h-[45vh] shorter:min-h-[280px] shorter:max-h-[320px]",
  
  cardStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
  }),

  // Card internal structure - fixing scroll issue to ensure only accordion scrolls
  cardHeader: "text-center pt-3 md:pt-5 pb-2 md:pb-4 max-[375px]:pt-3 max-[375px]:pb-1 w-full",
  cardContent: "flex-1 px-4 md:px-8 pb-2 max-[375px]:px-3 w-full overflow-hidden",
  cardFooter: "mt-auto pt-2 pb-3 md:py-6 max-[375px]:pt-1 max-[375px]:pb-2 w-full flex justify-center",
  
  // Support section titles
  sectionTitle: "text-3xl md:text-4xl font-bold uppercase max-[375px]:text-2xl text-black dark:text-white",
  sectionTitleStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
  }),

  // Layout for content inside cards - improved for consistent mobile display
  sectionContentWrapper: "flex justify-center w-full h-full",
  sectionContentContainer: "w-full max-w-full sm:max-w-xs md:max-w-md mx-auto",
  
  // Form elements - standardized for ALL sections to use
  supportFormLabel: "block text-base md:text-lg font-semibold mb-3 md:mb-6 text-center text-black dark:text-white w-full max-[375px]:text-sm max-[375px]:mb-2",
  
  supportFormInput: "w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border mb-3 md:mb-6 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 max-[375px]:px-2 max-[375px]:py-1.5 max-[375px]:mb-2",
  supportFormInputStyle: (primaryColor: string): CSSProperties => ({
    borderColor: `var(--color-${primaryColor})`,
    outlineColor: `var(--color-${primaryColor})`,
  }),
  
  supportFormTextarea: "w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border mb-3 md:mb-6 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 min-h-[80px] md:min-h-[120px] max-[375px]:px-2 max-[375px]:py-1.5 max-[375px]:min-h-[60px] max-[375px]:mb-2",
  
  supportFormSelect: "w-full px-3 py-2 md:px-4 md:py-3 rounded-lg border mb-3 md:mb-6 bg-gray-50 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 max-[375px]:px-2 max-[375px]:py-1.5 max-[375px]:mb-2",
  
  supportFormButton: "mt-2 md:mt-4 px-4 py-2 md:px-6 md:py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 max-[375px]:mt-1 max-[375px]:px-3 max-[375px]:py-1.5 max-[375px]:text-sm",
  supportFormButtonStyle: (primaryColor: string): CSSProperties => ({
    backgroundColor: `var(--color-${primaryColor})`,
  }),
  
  // Progress bar - updated to be more elegant and contained
  supportProgressBar: "w-[60%] h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto",
  supportProgressBarFill: "h-full rounded-full",
  supportProgressBarFillStyle: (primaryColor: string, progress: number): CSSProperties => ({
    width: `${progress}%`,
    backgroundColor: `var(--color-${primaryColor})`,
  }),
  
  // Animation styles
  pageAnimation: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  sectionAnimation: {
    initial: { opacity: 0, x: "100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "-100%" },
    transition: { type: "spring", damping: 20, stiffness: 100 }
  },
  reverseAnimation: {
    initial: { opacity: 0, x: "-100%" },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: "100%" },
    transition: { type: "spring", damping: 20, stiffness: 100 }
  },
  loadingAnimation: {
    initial: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  
  // Navigation styles - updated for small height screens using the custom breakpoints
  navLinksContainer: "fixed bottom-6 md:bottom-8 lg:bottom-12 left-0 right-0 flex justify-between px-3 md:px-6 lg:px-16 z-20 max-[375px]:bottom-4 max-[375px]:px-2 short:bottom-2",
  navLink: "flex items-center gap-1 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-150 hover:scale-105 focus:outline-none max-[375px]:px-1.5 short:text-xs short:py-0.5 short:px-2",
  navLinkStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`,
    border: `1px solid var(--color-${primaryColor}30)`,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }),
  navIcon: "w-3 h-3 md:w-4 md:h-4 short:w-2.5 short:h-2.5",
  navIconStyle: (primaryColor: string): CSSProperties => ({
    color: `var(--color-${primaryColor})`
  }),
  navDotsContainer: "fixed bottom-2 md:bottom-3 lg:bottom-4 left-0 right-0 flex justify-center gap-2 md:gap-3 z-20 max-[375px]:bottom-1 max-[375px]:gap-1.5 short:bottom-0.5",
  navDot: "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-200 short:w-1 short:h-1",
  navDotStyle: (primaryColor: string, isActive: boolean): CSSProperties => ({
    backgroundColor: isActive ? `var(--color-${primaryColor})` : 'rgba(150, 150, 150, 0.3)',
    transform: isActive ? 'scale(1.2)' : 'scale(1)'
  }),
  loadingContainer: "fixed inset-0 flex items-center justify-center z-40 bg-white dark:bg-gray-950",
} as const; 