/**
 * Styles for the FactCardStackContainer component
 */
export const factCardStackContainerStyles = {
  // Container styles
  container: "w-full max-w-4xl rounded-lg p-2 sm:p-3 md:p-4 mb-2 sm:mb-4 relative",
  
  // Inner container
  innerContainer: "flex flex-col sm:flex-row items-center sm:justify-between w-full h-full",
  
  // Card stack wrapper
  cardStackWrapper: "w-full",
  
  // Placeholder styles
  placeholder: {
    container: "flex items-center justify-center w-full h-full absolute top-0 left-0 right-0 bottom-0 z-10",
    element: "border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg w-[80%] max-w-[350px] h-[120px] sm:h-[140px] md:h-[160px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center",
    text: "text-gray-400 dark:text-gray-500 font-display text-sm sm:text-base"
  }
}; 