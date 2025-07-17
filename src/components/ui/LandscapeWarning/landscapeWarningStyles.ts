/**
 * Styles for the LandscapeWarning component
 */
export const landscapeWarningStyles = {
  container: 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm',
  content: 'flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg max-w-sm mx-4',
  icon: 'w-12 h-12 text-yellow-500 mb-4',
  title: 'text-xl font-semibold text-gray-900 mb-2',
  message: 'text-base text-gray-600 text-center',
  animation: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2 }
  }
}; 