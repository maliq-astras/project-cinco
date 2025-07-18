export const streakDisplayStyles = {
  container: "flex flex-col items-center space-y-4 py-4",
  
  // Flame and streak count section
  flameSection: "flex items-center space-x-3",
  flameIcon: "flex items-center justify-center select-none",
  streakText: "flex flex-col items-center",
  streakNumber: "text-3xl font-bold font-iceberg",
  streakLabel: "text-sm text-gray-600 dark:text-gray-400 font-medium",
  
  // Weekly calendar section
  calendar: "flex flex-col items-center space-y-2",
  calendarGrid: "flex items-center justify-center space-x-2 sm:space-x-3",
  
  // Individual day column
  dayColumn: "flex flex-col items-center space-y-2",
  dayLabel: "text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider",
  dayIndicator: "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 relative border-2",
  checkmark: "text-white text-lg font-bold flex items-center justify-center absolute inset-0 leading-none",
  completedSymbol: "text-green-800 dark:text-white",
  failedSymbol: "text-red-800 dark:text-white",
  completedDay: "",
  failedDay: "", 
  missedDay: "",
  futureDay: "",
  transparentDay: "!bg-transparent",
  
  // Explanation text
  explanation: "text-xs text-gray-500 dark:text-gray-500 text-center max-w-xs leading-relaxed"
} as const; 