/**
 * Extracted Tailwind classes for the GuessProgressBar component
 */

export const guessProgressBarStyles = {
  container: "w-full",
  progressBar: "flex w-full h-4 sm:h-5 overflow-hidden rounded-full shadow-sm relative",
  progressSegment: "flex-1 relative bg-gray-200 dark:bg-gray-700 overflow-hidden",
  progressSegmentBorder: "border-l-2 border-white dark:border-gray-900",
  filledSegment: "absolute inset-0",
  shineEffect: "absolute inset-0 bg-gradient-to-b from-white to-transparent opacity-10",
  bottomShadow: "absolute inset-x-0 bottom-0 h-[1px] opacity-20",
  sparkContainer: "absolute inset-0 pointer-events-none",
  pulseEffect: "absolute inset-0 rounded-full pointer-events-none"
};

/**
 * Animation classes
 */
export const progressAnimations = {
  shake: "animate-shake",
  fadeOut: "animate-fadeOut",
  fadeIn: "animate-fadeIn"
};

/**
 * Transition settings for segment filling animation
 */
export const segmentTransition = {
  duration: 0.7,
  ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
  staggerDelay: 0.1 // Delay between segment animations
}; 